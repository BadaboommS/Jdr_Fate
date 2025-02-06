import { CharStatsInterface, DebuffType } from "../../types/statsType";
import { rollDice } from "../../function/GlobalFunction";
import { CCDebuffList } from "../../types/fightType";

const DEBUG = false;

export function handleDmgCalc(Attacker: CharStatsInterface, Defender: CharStatsInterface, atkNumber: number) {
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
        const msgArray = [{ historyMsg: `Atk N°${atkNumber + 1}: Echec`, msgType: 'Def'}];
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

    const msgArray = [{ historyMsg: `Atk N°${atkNumber + 1}: ${finalDmg} Dmg`, msgType: 'Atk'}];

    // Calcul CC
    const CCDiceRoll = rollDice(50);
    let debuff: DebuffType | null = null;

    if(CCDiceRoll < Attacker.CombatStats.CdC){
        msgArray.push({ historyMsg: `Critical Hit! ⭐`, msgType: 'CC'});
        
        // Select debuff
        const weaponTypeDebuffList = CCDebuffList[CCDebuffList.findIndex(debuff => debuff.Type === Attacker.Weapon.WeaponType)];

        if(Defender.DebuffsList.length > 5){
            msgArray.push({ historyMsg: `${Defender.Name} a trop de debuff !`, msgType: 'CC'});
        }else{
            do{
                debuff = weaponTypeDebuffList.Debuffs[rollDice(6) - 1];
            }while(Defender.DebuffsList.some(d => d.Name === debuff?.Name));
            msgArray.push({ historyMsg: `${Defender.Name} reçoit ${debuff.Name}`, msgType: 'CC'});
        }
    }

    return({ dmg: finalDmg, msg: msgArray, debuff: debuff });
}