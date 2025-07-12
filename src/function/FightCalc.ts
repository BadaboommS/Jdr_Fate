import { CharDebuffInterface, CharStatsInterface, CharBuffInterface, BuffInterface, DebuffInterface, CharStatsCaracteristicsValueInterface, CharCaracteristicsOverloadInterface, EffectInterface } from "../types/statsType";
import { updateCombatStatsCalc } from "./BaseStatsCalc";
import { rollDice, updateCharData } from "./GlobalFunction";
import { getAllDebbuffs, selectRandomDebuff } from "../data/CCDebuff";
import { findPreset } from "../data/EffectPreset";
import { FightStanceInterface, findStanceBase } from "../data/FightStance";

export function handleTurn(
    firstActor: CharStatsInterface | null,
    secondActor: CharStatsInterface | null,
    charData: CharStatsInterface[],
    handleHistoryEventAdd: (msg: string, type: string, title?: string) => void,
    nbAtk?: number
){
    if(!firstActor || !secondActor){ return; };
    let currentData = [ ...charData ];

    // Turn effect
    const turnEffectActorA = applyTurnEffect(firstActor, handleHistoryEventAdd);
    const turnEffectActorB = applyTurnEffect(secondActor, handleHistoryEventAdd);

    // Coût en Mana
    const actorAManaUsed = handleTurnManaCost(turnEffectActorA, handleHistoryEventAdd);
    const actorBManaUsed = handleTurnManaCost(turnEffectActorB, handleHistoryEventAdd);

    // Initiative
    const { iniFirstActor, iniSecondActor } = handleIniCalc(actorAManaUsed, actorBManaUsed, handleHistoryEventAdd);

    // Set Data
    currentData = updateCharData(currentData, iniFirstActor, iniSecondActor); // Set Data
   
    // First ATK
    const firstAtkRes = handleFightAtk(firstActor.Id, secondActor.Id, currentData, handleHistoryEventAdd, nbAtk);
    if(!firstAtkRes){ return currentData };

    currentData = updateCharData(currentData, firstAtkRes.defenderData, firstAtkRes.attackerData); // Set Data

    // Second ATK
    const secondAtkRes = handleFightAtk(secondActor.Id, firstActor.Id, currentData, handleHistoryEventAdd, nbAtk);
    if(!secondAtkRes){ return currentData };

    // Remove Ini bonus
    let iniRemovedFirstActor = secondAtkRes.defenderData; let iniRemovedSecondActor = secondAtkRes.attackerData;
    if(iniRemovedFirstActor.BuffsList.find((effect) => effect.Name === "Bonus Initiative 1" || effect.Name === "Bonus Initiative 2" )){ const iniBuff = iniRemovedFirstActor.BuffsList.find((effect) => effect.Name === "Bonus Initiative 1" || effect.Name === "Bonus Initiative 2"); if(iniBuff) iniRemovedFirstActor = removeEffect(iniRemovedFirstActor, iniBuff, "Buff"); };
    if(iniRemovedSecondActor.BuffsList.find((effect) => effect.Name === "Bonus Initiative 1" || effect.Name === "Bonus Initiative 2")){ const iniBuff = iniRemovedSecondActor.BuffsList.find((effect) => effect.Name === "Bonus Initiative 1"  || effect.Name === "Bonus Initiative 2"); if(iniBuff) iniRemovedSecondActor = removeEffect(iniRemovedSecondActor, iniBuff, "Buff"); };

    // Remove Mana debuff
    let manaRemovedFirstActor = iniRemovedFirstActor; let manaRemovedSecondActor = iniRemovedSecondActor;
    if(manaRemovedFirstActor.DebuffsList.find((effect) => effect.Name === "Mal de mana")){ const manaDebuff = manaRemovedFirstActor.DebuffsList.find((effect) => effect.Name === "Mal de mana"); if(manaDebuff) manaRemovedFirstActor = removeEffect(manaRemovedFirstActor, manaDebuff, "Debuff"); };
    if(manaRemovedSecondActor.DebuffsList.find((effect) => effect.Name === "Mal de mana")){ const manaDebuff = manaRemovedSecondActor.DebuffsList.find((effect) => effect.Name === "Mal de mana"); if(manaDebuff) manaRemovedSecondActor = removeEffect(manaRemovedSecondActor, manaDebuff, "Debuff"); };

    // Dragon Stance
    const dragonStanceFirstActor = applyDragonBuff(manaRemovedFirstActor, handleHistoryEventAdd);
    const dragonStanceSecondActor = applyDragonBuff(manaRemovedSecondActor, handleHistoryEventAdd);

    currentData = updateCharData(currentData, dragonStanceFirstActor, dragonStanceSecondActor); // Set Data

    return currentData;
}

