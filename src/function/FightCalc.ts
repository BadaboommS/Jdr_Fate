import { CharDebuffInterface, CharStatsInterface, CharBuffInterface, DebuffInterface } from "../types/statsType";
import { StanceBaseEffectArray } from "../data/FightStance";
import { rollDice } from "./GlobalFunction";
import { CCDebuffList } from "../data/CCDebuff";
import { EffectPresetArray } from "../data/EffectPreset";

const DEBUG = false;

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
        // FightCalc
        const combatRes = handleDmgCalc(attackerData, defenderData, i, critCounter, successAtkCounter); // Calc Attack

        // SuccessAtkCounter
        if(combatRes.dmg) successAtkCounter += 1;
        
        // Display all turn msg
        combatRes.msg.map((msg) => handleHistoryEventAdd(msg.historyMsg, msg.msgType, msg.msgTitle));

        // CheckCrit Counter
        if(combatRes.critCounter) critCounter += combatRes.critCounter;

        // DataCounter
        if(combatRes.dmg) dmgCounter += combatRes.dmg;
        
        // setData
        defenderData = { ...combatRes.Defender, Hp: combatRes.Defender.Hp - combatRes.dmg };
    }

    // Stance Roseau
    if(defenderData.FightStyle?.Name === "Position du Roseau"){
        const successfullDefCounter = Math.floor((atkCount - successAtkCounter) / 2);
        const roseauDebuff = EffectPresetArray.find(effect => effect.Name === "Revers de Roseau");
        if(roseauDebuff) {
            for(let i = 0; i < successfullDefCounter; i ++){
                attackerData = addEffect(attackerData, {...roseauDebuff, Applied: false, Id: attackerData.DebuffsList[0]? attackerData.DebuffsList[attackerData.DebuffsList.length - 1].Id + 1: 0}, "Debuff");
            }
        }
    }

    handleHistoryEventAdd(`-- Dégâts totaux infligés : ${dmgCounter} --`, 'Atk');
    handleHistoryEventAdd(`-- Fin de l'attaque --`, 'Text');

    return { attackerData, defenderData };
}

