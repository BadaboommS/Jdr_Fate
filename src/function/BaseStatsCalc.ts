import { CharStatsCaracteristicsInterface, CharStatsInterface, CharCaracteristicsKeyType, CharStatsCaracteristicsValueInterface } from "../types/statsType";

function convertLetterToValue(caracs: CharStatsCaracteristicsInterface, customValues: Partial<CharStatsCaracteristicsInterface>) {
    const STRValue: Record<CharCaracteristicsKeyType, number> = { "E": 1, "D": 2, "C": 4, "B": 5, "A": 7, "EX": 0, "S": 0 };
    const ENDValue: Record<CharCaracteristicsKeyType, number> = { "E": 1, "D": 2, "C": 4, "B": 5, "A": 7, "EX": 0, "S": 0 };
    const AGIValue: Record<CharCaracteristicsKeyType, number> = { "E": 1, "D": 2, "C": 4, "B": 5, "A": 7, "EX": 0, "S": 0 };
    const MANAValue: Record<CharCaracteristicsKeyType, number> = { "E": 1, "D": 2, "C": 4, "B": 5, "A": 7, "EX": 0, "S": 0 };
    const MGKValue: Record<CharCaracteristicsKeyType, number> = { "E": 1, "D": 2, "C": 4, "B": 5, "A": 7, "EX": 0, "S": 0 };
    const LUKValue: Record<CharCaracteristicsKeyType, number> = { "E": 50, "D": 49, "C": 47, "B": 46, "A": 44, "EX": 0, "S": 0 }
    const SPDValue: Record<CharCaracteristicsKeyType, number> = { "E": 1, "D": 2, "C": 4, "B": 5, "A": 7, "EX": 0, "S": 0 };

    const returnCaracValues = {
        STR: STRValue[caracs.STR as keyof typeof STRValue],
        END: ENDValue[caracs.END as keyof typeof ENDValue],
        AGI: AGIValue[caracs.AGI as keyof typeof AGIValue],
        MANA: MANAValue[caracs.MANA as keyof typeof MANAValue],
        MGK: MGKValue[caracs.MGK as keyof typeof MGKValue],
        LUK: LUKValue[caracs.LUK as keyof typeof LUKValue],
        SPD: SPDValue[caracs.SPD as keyof typeof SPDValue]
    };

    // Handle custom values
    if(customValues){
        for (const key in returnCaracValues) {
            if (customValues[key as keyof CharStatsCaracteristicsInterface] !== undefined) {
                returnCaracValues[key as keyof CharStatsCaracteristicsInterface] = Number(customValues[key as keyof CharStatsCaracteristicsInterface]);
            }
        }
    }
    return returnCaracValues;
}

// Calcul des Points de Vie (PV Max)
function calcPVMax(END: CharCaracteristicsKeyType, ENDOverload?: number): number {
    const ENDValue: Record<CharCaracteristicsKeyType, number | null> = { "E": 5000, "D": 7000, "C": 10000, "B": 12000, "A": 15000, "EX": 0, "S": 0 };
    let Hp = ENDValue[END] || 5000;
    if(ENDOverload) Hp += (ENDOverload * 500);
    return Hp;
}

// Calcul du Mana
function calcManaMax(MANA: CharCaracteristicsKeyType, MANAOverload?: number): number {
    const MANAValue: Record<CharCaracteristicsKeyType, number | null> = { "E": 500, "D": 700, "C": 1000, "B": 1200, "A": 1500, "EX": 0, "S": 0 };
    let Mana = MANAValue[MANA] || 5000;
    if(MANAOverload) Mana += (MANAOverload * 500);
    return Mana;
}

// Calcul des Actions d'Attaque (AA)
function calcAA(STR: number, AGI: number, SPD: number): number {
    return Math.ceil((STR + AGI + SPD) / 2);
}

// Calcul des Actions de Défense (AD)
function calcAD(END: number, AGI: number, SPD: number): number {
    return Math.floor((END + AGI + SPD) / 2);
}

// Calcul des Dégâts Physiques
function calcDMG(STR: number): number {
    return (STR * 5);
}

// Calcul de la Réduction des Dégâts (ReD)
function calcReD(END: number, armure: number): number {
    return (END * 3 + armure);
}

// Calcul de la Chance de Coup Critique (CdC)
function calcCC(LUK: number): number {
    return 51 - LUK;
}

// Calcul Vitesse
function calcVitesse(SPD: number): number {
    return (25 * SPD) + 15;
}

export function caracToStatsCalc (caracLetters: CharStatsCaracteristicsInterface, customValues: Partial<CharStatsCaracteristicsInterface>, armor: number, caracOverload: CharStatsCaracteristicsValueInterface) {
    const caracValues = convertLetterToValue(caracLetters, customValues);
    return {
        "Hp" : calcPVMax(caracLetters.END as CharCaracteristicsKeyType, caracOverload.END),
        "Mana" : calcManaMax(caracLetters.MANA as CharCaracteristicsKeyType, caracOverload.MANA),
        "Ini": caracValues.SPD,
        "SA": 0,
        "AA": calcAA(caracValues.STR, caracValues.AGI, caracValues.SPD),
        "DMG": calcDMG(caracValues.STR),
        "PA": 0,
        "SD": 0,
        "AD": calcAD(caracValues.END, caracValues.AGI, caracValues.SPD),
        "ReD": calcReD(caracValues.END, armor),
        "CdC": calcCC(caracValues.LUK),
        "CC": 2,
        "AN": 0,
        "CharSpeed": calcVitesse(caracValues.SPD)
    }
}

export function updateCombatStatsCalc (charData: CharStatsInterface){
    const newCharData = { ...charData };
    const customCaracteristicsValue = charData.CustomCaracteristicsValue;
    const caracValues = convertLetterToValue(newCharData.Caracteristics, customCaracteristicsValue);
    Object.keys(caracValues).forEach((key) => {
        const caracKey = key as keyof CharStatsCaracteristicsInterface;
        if(newCharData.CaracteristicsBuff[caracKey]) { caracValues[caracKey] += newCharData.CaracteristicsBuff[caracKey]; };
        if(newCharData.CaracteristicsOverload.capacity[caracKey] < 0) { caracValues[caracKey] += newCharData.CaracteristicsOverload.capacity[caracKey]; };
        if(newCharData.CaracteristicsOverload.active[caracKey] > 0) { caracValues[caracKey] += newCharData.CaracteristicsOverload.active[caracKey]; };
    });
    newCharData.CombatStats = {
        "Ini": caracValues.SPD,
        "SA": newCharData.CombatStats.SA,
        "AA": calcAA(caracValues.STR, caracValues.AGI, caracValues.SPD),
        "DMG": calcDMG(caracValues.STR),
        "PA": newCharData.CombatStats.PA,
        "SD": newCharData.CombatStats.SD,
        "AD": calcAD(caracValues.END, caracValues.AGI, caracValues.SPD),
        "ReD": calcReD(caracValues.END, newCharData.Armor),
        "CdC": calcCC(caracValues.LUK),
        "CC": newCharData.CombatStats.CC,
        "AN": newCharData.CombatStats.AN,
    }
    newCharData.CharSpeed = calcVitesse(caracValues.SPD);
    return newCharData;
}