export function handleFightAtk(
    attackerId: number | null,
    defenderId: number | null,
    charData: CharStatsInterface[],
    handleHistoryEventAdd: (msg: string, type: string, title?: string) => void,
    nbAtk?: number
) {
    if (attackerId === null || defenderId === null) { return; }

    let attackerData = charData[charData.findIndex((char) => char.Id === attackerId)];
    let defenderData = charData[charData.findIndex((char) => char.Id === defenderId)];
    const atkCount = (nbAtk) ? nbAtk : attackerData.CombatStats.AA;

    handleHistoryEventAdd(`-- ${attackerData.Name} attaque ${defenderData.Name} --`, 'Text');
    console.log("\n\n:: New round ::\n")

    let critCounter = 0;
    let dmgCounter = 0;
    let successAtkCounter = 0;
    for (let i = 0; i < atkCount; i++) {
        const combatRes = handleDmgCalc(attackerData, defenderData, i, critCounter, successAtkCounter);

        if(combatRes.dmg) successAtkCounter += 1;
        if(combatRes.critCounter) critCounter += 1;
        if(combatRes.dmg) dmgCounter += combatRes.dmg;
        combatRes.msg.map((msg) => handleHistoryEventAdd(msg.historyMsg, msg.msgType, msg.msgTitle));
        
        defenderData = { ...combatRes.Defender, Hp: combatRes.Defender.Hp - combatRes.dmg };
    }

    // Stance Roseau
    if(defenderData.FightStyleList.some(stance => stance?.Name === "Position du Roseau") ){
        const successfullDefCounter = Math.floor((atkCount - successAtkCounter) / 3);
        const roseauDebuff = findPreset("Revers de Roseau");
        if(roseauDebuff) {
            for(let i = 0; i < successfullDefCounter; i ++){
                attackerData = addEffect(attackerData, roseauDebuff, "Debuff");
            }
        }
    }

    handleHistoryEventAdd(`-- ${defenderData.Name} subit au total : ${dmgCounter} --`, 'Atk');

    return { attackerData, defenderData };
}

