import { CharDebuffInterface, CharStatsInterface, CharBuffInterface, BuffInterface, DebuffInterface, CharStatsCaracteristicsInterface } from "../types/statsType";
import { StanceBaseEffectArray } from "../data/FightStance";
import { rollDice } from "./GlobalFunction";
import { CCDebuffList } from "../data/CCDebuff";
import { EffectPresetArray } from "../data/EffectPreset";
import { updateCombatStatsCalc } from "./BaseStatsCalc";

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
        if(combatRes.critCounter) critCounter += 1;

        // DataCounter
        if(combatRes.dmg) dmgCounter += combatRes.dmg;
        
        // setData
        defenderData = { ...combatRes.Defender, Hp: combatRes.Defender.Hp - combatRes.dmg };
    }

    // Stance Roseau
    if(defenderData.FightStyle?.Name === "Position du Roseau"){
        const successfullDefCounter = Math.floor((atkCount - successAtkCounter) / 3);
        const roseauDebuff = EffectPresetArray.find(effect => effect.Name === "Revers de Roseau");
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
        const msgArray = [{ historyMsg: `Atk N°${atkNumber + 1}: Echec`, msgType: 'Def', msgTitle: `${Attacker.Name}: ${atkJet - Attacker.CombatStats.SA} + ${Attacker.CombatStats.SA} | ${Defender.Name}: ${defJet - Defender.CombatStats.SD} + ${Defender.CombatStats.SD}`}];
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

    const msgArray = [{ historyMsg: `Atk N°${atkNumber + 1}: ${finalDmg} Dmg`, msgType: 'Atk', msgTitle: `${Attacker.Name}: ${atkJet - Attacker.CombatStats.SA} + ${Attacker.CombatStats.SA} | ${Defender.Name}: ${defJet - Defender.CombatStats.SD} + ${Defender.CombatStats.SD}`}];

    // Calcul CC
    const CCDiceRoll = rollDice(50);
    let debuff: DebuffInterface | null = null;

    // Check CC
    const enableCC = (critCounter < Attacker.CombatStats.CC);
    if(CCDiceRoll < Attacker.CombatStats.CdC && Attacker.FightStyle?.Name !== "Position du Flamant Rose"){
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
                const newDebuff: DebuffInterface = { Name: debuff.Name, Desc: debuff.Desc, Effect: debuff.Effect };
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
        if(Defender.DebuffsList.some(debuff => debuff.Name === "Poison du Serpent")){
            msgArray.push({ historyMsg: `Le poison de ${Defender.Name} est refresh (4 tours) !`, msgType: 'CC', msgTitle: ''});
        }else if(Defender.FightStyle?.Name === "Position de la Pieuvre"){
            msgArray.push({ historyMsg: `${Defender.Name} esquive le poison du serpent !`, msgType: 'CC', msgTitle: ''});
        }else{
            const serpentDotDebuff = EffectPresetArray.find(effect => effect.Name === "Poison du Serpent");
            if(serpentDotDebuff){
                Defender = addEffect(Defender, serpentDotDebuff, "Debuff");
                msgArray.push({ historyMsg: `Position du Serpent inflige 50 dégats sur la durée ! (4 tour)`, msgType: 'Atk', msgTitle: ''});
            } 
        }
    }

    // Rhinocéros Stance
    if(Attacker.FightStyle?.Name === "Position du Rhinocéros"){
        if(atkSuccessCounter === 0 || atkSuccessCounter === 1 || atkSuccessCounter === 2){
            const atkName = ["Premier", "Second", "Troisième"][atkSuccessCounter];
            if (rollDice(100) <= 50) {
                if(Defender.DebuffsList.some(debuff => debuff.Name === `${atkName} Coup du Rhinocéros`)){
                    msgArray.push({ historyMsg: `${Defender.Name} a déjà le ${atkName} Coup du Rhinocéros !`, msgType: 'CC', msgTitle: ''});
                }else if(Defender.FightStyle?.Name === "Position de la Pieuvre"){
                    msgArray.push({ historyMsg: `${Defender.Name} esquive le ${atkName} Coup du Rhinocéros !`, msgType: 'CC', msgTitle: ''});
                }else if(enableCC){
                    const rhinoDebuff = EffectPresetArray.find(effect => effect.Name === `${atkName} Coup du Rhinocéros`);
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
    return({ Defender: Defender, dmg: finalDmg, msg: msgArray, debuff: debuff, critCounter: critCounter });
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

export function applyStance(charData: CharStatsInterface): CharStatsInterface{
    const newData = { ...charData };
    const stanceType = newData.FightStyle?.Type;
    if(stanceType){
        const stanceTypeBuff = StanceBaseEffectArray[stanceType as keyof typeof StanceBaseEffectArray];
        if(stanceTypeBuff){
            Object.keys(stanceTypeBuff).forEach((key) => {
                const stanceBaseBuffKey = key as keyof typeof newData.CombatStats;
                if ((stanceTypeBuff as Record<string, number>)[stanceBaseBuffKey]) { newData.CombatStats[stanceBaseBuffKey] += (stanceTypeBuff as Record<string, number>)[stanceBaseBuffKey]; };
            });
        }
    }
    const stanceBuff = newData.FightStyle?.Effect?.CombatStats || null;
        if (stanceBuff) {
            Object.keys(stanceBuff).forEach((key) => {
                const stanceBuffKey = key as keyof typeof newData.CombatStats;
                if (stanceBuff[stanceBuffKey]) { newData.CombatStats[stanceBuffKey] += stanceBuff[stanceBuffKey]; };
            });
        }

    return newData;
}

export function unapplyStance(charData: CharStatsInterface): CharStatsInterface{
    const newData = { ...charData };
    const stanceType = newData.FightStyle?.Type;
    if(stanceType){
        const stanceTypeBuff = StanceBaseEffectArray[stanceType as keyof typeof StanceBaseEffectArray];
        if(stanceTypeBuff){
            Object.keys(stanceTypeBuff).forEach((key) => {
                const stanceBaseBuffKey = key as keyof typeof newData.CombatStats;
                if ((stanceTypeBuff as Record<string, number>)[stanceBaseBuffKey]) { newData.CombatStats[stanceBaseBuffKey] -= (stanceTypeBuff as Record<string, number>)[stanceBaseBuffKey]; };
            });
        }
    }
    const stanceBuff = newData.FightStyle?.Effect?.CombatStats || null;
        if (stanceBuff) {
            Object.keys(stanceBuff).forEach((key) => {
                const stanceBuffKey = key as keyof typeof newData.CombatStats;
                if (stanceBuff[stanceBuffKey]) { newData.CombatStats[stanceBuffKey] -= stanceBuff[stanceBuffKey]; };
            });
        }

    return newData;
}

export function handleTurnManaCost (charData: CharStatsInterface) {
    const newData = { ...charData };
    let manaTurnSuccess = true;
    let manaCost = Math.floor((charData.InitMana / 100) * 2);
    if(manaCost > 30) manaCost = 30;
    
    if(charData.Mana < manaCost){
        manaTurnSuccess = false;
    }else{
        newData.Mana -= manaCost;
    }

    return { manaUsedData: newData, success: manaTurnSuccess, manaCost: manaCost };
}