import { CharDebuffInterface, CharStatsInterface, CharBuffInterface, BuffInterface, DebuffInterface, CharStatsCaracteristicsInterface } from "../types/statsType";
import { StanceBaseEffect } from "../data/FightStance";
import { rollDice } from "./GlobalFunction";
import { getAllDebbuffs, selectRandomDebuff } from "../data/CCDebuff";
import { findPreset } from "../data/EffectPreset";
import { updateCombatStatsCalc } from "./BaseStatsCalc";

export function handleTurn(
    firstActor: CharStatsInterface | null,
    secondActor: CharStatsInterface | null,
    charData: CharStatsInterface[],
    handleHistoryEventAdd: (msg: string, type: string, title?: string) => void,
    nbAtk?: number
){
    if(!firstActor || !secondActor){ return; };
    let currentData = charData;
   
    // First ATK
    const firstAtkRes = handleFightAtk(firstActor.Id, secondActor.Id, charData, handleHistoryEventAdd, nbAtk);

    if(firstAtkRes){
        currentData = currentData.map((char) => {
            switch(true){
                case char.Id === firstAtkRes?.defenderData.Id: return firstAtkRes.defenderData;
                case char.Id === firstAtkRes?.attackerData.Id: return firstAtkRes.attackerData;
                default: return char;
            }
        })

        // Second ATK
        const secondAtkRes = handleFightAtk(secondActor.Id, firstActor.Id, currentData, handleHistoryEventAdd, nbAtk);

        // Update character data
        if(secondAtkRes){
            let iniRemovedFirstActor = secondAtkRes.defenderData;
            let iniRemovedSecondActor = secondAtkRes.attackerData;

            // Remove Ini bonus
            if(iniRemovedFirstActor.BuffsList.find((effect) => effect.Name === "Bonus Initiative 1" || effect.Name === "Bonus Initiative 2" )){ const iniBuff = iniRemovedFirstActor.BuffsList.find((effect) => effect.Name === "Bonus Initiative 1" || effect.Name === "Bonus Initiative 2"); if(iniBuff) iniRemovedFirstActor = removeEffect(iniRemovedFirstActor, iniBuff, "Buff"); };
            if(iniRemovedSecondActor.BuffsList.find((effect) => effect.Name === "Bonus Initiative 1" || effect.Name === "Bonus Initiative 2")){ const iniBuff = iniRemovedSecondActor.BuffsList.find((effect) => effect.Name === "Bonus Initiative 1"  || effect.Name === "Bonus Initiative 2"); if(iniBuff) iniRemovedSecondActor = removeEffect(iniRemovedSecondActor, iniBuff, "Buff"); };

            let manaRemovedFirstActor = iniRemovedFirstActor;
            let manaRemovedSecondActor = iniRemovedSecondActor;
            // Remove Mana debuff
            if(manaRemovedFirstActor.DebuffsList.find((effect) => effect.Name === "Mal de mana")){ const manaDebuff = manaRemovedFirstActor.DebuffsList.find((effect) => effect.Name === "Mal de mana"); if(manaDebuff) manaRemovedFirstActor = removeEffect(manaRemovedFirstActor, manaDebuff, "Debuff"); };
            if(manaRemovedSecondActor.DebuffsList.find((effect) => effect.Name === "Mal de mana")){ const manaDebuff = manaRemovedSecondActor.DebuffsList.find((effect) => effect.Name === "Mal de mana"); if(manaDebuff) manaRemovedSecondActor = removeEffect(manaRemovedSecondActor, manaDebuff, "Debuff"); };

            // Dragon Stance
            if(manaRemovedFirstActor.FightStyleList.some(stance => stance?.Name === "Position du Dragon") && !manaRemovedFirstActor.BuffsList.some(buff => buff.Name === "Déchainement du Dragon")){
                const dragonBuff = findPreset("Déchainement du Dragon");
                if(dragonBuff){
                    manaRemovedFirstActor = addEffect(manaRemovedFirstActor, dragonBuff, "Buff");
                    handleHistoryEventAdd(`${manaRemovedFirstActor.Name} est prêt à se déchainer !`, 'Atk', dragonBuff.Desc);
                }
            }
            if(manaRemovedSecondActor.FightStyleList.some(stance => stance?.Name  === "Position du Dragon") && !manaRemovedSecondActor.BuffsList.some(buff => buff.Name === "Déchainement du Dragon")){
                const dragonBuff = findPreset("Déchainement du Dragon");
                if(dragonBuff){
                    manaRemovedSecondActor = addEffect(manaRemovedSecondActor, dragonBuff, "Buff");
                    handleHistoryEventAdd(`${manaRemovedSecondActor.Name} est prêt à se déchainer !`, 'Atk', dragonBuff.Desc);
                }
            }

            // Set Data
            currentData = currentData.map((char) => {
                switch(true){
                    case char.Id === manaRemovedFirstActor.Id: return manaRemovedFirstActor;
                    case char.Id === manaRemovedSecondActor.Id: return manaRemovedSecondActor;
                    default: return char;
                }
            });
        }
    }

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
    handleHistoryEventAdd(`-- Fin de l'attaque --`, 'Text');

    return { attackerData, defenderData };
}