function handleDmgCalc(Attacker: CharStatsInterface, Defender: CharStatsInterface, atkNumber: number, critCounter: number, atkSuccessCounter: number) {
    const atkJet = Attacker.FightStyleList.some(stance => stance?.Name === "Position du Flamant Rose")? 50 : rollDice(100) + Attacker.CombatStats.SA;
    const defJet = Defender.FightStyleList.some(stance => stance?.Name === "Position du Flamant Rose")? 50 : rollDice(100) + Defender.CombatStats.SD;

    // Calcul malus AD
    const maxMalus = Defender.FightStyleList.some(stance => stance?.Name === "Position du Lézard") ? 45 : 90;
    const malusAD = (atkNumber - Defender.CombatStats.AD) > 0 ? Math.min((atkNumber - Defender.CombatStats.AD) * 15, maxMalus) : 0;

    // Calcul succès atk
    const atkSuccess = atkJet - (defJet + malusAD);
    if(atkSuccess <= 0){ //Echec atk
        const dmg = 0;
        const msgArray = [{ historyMsg: `Atk N°${atkNumber + 1}: Echec`, msgType: 'Def', msgTitle: `${Attacker.Name}: ${atkJet - Attacker.CombatStats.SA} + ${Attacker.CombatStats.SA} SA | ${Defender.Name}: ${defJet - Defender.CombatStats.SD} + ${Defender.CombatStats.SD} SD`}];
        console.log("Roll : "+atkJet+" VS "+defJet+" - "+malusAD+" Malus -> Echec");
        return({ Defender: Defender, dmg: dmg, msg: msgArray });
    }

    // Calcul ecart dmg
    let ecartDmg = 0;
    switch(true){
        case (atkSuccess < 50): ecartDmg = 50; break;
        case (atkSuccess > 125): ecartDmg = 125; break;
        default: ecartDmg = atkSuccess; 
    }

    // Ecart (%) * DMG stat
    const Dmg = (ecartDmg / 100) * Math.max(Attacker.CombatStats.DMG,0);

    // Calcul ArmorPierce
    const ReD = Math.max(Defender.CombatStats.ReD,0)
    const dmgReduc = (ReD - Attacker.CombatStats.PA) < 0 ? 0 : ReD - Attacker.CombatStats.PA;

    // Calcul Dmg Final
    let finalDmg = Math.floor(Dmg - dmgReduc);
    console.log("Atk "+(atkNumber + 1)+" : "+atkJet+" VS "+defJet+" - "+malusAD+" Malus : Ecart "+ecartDmg+" % -> Sucess");
    console.log("   DMG => "+finalDmg+" ,"+Dmg+" ,"+Attacker.CombatStats.DMG+" : "+Defender.CombatStats.ReD+" ReD VS "+Attacker.CombatStats.PA+" PA  => -"+dmgReduc+"");
    const msgArray = [{ historyMsg: `Atk N°${atkNumber + 1}: ${finalDmg} Dmg`, msgType: 'Atk', msgTitle: `${Attacker.Name}: ${atkJet - Attacker.CombatStats.SA} + ${Attacker.CombatStats.SA} SA | ${Defender.Name}: ${defJet - Defender.CombatStats.SD} + ${Defender.CombatStats.SD} SD`}];

    // Calcul CC
    const CCDiceRoll = rollDice(50);

    // Check CC
    const enableCC = (critCounter < Attacker.CombatStats.CC);
    const minCrit = Math.min(50 - Attacker.CombatStats.CdC + 1,50)
    if(CCDiceRoll >= minCrit && Attacker.FightStyleList.some(stance => stance?.Name !== "Position du Flamant Rose")){
        if(enableCC){
            console.log("   + Crit Roll : '"+CCDiceRoll+ "' : 50 et "+minCrit+" -> Sucess");
            msgArray.push({ historyMsg: `Critical Hit! ⭐`, msgType: 'CC', msgTitle: ''});
            if(!(Defender.FightStyleList.some(stance => stance?.Name === "Position de la Pieuvre"))){
                const allDebuffs = getAllDebbuffs(Attacker.Weapon.WeaponType);
                if(allDebuffs.every(debuff => Defender.DebuffsList.some(d => d.Name === debuff.Name))){
                    msgArray.push({ historyMsg: `${Defender.Name} a trop de debuff !`, msgType: 'CC', msgTitle: ''});
                }else{
                    const debuff: DebuffInterface | null = selectRandomDebuff(Attacker.Weapon.WeaponType, Defender.DebuffsList);
                    // Add new debuff
                    if(debuff){
                        Defender = addEffect(Defender, debuff, "Debuff");
                        msgArray.push({ historyMsg: `${Defender.Name} reçoit ${debuff.Name}`, msgType: 'CC', msgTitle: ''});
                    }
                }
                critCounter++;
            }else{
                msgArray.push({ historyMsg: `Mais ${Defender.Name} esquive les effets néfastes !`, msgType: 'CC', msgTitle: ''});
            }
        }else{
            finalDmg += 30;
        }
    }

    // Serpent Stance
    if(atkSuccessCounter === 0 && Attacker.FightStyleList.some(stance => stance?.Name === "Position du Serpent")){
        if(Defender.DebuffsList.some(debuff => debuff.Name === "Poison du Serpent")){
            msgArray.push({ historyMsg: `Le poison de ${Defender.Name} est refresh (4 tours) !`, msgType: 'CC', msgTitle: ''});
        }else if(Defender.FightStyleList.some(stance => stance?.Name === "Position de la Pieuvre")){
            msgArray.push({ historyMsg: `${Defender.Name} esquive le poison du serpent !`, msgType: 'CC', msgTitle: ''});
        }else{
            const serpentDotDebuff = findPreset("Poison du Serpent");
            if(serpentDotDebuff){
                Defender = addEffect(Defender, serpentDotDebuff, "Debuff");
                msgArray.push({ historyMsg: `Position du Serpent inflige 50 dégats sur la durée ! (4 tour)`, msgType: 'Atk', msgTitle: ''});
            } 
        }
    }

    // Rhinocéros Stance
    if(Attacker.FightStyleList.some(stance => stance?.Name === "Position du Rhinocéros")){
        if(atkSuccessCounter === 0 || atkSuccessCounter === 1 || atkSuccessCounter === 2){
            const atkName = ["Premier", "Second", "Troisième"][atkSuccessCounter];
            if (rollDice(100) <= 50) {
                if(Defender.DebuffsList.some(debuff => debuff.Name === `${atkName} Coup du Rhinocéros`)){
                    msgArray.push({ historyMsg: `${Defender.Name} a déjà le ${atkName} Coup du Rhinocéros !`, msgType: 'CC', msgTitle: ''});
                }else if(Defender.FightStyleList.some(stance => stance?.Name === "Position de la Pieuvre")){
                    msgArray.push({ historyMsg: `${Defender.Name} esquive le ${atkName} Coup du Rhinocéros !`, msgType: 'CC', msgTitle: ''});
                }else if(enableCC){
                    const rhinoDebuff = findPreset(`${atkName} Coup du Rhinocéros`);
                    if (rhinoDebuff) {
                        Defender = addEffect(Defender, rhinoDebuff, "Debuff");
                        msgArray.push({ historyMsg: `Le ${atkName} Coup du Rhinocéros touche !`, msgType: 'CC', msgTitle: rhinoDebuff.Desc });
                        critCounter++;
                    }
                }else{
                    msgArray.push({ historyMsg: `Le ${atkName} Coup du Rhinocéros touche, mais la limite de CC est atteinte (+30 dmg) !`, msgType: 'Info', msgTitle: '' });
                    finalDmg += 30;
                }
            }else { 
                msgArray.push({ historyMsg: `Le ${atkName} Coup du Rhinocéros rate !`, msgType: 'Info', msgTitle: '' });
            }
        }
    }
    return({ Defender: Defender, dmg: finalDmg, msg: msgArray, critCounter: critCounter });
}