function handleDmgCalc(Attacker: CharStatsInterface, Defender: CharStatsInterface, atkNumber: number, critCounter: number, atkSuccessCounter: number) {
    const atkJet = Attacker.FightStyle?.Name === "Position du Flamant Rose"? 50 : rollDice(100) + Attacker.CombatStats.SA;
    const defJet = Defender.FightStyle?.Name === "Position du Flamant Rose"? 50 : rollDice(100) + Defender.CombatStats.SD;
    if(DEBUG) console.log('atk, def: ',atkJet, defJet);

    // Calcul malus AD
    const maxMalus = Defender.FightStyle?.Name === "Position du Lézard"? 45 : 90;
    const malusAD = (atkNumber - Defender.CombatStats.AD) > 0 ? Math.min((atkNumber - Defender.CombatStats.AD) * -15, -maxMalus) : 0;
    if(DEBUG) console.log('malusAD', malusAD);

    // Calcul succès atk
    const atkSuccess = (defJet + malusAD) - atkJet;
    if(atkSuccess > 0){ //Echec atk
        if(DEBUG) console.log('echec atk: ', atkSuccess);
        const dmg = 0;
        const msgArray = [{ historyMsg: `Atk N°${atkNumber + 1}: Echec`, msgType: 'Def', msgTitle: `JetAtk: ${atkJet - Attacker.CombatStats.SA} + ${Attacker.CombatStats.SA} | JetDef: ${defJet - Defender.CombatStats.SD} + ${Defender.CombatStats.SD}`}];
        return({ Defender: Defender, dmg: dmg, msg: msgArray });
    }
    if(DEBUG) console.log('succès atk: ', atkSuccess);

    // Calcul ecart dmg
    let ecartDmg = 0;
    switch(true){
        case (atkSuccess < 50): ecartDmg = 50; break;
        case (atkSuccess > 125): ecartDmg = 125; break;
        default: ecartDmg = atkSuccess; 
    }
    if(DEBUG) console.log('Dmg Ratio (50 min - 125 max): ', ecartDmg);

    // Ecart (%) * DMG stat
    const Dmg = (ecartDmg / 100) * Attacker.CombatStats.DMG;
    if(DEBUG) console.log('Dmg: ', Dmg);

    // Calcul ArmorPierce
    const armorPierce = (Defender.CombatStats.ReD - Attacker.CombatStats.PA) < 0 ? 0 : (Defender.CombatStats.ReD - Attacker.CombatStats.PA);
    if(DEBUG) console.log('armorPierce: ', armorPierce);

    // Calcul Dmg Final
    let finalDmg = Math.floor(Dmg + armorPierce);
    if(DEBUG) console.log('finalDmg: ', finalDmg);

    const msgArray = [{ historyMsg: `Atk N°${atkNumber + 1}: ${finalDmg} Dmg`, msgType: 'Atk', msgTitle: `JetAtk: ${atkJet} | JetDef: ${defJet}`}];

    // Calcul CC
    const CCDiceRoll = rollDice(50);
    let debuff: DebuffInterface | null = null;

    if(CCDiceRoll < Attacker.CombatStats.CdC && Attacker.FightStyle?.Name !== "Position du Flamant Rose"){
        // Check CC
        const enableCC = (critCounter < Attacker.CombatStats.CC);
        if(enableCC && Defender.FightStyle?.Name === "Position de la Pieuvre"){
            msgArray.push({ historyMsg: `Critical Hit! ⭐`, msgType: 'CC', msgTitle: ''});
            msgArray.push({ historyMsg: `Mais ${Defender.Name} esquive les effets néfastes !`, msgType: 'CC', msgTitle: ''});
        }else if(enableCC){
            msgArray.push({ historyMsg: `Critical Hit! ⭐`, msgType: 'CC', msgTitle: ''});
            // Select debuff
            const weaponTypeDebuffList = CCDebuffList[CCDebuffList.findIndex(debuff => debuff.Type === Attacker.Weapon.WeaponType)];

            if(Defender.DebuffsList.length > 5){
                msgArray.push({ historyMsg: `${Defender.Name} a trop de debuff !`, msgType: 'CC', msgTitle: ''});
            }else{
                do{
                    debuff = weaponTypeDebuffList.Debuffs[rollDice(6) - 1];
                }while(Defender.DebuffsList.some(d => d.Name === debuff?.Name));

                // Add new debuff
                const newDebuff: CharDebuffInterface = { Name: debuff.Name, Desc: debuff.Desc, Effect: debuff.Effect, Applied: false, Id: Defender.DebuffsList[0]? Defender.DebuffsList[Defender.DebuffsList.length - 1].Id + 1: 0 };
                if(debuff.Dmg) newDebuff.Dmg = debuff.Dmg;
                if(debuff.Effect) newDebuff.Effect = debuff.Effect;
                Defender = addEffect(Defender, newDebuff, "Debuff");
                msgArray.push({ historyMsg: `${Defender.Name} reçoit ${debuff.Name}`, msgType: 'CC', msgTitle: ''});
            }
            critCounter++;
        }else{
            finalDmg += 30;
        }
    }

    // Serpent Stance
    if(atkSuccessCounter === 0 && Attacker.FightStyle?.Name === "Position du Serpent"){
        if(Defender.FightStyle?.Name === "Position de la Pieuvre"){
            msgArray.push({ historyMsg: `${Defender.Name} esquive le poison du serpent !`, msgType: 'CC', msgTitle: ''});
        }else{
            const serpentDotDebuff = EffectPresetArray.find(effect => effect.Name === "Poison du Serpent");
            if(serpentDotDebuff){
                Defender = addEffect(Defender, {...serpentDotDebuff, Applied: false }, "Debuff");
                msgArray.push({ historyMsg: `Position du Serpent inflige 50 dégats sur la durée ! (4 tour)`, msgType: 'Atk', msgTitle: ''});
            } 
        }
    }

    // Rhinocéros Stance
    if(Attacker.FightStyle?.Name === "Position du Rhinocéros"){
        if(atkSuccessCounter === 0){
            if (rollDice(100) <= 50) {
                if(Defender.FightStyle?.Name === "Position de la Pieuvre"){
                    msgArray.push({ historyMsg: `${Defender.Name} esquive le Premier Coup du Rhinocéros !`, msgType: 'CC', msgTitle: ''});
                }else{
                    const rhinoDebuff = EffectPresetArray.find(effect => effect.Name === "Premier Coup du Rhinocéros");
                    if (rhinoDebuff) {
                        Defender = addEffect(Defender, { ...rhinoDebuff, Applied: false }, "Debuff");
                        msgArray.push({ historyMsg: `Le Premier Coup du Rhinocéros touche !`, msgType: 'CC', msgTitle: rhinoDebuff.Desc });
                    }
                }
            }else { msgArray.push({ historyMsg: `Le Premier Coup du Rhinocéros rate !`, msgType: 'Info', msgTitle: '' }); }
        }else if(atkSuccessCounter === 1){
            if (rollDice(100) <= 50) {
                if(Defender.FightStyle?.Name === "Position de la Pieuvre"){
                    msgArray.push({ historyMsg: `${Defender.Name} esquive le Second Coup du Rhinocéros !`, msgType: 'CC', msgTitle: ''});
                }else{
                    const rhinoDebuff = EffectPresetArray.find(effect => effect.Name === "Second Coup du Rhinocéros");
                    if (rhinoDebuff) {
                        Defender = addEffect(Defender, { ...rhinoDebuff, Applied: false }, "Debuff");
                        msgArray.push({ historyMsg: `Le Second Coup du Rhinocéros touche !`, msgType: 'CC', msgTitle: rhinoDebuff.Desc });
                    }
                }
            }else { msgArray.push({ historyMsg: `Le Second Coup du Rhinocéros rate !`, msgType: 'Info', msgTitle: '' }); }
        }else if(atkSuccessCounter === 2){
            if (rollDice(100) <= 50) {
                if(Defender.FightStyle?.Name === "Position de la Pieuvre"){
                    msgArray.push({ historyMsg: `${Defender.Name} esquive le Troisième Coup du Rhinocéros !`, msgType: 'CC', msgTitle: ''});
                }else{
                    const rhinoDebuff = EffectPresetArray.find(effect => effect.Name === "Troisième Coup du Rhinocéros");
                    if (rhinoDebuff) {
                        Defender = addEffect(Defender, { ...rhinoDebuff, Applied: false }, "Debuff");
                        msgArray.push({ historyMsg: `Le Troisième Coup du Rhinocéros touche !`, msgType: 'CC', msgTitle: rhinoDebuff.Desc });
                    }
                }
            }else { msgArray.push({ historyMsg: `Le Troisième Coup du Rhinocéros rate !`, msgType: 'Info', msgTitle: '' }); }
        }
    }    

    return({ Defender: Defender, dmg: finalDmg, msg: msgArray, debuff: debuff, critCounter: critCounter });
}

