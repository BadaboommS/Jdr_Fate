import { CharStatsCaracteristicsType, StatKey } from "../types/statsType";
import { rollDice } from "./GlobalFunction";

function convertLetterToValue(caracs: CharStatsCaracteristicsType) {
    const STRValue: Record<StatKey, number> = { E: 1, D: 2, C: 4, B: 5, A: 7, EX: 0 };
    const ENDValue: Record<StatKey, number> = { E: 1, D: 2, C: 4, B: 5, A: 7, EX: 0 };
    const AGIValue: Record<StatKey, number> = { E: 1, D: 2, C: 4, B: 5, A: 7, EX: 0 };
    const MANAValue: Record<StatKey, number> = { E: 500, D: 700, C: 1000, B: 1200, A: 1500, EX: 0 };
    const MGKValue: Record<StatKey, number> = { E: 1, D: 2, C: 4, B: 5, A: 7, EX: 0 };
    const LUKValue: Record<StatKey, number> = { E: 50, D: 49, C: 47, B: 46, A: 44, EX: 0 };
    const SPDValue: Record<StatKey, number> = { E: 1, D: 2, C: 4, B: 5, A: 7, EX: 0 };

    return {
        STR: STRValue[caracs.STR as keyof typeof STRValue],
        END: ENDValue[caracs.END as keyof typeof ENDValue],
        AGI: AGIValue[caracs.AGI as keyof typeof AGIValue],
        MANA: MANAValue[caracs.MANA as keyof typeof MANAValue],
        MGK: MGKValue[caracs.MGK as keyof typeof MGKValue],
        LUK: LUKValue[caracs.LUK as keyof typeof LUKValue],
        SPD: SPDValue[caracs.SPD as keyof typeof SPDValue]
    };
}

// Calcul des Points de Vie (PV Max)
function calcPVMax(END: StatKey): number {
    const ENDValue: Record<StatKey, number | null> = { E: 5000, D: 7000, C: 10000, B: 12000, A: 15000, EX: 0 };
    return ENDValue[END] || 5000;
}

// Calcul de l'ini
function calcIni(SPD: number): number {
    return SPD + rollDice(10);
}

// Calcul des Actions d'Attaque (AA)
function calcAA(STR: number, AGI: number, SPD: number): number {
    return Math.ceil((STR + AGI + SPD) / 2);
}

// Calcul des Actions de Défense (AD)
function calcAD(END: number, AGI: number, SPD: number): number {
    return Math.floor((END + AGI + SPD) / 2);
}

// Calcul du Score d'Attaque (SA)
function calcSA(STR: number, AGI: number, SPD: number): number {
    return 300 + (STR * 3) + (AGI * 2) + (SPD * 1);
}

// Calcul du Score de Défense (SD)
function calcSD(END: number, AGI: number, SPD: number): number {
    return 300 + (END * 3) + (AGI * 2) + (SPD * 1);
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

/* function calcPA(): number {
    return 0;
} */

export const calcFunctionService = {
    convertLetterToValue,
    calcPVMax,
    calcIni,
    calcAA,
    calcAD,
    calcSA,
    calcSD,
    calcDMG,
    calcReD,
    calcCC,
    /* calcPA */
}