export function addEffect(charData: CharStatsInterface, effect: BuffInterface | DebuffInterface, effectType: 'Buff' | 'Debuff'): CharStatsInterface{
    const effectList = effectType === 'Buff' ? charData.BuffsList : charData.DebuffsList;
    const newEffect = {...effect, Applied: false, Id: effectList[0]? effectList[effectList.length - 1].Id + 1: 0}
    const newCharData = applyAllEffect(charData, false);

    const updatedEffectList = [...effectList, newEffect];
    const updatedCharData = { ...newCharData, BuffsList: effectType === 'Buff' ? updatedEffectList : newCharData.BuffsList, DebuffsList: effectType === 'Debuff' ? updatedEffectList : newCharData.DebuffsList};
    const effectUpdatedcharData = applyAllEffect(updatedCharData, true);
    return effectUpdatedcharData;
}

export function removeEffect(charData: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface, effectType: 'Buff' | 'Debuff'): CharStatsInterface{
    const effectList = effectType === 'Buff' ? charData.BuffsList : charData.DebuffsList;
    const newCharData = applyAllEffect(charData, false);
    
    const updatedEffectList = effectList.filter((e) => e.Id !== effect.Id);
    const updatedCharData = { ...newCharData, BuffsList: effectType === 'Buff' ? updatedEffectList : newCharData.BuffsList, DebuffsList: effectType === 'Debuff' ? updatedEffectList : newCharData.DebuffsList};
    const effectUpdatedcharData = applyAllEffect(updatedCharData, true);
    return effectUpdatedcharData;
}

export function updateEffect(charData: CharStatsInterface): CharStatsInterface {
    const removedEffectData = applyAllEffect(charData, false);
    const appliedEffectData = applyAllEffect(removedEffectData, true);
    return appliedEffectData;
}

