import { CharStatsCaracteristics, CharStatsCaracteristicsValue, StatKey } from "../../types/stats";

function convertLetterToValue(caracs: CharStatsCaracteristics) {
    const STRValue: Record<StatKey, number | null> = { E: 1, D: 2, C: 4, B: 5, A: 7, EX: null };
    const ENDValue: Record<StatKey, number | null> = { E: 5000, D: 7000, C: 10000, B: 12000, A: 15000, EX: null };
    const AGIValue: Record<StatKey, number | null> = { E: 1, D: 2, C: 4, B: 5, A: 7, EX: null };
    const MANAValue: Record<StatKey, number | null> = { E: 150, D: 175, C: 225, B: 250, A: 300, EX: null };
    const MGKValue: Record<StatKey, number | null> = { E: 1, D: 2, C: 4, B: 5, A: 7, EX: null };
    const LUKValue: Record<StatKey, number | null> = { E: 50, D: 49, C: 47, B: 46, A: 44, EX: null };
    const SPDValue: Record<StatKey, number | null> = { E: 10, D: 20, C: 35, B: 45, A: 50, EX: null };

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
function calculerPVMax(caracs: CharStatsCaracteristicsValue): number {
    if (caracs.END === null) {
        return 0;
    }
    return caracs.END || 5000; // Valeur par défaut si END est mal défini
}

// Calcul des Actions d'Attaque (AA)
function calculerAA(caracs: CharStatsCaracteristicsValue): number {
    if (caracs.STR === null || caracs.AGI === null || caracs.SPD === null) {
        return 0;
    }
    return Math.ceil((caracs.STR + caracs.AGI + caracs.SPD) / 2);
}

// Calcul des Actions de Défense (AD)
function calculerAD(caracs: CharStatsCaracteristicsValue): number {
    if (caracs.END === null || caracs.AGI === null || caracs.SPD === null) {
        return 0;
    }
    return Math.floor((caracs.END + caracs.AGI + caracs.SPD) / 2);
}

// Calcul du Score d'Attaque (SA)
function calculerSA(caracs: CharStatsCaracteristicsValue): number {
    if (caracs.STR === null || caracs.AGI === null || caracs.SPD === null) {
        return 0;
    }
    return 300 + (caracs.STR * 3) + (caracs.AGI * 2) + (caracs.SPD * 1);
}

// Calcul du Score de Défense (SD)
function calculerSD(caracs: CharStatsCaracteristicsValue): number {
    if (caracs.END === null || caracs.AGI === null || caracs.SPD === null) {
        return 0;
    }
    return 300 + (caracs.END * 3) + (caracs.AGI * 2) + (caracs.SPD * 1);
}

// Calcul des Dégâts Physiques
function calculerDegats(baseArme: number, caracs: CharStatsCaracteristicsValue, multiplicateurClasse: number): number {
    if (baseArme === null || caracs.STR === null || multiplicateurClasse === null) {
        return 0;
    }
    return baseArme + (caracs.STR * multiplicateurClasse);
}

/* // Calcul de la Réduction des Dégâts (ReD)
function calculerReductionDegats(END: number, armure: number): number {
    const reductionBase = { E: 10, D: 20, C: 30, B: 40, A: 50, EX: 60 };
    return (reductionBase[END] || 10) + armure;
} */

/* // Calcul de la Chance de Coup Critique (CdC)
function calculerChanceCritique(LUK: number): string {
    const critiqueBase = { E: "50-50", D: "50-49", C: "50-47", B: "50-46", A: "50-44", EX: "50-40" };
    return critiqueBase[LUK] || "50-50";
} */

export const calcFunctionService = {
    convertLetterToValue,
    calculerPVMax,
    calculerAA,
    calculerAD,
    calculerSA,
    calculerSD,
    calculerDegats,
    /* calculerReductionDegats,
    calculerChanceCritique */
}