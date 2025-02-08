import { CharDebuffInterface, CharStatsInterface, CharBuffInterface, DebuffType } from "../../../../types/statsType";
import { rollDice } from "../../../../function/GlobalFunction";
import { CCDebuffList } from "../../../../types/fightType";

const DEBUG = false;

export function handleFightAtk(
    attackerId: number | null,
    defenderId: number | null,
    charData: CharStatsInterface[],
    setCharData: (data: CharStatsInterface[]) => void,
    displayActorAData: CharStatsInterface | null,
    setDisplayActorAData: (data: CharStatsInterface | null) => void,
    displayActorBData: CharStatsInterface | null,
    setDisplayActorBData: (data: CharStatsInterface | null) => void,
    handleHistoryEventAdd: (msg: string, type: string, title?: string) => void,
    nbAtk?: number
): void {
    if (attackerId === null || defenderId === null) { return; }

    const attackerData = charData[charData.findIndex((char) => char.Id === attackerId)];
    let defenderData = charData[charData.findIndex((char) => char.Id === defenderId)];
    const atkCount = (nbAtk) ? nbAtk : attackerData.CombatStats.AA;

    handleHistoryEventAdd(`-- ${attackerData.Name} attaque ${defenderData.Name} --`, 'Text');

    for (let i = 0; i < atkCount; i++) {
        // FightCalc
        const combatRes = handleDmgCalc(attackerData, defenderData, i); // Calc Attack

        // Display all turn msg
        combatRes.msg.map((msg) => handleHistoryEventAdd(msg.historyMsg, msg.msgType, msg.msgTitle));

        // Add new debuff
        if (combatRes.debuff !== null && combatRes.debuff !== undefined) { 
            const newDebuff = { ...combatRes.debuff, Applied: false, Id: defenderData.DebuffsList[0]? defenderData.DebuffsList[defenderData.DebuffsList.length - 1].Id + 1: 0 };
            defenderData = addEffect(defenderData, newDebuff, "Debuff");
        }
        
        // setData
        defenderData = { ...defenderData, Hp: defenderData.Hp - combatRes.dmg };
    }

    handleHistoryEventAdd(`-- Fin de l'attaque --`, 'Text');

    // Save changes to charData
    setCharData(charData.map((char) => char.Id === defenderData.Id ? defenderData : char)); // defender

    // reload state for display
    if (displayActorAData?.Id === attackerId) { setDisplayActorAData(attackerData); }
    if (displayActorAData?.Id === defenderId) { setDisplayActorAData(defenderData); }
    if (displayActorBData?.Id === attackerId) { setDisplayActorBData(attackerData); }
    if (displayActorBData?.Id === defenderId) { setDisplayActorBData(defenderData); }
}