export function addEffect(charData: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface, effectType: 'Buff' | 'Debuff'): CharStatsInterface{
    const effectList = effectType === 'Buff' ? charData.BuffsList : charData.DebuffsList;
    const updatedEffectList = [...effectList, effect];
    const updatedcharData = { ...charData, BuffsList: effectType === 'Buff' ? updatedEffectList : charData.BuffsList, DebuffsList: effectType === 'Debuff' ? updatedEffectList : charData.DebuffsList};
    const effectUpdatedcharData = applyEffect(updatedcharData);
    return effectUpdatedcharData;
}

export function removeEffect(charData: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface, effectType: 'Buff' | 'Debuff'): CharStatsInterface{
    const effectList = effectType === 'Buff' ? charData.BuffsList : charData.DebuffsList;
    const updatedEffectList = effectList.filter((e) => e.Id !== effect.Id);
    const updatedcharData = { ...charData, BuffsList: effectType === 'Buff' ? updatedEffectList : charData.BuffsList, DebuffsList: effectType === 'Debuff' ? updatedEffectList : charData.DebuffsList};
    const effectUpdatedcharData = unapplyEffect(updatedcharData, effect);
    return effectUpdatedcharData;
}

export function updateEffect(charData: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface): CharStatsInterface {
    const unappliedCharData = unapplyEffect(charData, effect);
    const reAppliedCharData = applyEffect(unappliedCharData);
    return reAppliedCharData;
}

export function applyEffect(charData: CharStatsInterface): CharStatsInterface{
    
    ["Buff", "Debuff"].forEach((type) => {
        const list = type === 'Buff' ? charData.BuffsList : charData.DebuffsList;

        list.forEach((effect) => {
            if(!effect.Applied){
                if("Dmg" in effect && typeof(effect.Dmg) === "number"){ charData.Hp += effect.Dmg || 0; }
    
                if(effect.Effect){
                    // Debuff Carac  VOIR AVEC HUGO RANG
                    /* const debuffCaracs = debuff.Effect.CharCaracteristics || null; 
                    if (debuffCaracs) {
                        Object.keys(debuffCaracs).forEach(([key]) => {
                            const CaracKey = key as keyof typeof charData.Caracteristics;
                            if (debuffCaracs[CaracKey]) { charData.Caracteristics[CaracKey] += debuffCaracs[CaracKey]; };
                        });
                    } */
    
                    // Debuff CombatStats
                    const debuffCombatStats = effect.Effect.CombatStats || null;
                    if (debuffCombatStats) {
                        Object.keys(debuffCombatStats).forEach((key) => {
                            const combatStatKey = key as keyof typeof charData.CombatStats;
                            if (debuffCombatStats[combatStatKey]) { charData.CombatStats[combatStatKey] += debuffCombatStats[combatStatKey]; };
                        });
                    }
    
                    // Dot & Hot
                    const effectDot = effect.Effect.Dot || null;
                    const effectHot = effect.Effect.Hot || null;
                    if(effectDot) charData.TurnEffect.Dot += effectDot;
                    if(effectHot) charData.TurnEffect.Hot += effectHot;
                }
                effect.Applied = true;
            }
        })
    })
    

    return charData;
}