function handleDmgCalc(Attacker: CharStatsInterface, Defender: CharStatsInterface, atkNumber: number, critCounter: number, atkSuccessCounter: number) {
    const atkJet = Attacker.FightStyleList.some(stance => stance?.Name === "Position du Flamant Rose")? 50 : rollDice(100) + Attacker.CombatStats.SA;
    const defJet = Defender.FightStyleList.some(stance => stance?.Name === "Position du Flamant Rose")? 50 : rollDice(100) + Defender.CombatStats.SD;

    // Calcul malus AD
    const maxMalus = Defender.FightStyleList.some(stance => stance?.Name === "Position du Lézard") ? 45 : 90;
    const malusAD = (atkNumber - Defender.CombatStats.AD) > 0 ? Math.min((atkNumber - Defender.CombatStats.AD) * -15, -maxMalus) : 0;

    // Calcul succès atk
    const atkSuccess = (defJet + malusAD) - atkJet;
    if(atkSuccess > 0){ //Echec atk
        const dmg = 0;
        const msgArray = [{ historyMsg: `Atk N°${atkNumber + 1}: Echec`, msgType: 'Def', msgTitle: `${Attacker.Name}: ${atkJet - Attacker.CombatStats.SA} + ${Attacker.CombatStats.SA} SA | ${Defender.Name}: ${defJet - Defender.CombatStats.SD} + ${Defender.CombatStats.SD} SD`}];
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
    const Dmg = (ecartDmg / 100) * Attacker.CombatStats.DMG;

    // Calcul ArmorPierce
    const armorPierce = (Defender.CombatStats.ReD - Attacker.CombatStats.PA) < 0 ? 0 : (Defender.CombatStats.ReD - Attacker.CombatStats.PA);

    // Calcul Dmg Final
    let finalDmg = Math.floor(Dmg + armorPierce);
    const msgArray = [{ historyMsg: `Atk N°${atkNumber + 1}: ${finalDmg} Dmg`, msgType: 'Atk', msgTitle: `${Attacker.Name}: ${atkJet - Attacker.CombatStats.SA} + ${Attacker.CombatStats.SA} SA | ${Defender.Name}: ${defJet - Defender.CombatStats.SD} + ${Defender.CombatStats.SD} SD`}];

    // Calcul CC
    const CCDiceRoll = rollDice(50);

    // Check CC
    const enableCC = (critCounter < Attacker.CombatStats.CC);
    if(CCDiceRoll < Attacker.CombatStats.CdC && Attacker.FightStyleList.some(stance => stance?.Name !== "Position du Flamant Rose")){
        if(enableCC){
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
    let newCharData = charData;
    if(newEffect.Effect?.CharCaracteristics){
        const removedEffectCharData = unapplyAllCombatStatEffect(charData);
        newCharData = applyCaracStatsEffect(removedEffectCharData, newEffect);
    }
    const updatedEffectList = [...effectList, newEffect];
    const updatedcharData = { ...newCharData, BuffsList: effectType === 'Buff' ? updatedEffectList : newCharData.BuffsList, DebuffsList: effectType === 'Debuff' ? updatedEffectList : newCharData.DebuffsList};
    const effectUpdatedcharData = applyCombatStatsEffect(updatedcharData);
    return effectUpdatedcharData;
}

export function removeEffect(charData: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface, effectType: 'Buff' | 'Debuff'): CharStatsInterface{
    const effectList = effectType === 'Buff' ? charData.BuffsList : charData.DebuffsList;
    let newCharData = charData;
    if(effect.Effect?.CharCaracteristics){
        const removedEffectCharData = unapplyAllCombatStatEffect(newCharData);
        const removedCarEffect = unapplyCaracStatsEffect(removedEffectCharData, effect);
        newCharData = applyCombatStatsEffect(removedCarEffect);
    }
    const updatedEffectList = effectList.filter((e) => e.Id !== effect.Id);
    const updatedcharData = { ...newCharData, BuffsList: effectType === 'Buff' ? updatedEffectList : newCharData.BuffsList, DebuffsList: effectType === 'Debuff' ? updatedEffectList : newCharData.DebuffsList};
    const effectUpdatedcharData = unapplyCombatStatEffect(updatedcharData, effect);
    return effectUpdatedcharData;
}

export function updateEffect(charData: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface): CharStatsInterface {
    const unappliedCharData = unapplyCombatStatEffect(charData, effect);
    const reAppliedCharData = applyCombatStatsEffect(unappliedCharData);
    return reAppliedCharData;
}

export function applyCaracStatsEffect(charData: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface): CharStatsInterface {
    const caracEffect = effect.Effect?.CharCaracteristics || null;
    const newData = { ...charData };
    if (caracEffect) {
        Object.keys(caracEffect).forEach((key) => {
            const caracKey = key as keyof CharStatsCaracteristicsInterface;
            if (caracEffect[caracKey]) { newData.CaracteristicsBuff[caracKey] += caracEffect[caracKey]; };
        });
    }
    const returnData = updateCombatStatsCalc(newData);
    return returnData;
}

export function unapplyCaracStatsEffect(charData: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface): CharStatsInterface {
    const caracEffect = effect.Effect?.CharCaracteristics || null;
    const newData = { ...charData };
    if (caracEffect) {
        Object.keys(caracEffect).forEach((key) => {
            const caracKey = key as keyof CharStatsCaracteristicsInterface;
            if (caracEffect[caracKey]) { newData.CaracteristicsBuff[caracKey] -= caracEffect[caracKey]; };
        });
    }
    const returnData = updateCombatStatsCalc(newData);
    return returnData;
}

export function applyCombatStatsEffect(charData: CharStatsInterface): CharStatsInterface {
    const newData = { ...charData };
    
    ["Buff", "Debuff"].forEach((type) => {
        const list = type === 'Buff' ? newData.BuffsList : newData.DebuffsList;

        list.forEach((effect) => {
            if(!effect.Applied){
                if("Dmg" in effect && typeof(effect.Dmg) === "number"){ newData.Hp += effect.Dmg || 0; }
    
                if(effect.Effect){
                    // Debuff CombatStats
                    const debuffCombatStats = effect.Effect.CombatStats || null;
                    if (debuffCombatStats) {
                        Object.keys(debuffCombatStats).forEach((key) => {
                            const combatStatKey = key as keyof typeof newData.CombatStats;
                            if (debuffCombatStats[combatStatKey]) { newData.CombatStats[combatStatKey] += debuffCombatStats[combatStatKey]; };
                        });
                    }
    
                    // Dot & Hot
                    const effectDot = effect.Effect.Dot || null;
                    const effectHot = effect.Effect.Hot || null;
                    if(effectDot) newData.TurnEffect.Dot += effectDot;
                    if(effectHot) newData.TurnEffect.Hot += effectHot;
                }
                effect.Applied = true;
            }
        })
    })
    return newData;
}

export function unapplyCombatStatEffect(charData: CharStatsInterface, effectData: CharBuffInterface | CharDebuffInterface): CharStatsInterface {
    if (!effectData) { return charData; }
    const newData = { ...charData };
    if (effectData.Applied) {
        if (effectData.Effect) {

            // Effect CombatStats
            const effectCombatStats = effectData.Effect.CombatStats || null;
            if (effectCombatStats) {
                Object.keys(effectCombatStats).forEach((key) => {
                    const combatStatKey = key as keyof typeof newData.CombatStats;
                    if (effectCombatStats[combatStatKey]) { newData.CombatStats[combatStatKey] -= effectCombatStats[combatStatKey]; }
                });
            }

            // Dot & Hot
            const effectDot = effectData.Effect.Dot || null;
            const effectHot = effectData.Effect.Hot || null;
            if(effectDot) newData.TurnEffect.Dot -= effectDot;
            if(effectHot) newData.TurnEffect.Hot -= effectHot;
        }
        effectData.Applied = false;
    }
    return newData;
}

export function unapplyAllCombatStatEffect(charData: CharStatsInterface): CharStatsInterface {
    const newData = { ...charData };
    ["Buff", "Debuff"].forEach((type) => {
        const list = type === 'Buff' ? newData.BuffsList : newData.DebuffsList;

        list.forEach((effect) => {
            if (effect.Applied) {
                if (effect.Effect) {
                    // Effect CombatStats
                    const effectCombatStats = effect.Effect.CombatStats || null;
                    if (effectCombatStats) {
                        Object.keys(effectCombatStats).forEach((key) => {
                            const combatStatKey = key as keyof typeof newData.CombatStats;
                            if (effectCombatStats[combatStatKey]) { newData.CombatStats[combatStatKey] -= effectCombatStats[combatStatKey]; }
                        });
                    }

                    // Dot & Hot
                    const effectDot = effect.Effect.Dot || null;
                    const effectHot = effect.Effect.Hot || null;
                    if (effectDot) newData.TurnEffect.Dot -= effectDot;
                    if (effectHot) newData.TurnEffect.Hot -= effectHot;
                }
                effect.Applied = false;
            }
        });
    });
    return newData;
}

export function applyAllStance(charData: CharStatsInterface): CharStatsInterface{
    const newData = { ...charData };
    const stanceBuffArray = newData.FightStyleList;
    if(stanceBuffArray){
        for(let i = 0; i < stanceBuffArray.length; i++){
            const stanceData = stanceBuffArray[i];
            if(stanceData){
                const stanceType = stanceBuffArray[i]?.Type;
                const stanceTypeBuff = StanceBaseEffect[stanceType as keyof typeof StanceBaseEffect];
                if(stanceTypeBuff){
                    Object.keys(stanceTypeBuff).forEach((key) => {
                        const stanceBaseBuffKey = key as keyof typeof newData.CombatStats;
                        if ((stanceTypeBuff as Record<string, number>)[stanceBaseBuffKey]) { newData.CombatStats[stanceBaseBuffKey] += (stanceTypeBuff as Record<string, number>)[stanceBaseBuffKey]; };
                    });
                }
                const stanceBuff = stanceBuffArray[i]?.Effect?.CombatStats || null;
                if (stanceBuff) {
                    Object.keys(stanceBuff).forEach((key) => {
                        const stanceBuffKey = key as keyof typeof newData.CombatStats;
                        if (stanceBuff[stanceBuffKey]) { newData.CombatStats[stanceBuffKey] += stanceBuff[stanceBuffKey]; };
                    });
                }
            }
        }
    }
    return newData;
}

export function unapplyAllStance(charData: CharStatsInterface): CharStatsInterface{
    const newData = { ...charData };
    const stanceBuffArray = newData.FightStyleList;
    if(stanceBuffArray){
        for(let i = 0; i < stanceBuffArray.length; i++){
            const stanceData = stanceBuffArray[i];
            if(stanceData){
                const stanceType = stanceBuffArray[i]?.Type;
                const stanceTypeBuff = StanceBaseEffect[stanceType as keyof typeof StanceBaseEffect];
                if(stanceTypeBuff){
                    Object.keys(stanceTypeBuff).forEach((key) => {
                        const stanceBaseBuffKey = key as keyof typeof newData.CombatStats;
                        if ((stanceTypeBuff as Record<string, number>)[stanceBaseBuffKey]) { newData.CombatStats[stanceBaseBuffKey] -= (stanceTypeBuff as Record<string, number>)[stanceBaseBuffKey]; };
                    });
                }
                const stanceBuff = stanceBuffArray[i]?.Effect?.CombatStats || null;
                if (stanceBuff) {
                    Object.keys(stanceBuff).forEach((key) => {
                        const stanceBuffKey = key as keyof typeof newData.CombatStats;
                        if (stanceBuff[stanceBuffKey]) { newData.CombatStats[stanceBuffKey] -= stanceBuff[stanceBuffKey]; };
                    });
                }
            }
        }
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

    return { firstActor: firstActor , secondActor: secondActor };
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