import { CharStatsCaracteristics, StatKey } from "../types/statsType";
import { rollDice } from "./GlobalFunction";

function convertLetterToValue(caracs: CharStatsCaracteristics) {
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
function calculerPVMax(END: StatKey): number {
    const ENDValue: Record<StatKey, number | null> = { E: 5000, D: 7000, C: 10000, B: 12000, A: 15000, EX: null };
    return ENDValue[END] || 5000;
}

// Calcul de l'ini
function calculerIni(SPD: number): number {
    return SPD + rollDice(10);
}

// Calcul des Actions d'Attaque (AA)
function calculerAA(STR: number, AGI: number, SPD: number): number {
    return Math.ceil((STR + AGI + SPD) / 2);
}

// Calcul des Actions de Défense (AD)
function calculerAD(END: number, AGI: number, SPD: number): number {
    return Math.floor((END + AGI + SPD) / 2);
}

// Calcul du Score d'Attaque (SA)
function calculerSA(STR: number, AGI: number, SPD: number): number {
    return 300 + (STR * 3) + (AGI * 2) + (SPD * 1);
}

// Calcul du Score de Défense (SD)
function calculerSD(END: number, AGI: number, SPD: number): number {
    return 300 + (END * 3) + (AGI * 2) + (SPD * 1);
}

// Calcul des Dégâts Physiques
function calculerDMG(STR: number): number {
    return (STR * 5);
}

// Calcul de la Réduction des Dégâts (ReD)
function calculerReD(END: number, armure: number): number {
    return (END * 3 + armure);
}

// Calcul de la Chance de Coup Critique (CdC)
function calculerCC(LUK: number): number {
    return 51 - LUK;
}

/* // Définition des coûts en PA selon l'arme
const coutPAArme: { [key: string]: number } = { "Dague": 5, "Épée légère": 10, "Épée lourde": 20, "Lance": 15, "Arc": 10, "Poings": 5, "Noble Phantasm": 50};

// Fonction pour calculer les PA nécessaires pour attaquer
function calculerPA(arme: string, nbAttaques: number): number {
    const paParAttaque = coutPAArme[arme] || 10; // Valeur par défaut : 10
    return paParAttaque * nbAttaques;
} */

export const calcFunctionService = {
    convertLetterToValue,
    calculerPVMax,
    calculerIni,
    calculerAA,
    calculerAD,
    calculerSA,
    calculerSD,
    calculerDMG,
    calculerReD,
    calculerCC,
    /* calculerPA */
}