export function unapplyEffect(charData: CharStatsInterface, effectData: CharBuffInterface | CharDebuffInterface): CharStatsInterface {
    if (!effectData) { return charData; }
    if (effectData.Applied) {
        if (effectData.Effect) {
            // Effect Carac  VOIR AVEC HUGO RANG
            /* const effectCaracs = effect.Effect.CharCaracteristics || null; 
            if (effectCaracs !== null) {
                Object.keys(effectCaracs).forEach(([key]) => {
                    const CaracKey = key as keyof typeof charData.Caracteristics;
                    if (effectCaracs[CaracKey]) { charData.Caracteristics[CaracKey] += effectCaracs[CaracKey]; };
                });
            } */

            // Effect CombatStats
            const effectCombatStats = effectData.Effect.CombatStats || null;
            if (effectCombatStats) {
                Object.keys(effectCombatStats).forEach((key) => {
                    const combatStatKey = key as keyof typeof charData.CombatStats;
                    if (effectCombatStats[combatStatKey]) { charData.CombatStats[combatStatKey] -= effectCombatStats[combatStatKey]; }
                });
            }

            // Dot & Hot
            const effectDot = effectData.Effect.Dot || null;
            const effectHot = effectData.Effect.Hot || null;
            if(effectDot) charData.TurnEffect.Dot -= effectDot;
            if(effectHot) charData.TurnEffect.Hot -= effectHot;
        }
        effectData.Applied = false;
    }
    return charData;
}

export function applyStance(charData: CharStatsInterface): CharStatsInterface{
    const stanceType = charData.FightStyle?.Type;
    if(stanceType){
        const stanceTypeBuff = StanceBaseEffectArray[stanceType as keyof typeof StanceBaseEffectArray];
        if(stanceTypeBuff){
            Object.keys(stanceTypeBuff).forEach((key) => {
                const stanceBaseBuffKey = key as keyof typeof charData.CombatStats;
                if ((stanceTypeBuff as Record<string, number>)[stanceBaseBuffKey]) { charData.CombatStats[stanceBaseBuffKey] += (stanceTypeBuff as Record<string, number>)[stanceBaseBuffKey]; };
            });
        }
    }
    const stanceBuff = charData.FightStyle?.Effect?.CombatStats || null;
        if (stanceBuff) {
            Object.keys(stanceBuff).forEach((key) => {
                const stanceBuffKey = key as keyof typeof charData.CombatStats;
                if (stanceBuff[stanceBuffKey]) { charData.CombatStats[stanceBuffKey] += stanceBuff[stanceBuffKey]; };
            });
        }

    return charData;
}

export function unapplyStance(charData: CharStatsInterface): CharStatsInterface{
    const stanceType = charData.FightStyle?.Type;
    if(stanceType){
        const stanceTypeBuff = StanceBaseEffectArray[stanceType as keyof typeof StanceBaseEffectArray];
        if(stanceTypeBuff){
            Object.keys(stanceTypeBuff).forEach((key) => {
                const stanceBaseBuffKey = key as keyof typeof charData.CombatStats;
                if ((stanceTypeBuff as Record<string, number>)[stanceBaseBuffKey]) { charData.CombatStats[stanceBaseBuffKey] -= (stanceTypeBuff as Record<string, number>)[stanceBaseBuffKey]; };
            });
        }
    }
    const stanceBuff = charData.FightStyle?.Effect?.CombatStats || null;
        if (stanceBuff) {
            Object.keys(stanceBuff).forEach((key) => {
                const stanceBuffKey = key as keyof typeof charData.CombatStats;
                if (stanceBuff[stanceBuffKey]) { charData.CombatStats[stanceBuffKey] -= stanceBuff[stanceBuffKey]; };
            });
        }

    return charData;
}