export function applyAllEffect(charData: CharStatsInterface, apply: boolean): CharStatsInterface{
    const currentData = { ...charData };
    const lists = {
        BuffsList: currentData.BuffsList as CharBuffInterface[],
        DebuffsList: currentData.DebuffsList as CharDebuffInterface[]
    } as const;

    // Carac Buff
    let caracBuffedData = { ...currentData };
    (["BuffsList", "DebuffsList"] as const).forEach((list) => {
        const listData = lists[list];
        if(listData) listData.forEach((effect) => { 
            if(effect.Effect){ 
                caracBuffedData = apply
                    ? applyCaracStatsEffect(caracBuffedData, effect.Effect) 
                    : unapplyCaracStatsEffect(caracBuffedData, effect.Effect);
            };
        });
    });
    for(const stance of currentData.FightStyleList){
        if(stance && stance.Effect.CaracteristicsBuff){
            caracBuffedData = apply
                ? applyEffect(caracBuffedData, stance.Effect, "CaracteristicsBuff", true) 
                : applyEffect(caracBuffedData, stance.Effect, "CaracteristicsBuff", false);
        }
    }

    // Refresh Combat Stat values
    const updatedCurrentData = updateCombatStatsCalc(caracBuffedData);
    
    // Stance
    const appliedStanceData = apply
        ? applyAllStance(updatedCurrentData) 
        : unapplyAllStance(updatedCurrentData);

    // CombatStat Buff
    let combatStatBuffedData = { ...appliedStanceData };
    (["BuffsList", "DebuffsList"] as const).forEach((list) => {
        const listData = lists[list];
        if(listData) listData.forEach((effect) => { 
            if(effect.Effect){ 
                combatStatBuffedData = apply
                    ? applyCombatStatsEffect(combatStatBuffedData, effect.Effect) 
                    : unapplyCombatStatsEffect(combatStatBuffedData, effect.Effect) ;

                const turnEffect = effect.Effect.TurnEffect || null; // Turn effect
                if(turnEffect) combatStatBuffedData = apply
                    ? applyDotHotEffect(combatStatBuffedData, effect.Effect)
                    : unapplyDotHotEffect(combatStatBuffedData, effect.Effect);
            };
        });
    });

    return combatStatBuffedData;
}

export function applyEffect( charData: CharStatsInterface, effect: EffectInterface, statKey: "CaracteristicsBuff" | "CombatStats" | "TurnEffect", isApplying: boolean): CharStatsInterface {
    const effectData = effect[statKey] as CharStatsInterface[typeof statKey];
    const newData = { ...charData, [statKey]: { ...charData[statKey] } };

    if (effectData) {
        Object.keys(effectData).forEach((key) => {
            const effectValue = effectData[key as keyof typeof effectData];
            const adjustement = isApplying ? effectValue : -effectValue;

            switch(statKey){
                case "CaracteristicsBuff": {
                    const typedKey = key as keyof CharStatsInterface["CaracteristicsBuff"];
                    newData.CaracteristicsBuff[typedKey] += adjustement;
                    break;
                }
                case "CombatStats": {
                    const typedKey = key as keyof CharStatsInterface["CombatStats"];
                    newData.CombatStats[typedKey] += adjustement;
                    break;
                }
                case "TurnEffect": {
                    const typedKey = key as keyof CharStatsInterface["TurnEffect"];
                    newData.TurnEffect[typedKey] += adjustement;
                    break
                }
            }
        });
    }
    return statKey === "CaracteristicsBuff" ? updateCombatStatsCalc(newData) : newData;
}

export function applyCaracStatsEffect(charData: CharStatsInterface, effect: EffectInterface): CharStatsInterface {
    return applyEffect(charData, effect, "CaracteristicsBuff", true);
}

export function unapplyCaracStatsEffect(charData: CharStatsInterface, effect: EffectInterface): CharStatsInterface {
    return applyEffect(charData, effect, "CaracteristicsBuff", false);
}

export function applyCombatStatsEffect(charData: CharStatsInterface, effect: EffectInterface): CharStatsInterface {
    return applyEffect(charData, effect, "CombatStats", true);
}

export function unapplyCombatStatsEffect(charData: CharStatsInterface, effect: EffectInterface): CharStatsInterface {
    return applyEffect(charData, effect, "CombatStats", false);
}

export function applyDotHotEffect(charData: CharStatsInterface, effect: EffectInterface): CharStatsInterface {
    return applyEffect(charData, effect, "TurnEffect", true);
}

export function unapplyDotHotEffect(charData: CharStatsInterface, effect: EffectInterface): CharStatsInterface {
    return applyEffect(charData, effect, "TurnEffect", false);
}

