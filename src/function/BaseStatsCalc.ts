import { CharStatsCaracteristicsInterface, CharStatsInterface, StatKey } from "../types/statsType";

function convertLetterToValue(caracs: CharStatsCaracteristicsInterface, customValues: Partial<CharStatsCaracteristicsInterface>) {
    const STRValue: Record<StatKey, number> = { "E": 1, "E+": 1, "D-": 2, "D": 2, "D+": 3, "C-": 3, "C": 4, "C+": 4, "B-": 5, "B": 5, "B+": 6, "A-": 6, "A": 7, "A+": 8, "EX": 0, "S": 0 };
    const ENDValue: Record<StatKey, number> = { "E": 1, "E+": 1, "D-": 2, "D": 2, "D+": 3, "C-": 3, "C": 4, "C+": 4, "B-": 5, "B": 5, "B+": 6, "A-": 6, "A": 7, "A+": 8, "EX": 0, "S": 0 };
    const AGIValue: Record<StatKey, number> = { "E": 1, "E+": 1, "D-": 2, "D": 2, "D+": 3, "C-": 3, "C": 4, "C+": 4, "B-": 5, "B": 5, "B+": 6, "A-": 6, "A": 7, "A+": 8, "EX": 0, "S": 0 };
    const MANAValue: Record<StatKey, number> = { "E": 1, "E+": 1, "D-": 2, "D": 2, "D+": 3, "C-": 3, "C": 4, "C+": 4, "B-": 5, "B": 5, "B+": 6, "A-": 6, "A": 7, "A+": 8, "EX": 0, "S": 0 };
    const MGKValue: Record<StatKey, number> = { "E": 1, "E+": 1, "D-": 2, "D": 2, "D+": 3, "C-": 3, "C": 4, "C+": 4, "B-": 5, "B": 5, "B+": 6, "A-": 6, "A": 7, "A+": 8, "EX": 0, "S": 0 };
    const LUKValue: Record<StatKey, number> = { "E": 50, "E+": 50, "D-": 49, "D": 49, "D+": 48, "C-": 48, "C": 47, "C+": 47, "B-": 46, "B": 46, "B+": 45, "A-": 45, "A": 44, "A+": 43, "EX": 0, "S": 0 }
    const SPDValue: Record<StatKey, number> = { "E": 1, "E+": 1, "D-": 2, "D": 2, "D+": 3, "C-": 3, "C": 4, "C+": 4, "B-": 5, "B": 5, "B+": 6, "A-": 6, "A": 7, "A+": 8, "EX": 0, "S": 0 };

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
function calcPVMax(END: StatKey): number {
    const ENDValue: Record<StatKey, number | null> = { "E": 5000, "E+": 6000, "D-": 6000, "D": 7000, "D+": 8000, "C-": 9000, "C": 10000, "C+": 11000, "B-": 11000, "B": 12000, "B+": 13000, "A-": 14000, "A": 15000, "A+": 16000, "EX": 0, "S": 0 };
    return ENDValue[END] || 5000;
}

// Calcul du Mana
function calcManaMax(MANA: StatKey): number {
    const MANAValue: Record<StatKey, number | null> = { "E": 5000, "E+": 6000, "D-": 6000, "D": 7000, "D+": 8000, "C-": 9000, "C": 10000, "C+": 11000, "B-": 11000, "B": 12000, "B+": 13000, "A-": 14000, "A": 15000, "A+": 16000, "EX": 0, "S": 0 };
    return MANAValue[MANA] || 5000;
}

// Calcul des Actions d'Attaque (AA)
function calcAA(STR: number, AGI: number, SPD: number): number {
    return Math.ceil((STR + AGI + SPD) / 2);
}

// Calcul des Actions de Défense (AD)
function calcAD(END: number, AGI: number, SPD: number): number {
    return Math.floor((END + AGI + SPD) / 2);
}

/* // Calcul du Score d'Attaque (SA)
function calcSA(STR: number, AGI: number, SPD: number): number {
    return 300 + (STR * 3) + (AGI * 2) + (SPD * 1);
}

// Calcul du Score de Défense (SD)
function calcSD(END: number, AGI: number, SPD: number): number {
    return 300 + (END * 3) + (AGI * 2) + (SPD * 1);
} */

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

export function caracToStatsCalc (caracLetters: CharStatsCaracteristicsInterface, customValues: Partial<CharStatsCaracteristicsInterface>, armor: number) {
    const caracValues = convertLetterToValue(caracLetters, customValues);
    return {
        "Hp" : calcPVMax(caracLetters.END as StatKey),
        "Mana" : calcManaMax(caracLetters.MANA as StatKey),
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
    }
}

export function updateCombatStatsCalc (charData: CharStatsInterface){
    const newCharData = { ...charData };
    const customCaracteristicsValue = charData.CustomCaracteristicsValue;
    const caracValues = convertLetterToValue(newCharData.Caracteristics, customCaracteristicsValue);
    Object.keys(caracValues).forEach((key) => {
        const caracKey = key as keyof CharStatsCaracteristicsInterface;
        if (newCharData.CaracteristicsBuff[caracKey]) { caracValues[caracKey] += newCharData.CaracteristicsBuff[caracKey]; };
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
        "AN": newCharData.CombatStats.AN
    }
    return newCharData;
}