function handleDmgCalc(Attacker: CharStatsInterface, Defender: CharStatsInterface, atkNumber: number) {
    const atkJet = rollDice(100) + Attacker.CombatStats.SA;
    const defJet = rollDice(100) + Defender.CombatStats.SD;
    if(DEBUG) console.log('atk, def: ',atkJet, defJet);

    // Calcul malus AD
    // Todo: If stance change max malus
    const maxMalus = 90;
    const malusAD = (atkNumber - Defender.CombatStats.AD) > 0 ? Math.min((atkNumber - Defender.CombatStats.AD) * -15, -maxMalus) : 0;
    if(DEBUG) console.log('malusAD', malusAD);

    // Calcul succès atk
    const atkSuccess = (defJet + malusAD) - atkJet;
    if(atkSuccess > 0){ //Echec atk
        if(DEBUG) console.log('echec atk: ', atkSuccess);
        const dmg = 0;
        const msgArray = [{ historyMsg: `Atk N°${atkNumber + 1}: Echec`, msgType: 'Def', msgTitle: `JetAtk: ${atkJet} | JetDef: ${defJet}`}];
        return({ dmg: dmg, msg: msgArray });
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
    const finalDmg = Math.floor(Dmg + armorPierce);
    if(DEBUG) console.log('finalDmg: ', finalDmg);

    const msgArray = [{ historyMsg: `Atk N°${atkNumber + 1}: ${finalDmg} Dmg`, msgType: 'Atk', msgTitle: `JetAtk: ${atkJet} | JetDef: ${defJet}`}];

    // Calcul CC
    const CCDiceRoll = rollDice(50);
    let debuff: DebuffType | null = null;

    if(CCDiceRoll < Attacker.CombatStats.CdC){
        msgArray.push({ historyMsg: `Critical Hit! ⭐`, msgType: 'CC', msgTitle: ''});
        
        // Select debuff
        const weaponTypeDebuffList = CCDebuffList[CCDebuffList.findIndex(debuff => debuff.Type === Attacker.Weapon.WeaponType)];

        if(Defender.DebuffsList.length > 5){
            msgArray.push({ historyMsg: `${Defender.Name} a trop de debuff !`, msgType: 'CC', msgTitle: ''});
        }else{
            do{
                debuff = weaponTypeDebuffList.Debuffs[rollDice(6) - 1];
            }while(Defender.DebuffsList.some(d => d.Name === debuff?.Name));
            msgArray.push({ historyMsg: `${Defender.Name} reçoit ${debuff.Name}`, msgType: 'CC', msgTitle: ''});
        }
    }

    return({ dmg: finalDmg, msg: msgArray, debuff: debuff });
}

export function addEffect(charData: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface, effectType: 'Buff' | 'Debuff'): CharStatsInterface{
    const effectList = effectType === 'Buff' ? charData.BuffsList : charData.DebuffsList;
    const updatedEffectList = [...effectList, effect];
    const updatedcharData = { ...charData, BuffsList: effectType === 'Buff' ? updatedEffectList : charData.BuffsList, DebuffsList: effectType === 'Debuff' ? updatedEffectList : charData.DebuffsList};
    const effectUpdatedcharData = applyEffect(updatedcharData, effectType);
    return effectUpdatedcharData;
}

export function removeEffect(charData: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface, effectType: 'Buff' | 'Debuff'): CharStatsInterface{
    const effectList = effectType === 'Buff' ? charData.BuffsList : charData.DebuffsList;
    const updatedEffectList = effectList.filter((e) => e.Id !== effect.Id);
    const updatedcharData = { ...charData, BuffsList: effectType === 'Buff' ? updatedEffectList : charData.BuffsList, DebuffsList: effectType === 'Debuff' ? updatedEffectList : charData.DebuffsList};
    const effectUpdatedcharData = unapplyEffect(updatedcharData, effect);
    return effectUpdatedcharData;
}

export function applyEffect(charData: CharStatsInterface, effectType: 'Buff' | 'Debuff'): CharStatsInterface{
    const effectList = effectType === 'Buff' ? charData.BuffsList : charData.DebuffsList;

    effectList.forEach((effect) => {
        if(!effect.Applied){
            if("Dmg" in effect && typeof(effect.Dmg) === "number"){ charData.Hp += effect.Dmg || 0; }

            if(effect.Effect){
                // Debuff Carac  VOIR AVEC HUGO RANG
                /* const debuffCaracs = debuff.Effect.CharCaracteristics || null; 
                if (debuffCaracs !== null) {
                    Object.keys(debuffCaracs).forEach(([key]) => {
                        const CaracKey = key as keyof typeof charData.Caracteristics;
                        if (debuffCaracs[CaracKey]) { charData.Caracteristics[CaracKey] += debuffCaracs[CaracKey]; };
                    });
                } */

                // Debuff CombatStats
                const debuffCombatStats = effect.Effect.CombatStats || null;
                if (debuffCombatStats !== null) {
                    Object.keys(debuffCombatStats).forEach((key) => {
                        const combatStatKey = key as keyof typeof charData.CombatStats;
                        if (debuffCombatStats[combatStatKey]) { charData.CombatStats[combatStatKey] += debuffCombatStats[combatStatKey]; };
                    });
                }
            }
            effect.Applied = true;
        }
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
            if (effectCombatStats !== null) {
                Object.keys(effectCombatStats).forEach((key) => {
                    const combatStatKey = key as keyof typeof charData.CombatStats;
                    if (effectCombatStats[combatStatKey]) { charData.CombatStats[combatStatKey] -= effectCombatStats[combatStatKey]; }
                });
            }
        }
        effectData.Applied = false;
    }
    return charData;
}