export function applyAllStance(charData: CharStatsInterface): CharStatsInterface{
    let newData = { ...charData };
    const stanceBuffArray = newData.FightStyleList;
    if(!stanceBuffArray) return newData;

    for(const stance of stanceBuffArray){
        if(!stance) continue;

        const stanceCombatBuff = stance.Effect.CombatStats || {};
        const stanceTypeBuff = findStanceBase(stance.Type)?.Effect || {};

        const mergedStanceBuff = { ...stanceCombatBuff };
        for (const [key, val] of Object.entries(stanceTypeBuff)){
            mergedStanceBuff[key as keyof typeof mergedStanceBuff] = (mergedStanceBuff[key as keyof typeof mergedStanceBuff] as number || 0) + (val as number);
        }
        newData = applyEffect(newData, { CombatStats: mergedStanceBuff }, "CombatStats", true);
    }
    return newData;
}

export function unapplyAllStance(charData: CharStatsInterface): CharStatsInterface{
    let newData = { ...charData };
    const stanceBuffArray = newData.FightStyleList;
    if(!stanceBuffArray) return newData;

    for(const stance of stanceBuffArray){
        if(!stance) continue;

        const stanceCombatBuff = stance.Effect.CombatStats || {};
        const stanceTypeBuff = findStanceBase(stance.Type)?.Effect || {};

        const mergedStanceBuff = { ...stanceCombatBuff };
        for (const [key, val] of Object.entries(stanceTypeBuff)){
            mergedStanceBuff[key as keyof typeof mergedStanceBuff] = (mergedStanceBuff[key as keyof typeof mergedStanceBuff] as number || 0) + (val as number);
        }
        newData = applyEffect(newData, { CombatStats: mergedStanceBuff }, "CombatStats", false);
    }
    return newData;
}

export function handleTurnManaCost (charData: CharStatsInterface, handleHistoryEventAdd: (msg: string, type: string, title?: string) => void) {
    let newData = { ...charData };
    let manaCost = Math.floor((charData.InitMana / 100) * 2);
    if(manaCost > 30) manaCost = 30;
    let manaDebuff: DebuffInterface | null = null;
    
    if(charData.Mana < manaCost){
        handleHistoryEventAdd(`${charData.Name} n'a pas assez de Mana pour ce tour !`, "Atk");
        manaDebuff = findPreset('Mal de mana');
    }else{
        newData.Mana -= manaCost;
        handleHistoryEventAdd(`${charData.Name} utilise son mana pour son tour (${manaCost}) !`, "Def");
    }

    if(manaDebuff && manaDebuff.Effect?.CombatStats){
        manaDebuff.Effect.CombatStats.AA = -(Math.floor(charData.CombatStats.AA / 2));
        manaDebuff.Effect.CombatStats.AD = -(Math.floor(charData.CombatStats.AD / 2));
        handleHistoryEventAdd(`${manaDebuff.Effect?.CombatStats?.AA} AA, ${manaDebuff.Effect?.CombatStats?.AD} AD, -${manaDebuff.Effect?.CombatStats?.SA} SA, -${manaDebuff.Effect?.CombatStats?.SD} SD.`, "Atk");
        newData = addEffect(newData, manaDebuff, "Debuff");
    }

    return newData;
}

export function handleIniCalc(actorA: CharStatsInterface, actorB: CharStatsInterface, handleHistoryEventAdd: (msg: string, type: string, title?: string) => void){
    const actorAIni = actorA.CombatStats.Ini + rollDice(10);
    const actorBIni = actorB.CombatStats.Ini + rollDice(10);
    const initiativeDifference = Math.abs(actorAIni - actorBIni);

    let iniBonus: BuffInterface | null = null;
    if (initiativeDifference >= 2 && initiativeDifference <= 3) { 
        iniBonus = findPreset("Bonus Initiative 1"); }
    else if (initiativeDifference >= 4) { 
        iniBonus = findPreset("Bonus Initiative 2");
    };

    let firstActor = { ...actorA };
    let secondActor = { ...actorB };
    if (actorBIni > actorAIni) {
        firstActor = { ...actorB };
        secondActor = { ...actorA };
    }

    if(iniBonus && !firstActor.BuffsList.some((buff) => buff.Name !== iniBonus.Name)) { firstActor = addEffect(firstActor, iniBonus, "Buff"); };

    handleHistoryEventAdd(`${actorA.Name} a l'initiative sur ${actorB.Name}.`, 'Info', `Ini A : ${actorAIni} |  Ini B : ${actorBIni}`);
    handleHistoryEventAdd(`
        La différence d'Ini est de ${initiativeDifference}.
        ${initiativeDifference < 2 ? `La différence est minime.` : ''}
            ${iniBonus?.Effect?.CombatStats?.SA ? `${actorAIni > actorBIni? actorA.Name : actorB.Name} gagne SA: ${iniBonus?.Effect?.CombatStats?.SA}` : ''}
            ${iniBonus?.Effect?.CombatStats?.SD ? `, SD: ${iniBonus?.Effect?.CombatStats?.SD}` : ''}
            ${iniBonus?.Effect?.CombatStats?.CdC ? `, CdC: ${iniBonus?.Effect?.CombatStats?.CdC}` : ''}
        `, "Info");

    return { iniFirstActor: firstActor , iniSecondActor: secondActor };
}

export function applyTurnEffect(actorData: CharStatsInterface, handleHistoryEventAdd: (msg: string, type: string, title?: string) => void): CharStatsInterface {
    if(actorData.TurnEffect.Dot !== 0){
        handleHistoryEventAdd(`${actorData.Name} prend des dégâts sur la durée ! ( ${actorData.TurnEffect.Dot} )`, 'Atk');
        actorData.Hp -= actorData.TurnEffect.Dot;
    }
    if(actorData.TurnEffect.Hot !== 0){
        handleHistoryEventAdd(`${actorData.Name} reçoit un heal sur la durée ! ( ${actorData.TurnEffect.Hot} )`, 'Heal');
        actorData.Hp += actorData.TurnEffect.Hot;
    }
    
    return actorData;
}

function applyDragonBuff(actor: CharStatsInterface, handleHistoryEventAdd: (msg: string, type: string, title?: string) => void){
    if (actor.FightStyleList.some(stance => stance?.Name === "Position du Dragon") && !actor.BuffsList.some(buff => buff.Name === "Déchainement du Dragon")) {
        const dragonBuff = findPreset("Déchainement du Dragon");
        if (dragonBuff) {
            actor = addEffect(actor, dragonBuff, "Buff");
            handleHistoryEventAdd(`${actor.Name} est prêt à se déchainer !`, 'Atk', dragonBuff.Desc);
        }
    }
    return actor;
}

export function exportAllEffects(charData: CharStatsInterface){
    const currentData = { ...charData };
    const allEffectsLogArray: { Name: string; Effect: string; }[] = [];
    const lists = {
        BuffsList: currentData.BuffsList as CharBuffInterface[],
        DebuffsList: currentData.DebuffsList as CharDebuffInterface[],
        CaracteristicsBuff: currentData.CaracteristicsBuff as CharStatsCaracteristicsValueInterface,
        CaracteristicsOverload: currentData.CaracteristicsOverload as CharCaracteristicsOverloadInterface,
        FightStyleList: currentData.FightStyleList as (FightStanceInterface | null)[]
    } as const;

    (["BuffsList", "DebuffsList", "CaracteristicsOverload", "FightStyleList"] as const).forEach((list) => {
        const listData = lists[list];
        if(Array.isArray(listData)){ 
            listData.forEach((effect) => { 
                if(effect?.Effect) allEffectsLogArray.push(exportEffect(effect.Name, effect.Effect));
            })
        }else if(listData instanceof Object){
            if("active" in listData) allEffectsLogArray.push(exportEffect(`Caracteristics Overload`, { CaracteristicsBuff: listData.active }));
        }
    })
    lists["FightStyleList"].forEach((stance) => { // Fightstance buffs
        if(stance !== null) {
            const stanceBase = findStanceBase(stance.Type);
            if(stanceBase) allEffectsLogArray.push(exportEffect(stanceBase?.Name, { CombatStats: stanceBase.Effect }));
        }
    })
    
    return allEffectsLogArray.filter(effect => effect.Effect !== "");
}

function exportEffect(effectName: string, effect: EffectInterface ){
    const descriptions: string[] = [];
    Object.entries(effect).forEach(([ , value]) => {
        if (value) { 
            Object.entries(value).forEach(([subKey, subValue]) => { 
                if(subValue !== 0)descriptions.push(`${subKey}: ${subValue}`);
            });
        };
    });
    return { Name: effectName, Effect: descriptions.join(' | ')};
}