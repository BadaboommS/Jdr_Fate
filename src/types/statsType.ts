import { FightStanceInterface } from "../data/FightStance";

export type CharCaracteristicsKeyType = 'E' | 'D' | 'C' | 'B' | 'A' | 'EX' | 'S';
export const CharCaracteristicsKeyArray = ['E', 'D' , 'C' , 'B' , 'A' , 'EX', 'S'];
export const CharCaracteristicsArray = ["STR", "END", "AGI", "MANA", "MGK", "LUK", "SPD"];
export const CharCombatStatsArray = ["Ini", "SA", "AA", "DMG", "PA", "SD", "AD", "ReD", "CdC", "CC", "AN"];
export const CharTypeArray = ["Master", "Servant", "PNJ"];
export const ServantVariantArray = ["Archer", "Assassin", "Berserker", "Caster", "Lancer", "Rider", "Saber", "Slayer", "Shielder", "Outsider", "Monster", "Launcher", "Avenger", "Elder"];
export const WeaponTypeArray = ["Contondant", "Perçant", "Tranchant"];

export interface CharStatsInterface {
    Id: number;
    Name: string; Joueur: string;
    Type: string; Variant?: string;
    Weapon: WeaponType; Armor: number;
    Hp: number; InitHp: number;
    Mana: number; InitMana: number;
    Caracteristics: CharStatsCaracteristicsInterface; InitCaracteristics: CharStatsCaracteristicsInterface;
    CustomCaracteristicsValue: Partial<CharStatsCaracteristicsInterface>; // EX & S
    CaracteristicsBuff: CharStatsCaracteristicsValueInterface; // After Buff / Debuff Caracteristics
    CaracteristicsOverload: { active: CharStatsCaracteristicsValueInterface, capacity: CharStatsCaracteristicsValueInterface }; // Caracteristics + Using Mana
    CombatStats: CharStatsCombatStatsInterface; InitCombatStats: CharStatsCombatStatsInterface;
    BuffsList: CharBuffInterface[]; DebuffsList: CharDebuffInterface[];
    TurnEffect: TurnEffectInterface; // Dot & Hot
    FightStyleList: (FightStanceInterface | null)[]; MaxFightStyleAmount: number; // Stances Buffs
    CharSpeed: number;
}

export interface CharDebuffInterface extends DebuffInterface {
    Id: number;
    EffectType?: string;
}

export interface CharBuffInterface extends BuffInterface {
    Id: number;
    EffectType?: string;
}

export interface DebuffInterface {
    Name: string;
    Desc: string;
    Dmg?: number;
    Effect?: EffectInterface;
}

export interface BuffInterface {
    Name: string;
    Desc: string;
    Effect?: EffectInterface;
}

export interface FightStyleInterface {
    Name: string;
    Type: string;
    Effect?: EffectInterface;
}

export interface EffectInterface {
    CaracteristicsBuff?: Partial<CharStatsCaracteristicsValueInterface>;
    CombatStats?: Partial<CharStatsCombatStatsInterface>;
    TurnEffect?: Partial<TurnEffectInterface>;
}

export interface CharSkillsInteface {
    Id: number;
    Name: string;
    Desc: string;
    Effect?: EffectInterface;
    Enabled: boolean;
}

interface TurnEffectInterface {
    Dot: number;
    Hot: number;
}

type WeaponType = {
    WeaponName: string,
    WeaponDmg: number,
    WeaponType: string,
}

export interface CharStatsCaracteristicsInterface {
    STR: string;
    END: string;
    AGI: string;
    MANA: string;
    MGK: string;
    LUK: string;
    SPD: string;
}

export interface CharStatsCaracteristicsValueInterface {
    STR: number;
    END: number;
    AGI: number;
    MANA: number;
    MGK: number;
    LUK: number;
    SPD: number;
}

export interface CharStatsCombatStatsInterface {
    Ini: number;
    SA: number;
    AA: number;
    DMG: number;
    PA: number;
    SD: number;
    AD: number;
    ReD: number;
    CdC: number;
    CC: number;
    AN: number;
}

export interface CreateCharFormInputInterface {
    Name: string;
    Joueur: string;
    Type: string;
    Variant?: string;
    WeaponName: string;
    WeaponDmg: number;
    WeaponType: string;
    Armor: number;
    MaxFightStyleAmount: number;
    Hp: number;
    Mana: number;
    // Caracteristics
    STR: string;
    END: string;
    AGI: string;
    MANA: string;
    MGK: string;
    LUK: string;
    SPD: string;
    // CaracteristicsOverload
    STROverload: number;
    ENDOverload: number;
    AGIOverload: number;
    MANAOverload: number;
    MGKOverload: number;
    LUKOverload: number;
    SPDOverload: number;
    // Combat_stats
    Ini: number;
    SA: number;
    AA: number;
    DMG: number;
    PA: number;
    SD: number;
    AD: number;
    ReD: number;
    CdC: number;
    CC: number;
    AN: number;
    BuffsList: CharBuffInterface[];
    DebuffsList: CharDebuffInterface[];
    CharSpeed: number;
}

export interface EffectFormInputInterface {
    Name: string;
    Desc: string;
    STR?: number;
    END?: number;
    AGI?: number;
    MANA?: number;
    MGK?: number;
    LUK?: number;
    SPD?: number;
    Ini?: number;
    SA?: number;
    AA?: number;
    DMG?: number;
    PA?: number;
    SD?: number;
    AD?: number;
    ReD?: number;
    CdC?: number;
    CC?: number;
    AN?: number;
    Dot?: number;
    Hot?: number;
}

export const CombatStatsTitle = {
    Ini: "L’Initiative (Ini) détermine d’éventuels bonus au premier tour.",
    SA: "Le Score d’Attaque (SA) détermine la précision de l’attaque.",
    AA: "Les Actions d’Attaque (AA) déterminent le nombre d’attaques portées en 1 tour",
    DMG: "Les Dégâts (DMG) sont une base de dégâts, déterminés par l’arme, la force et d’éventuels bonus extérieurs.",
    PA: "La Pénétration d’Armure (PA) correspond à la valeur soustraite à la ReD de l’adversaire.",
    SD: "Le Score de Défense (SD) détermine la capacité à se défendre contre une attaque.",
    AD: "Les Actions de Défense (AD) déterminent le nombre de jets de défense avant de subir des malus pour toute défense ultérieure.",
    ReD: "La Réduction de Dégâts (ReD) détermine la quantité de dégâts soustraite à chaque attaque qui touche le personnage. Elle est déterminée par son armure, sa constitution et d’éventuels bonus.",
    CdC: "Les Chances de Critiques (CdC) déterminent la probabilité d’infliger des dégâts supplémentaires et d’infliger des effets néfastes aux ennemis.",
    CC: "Les Coups Critiques (CC) déterminent le nombre de coups critiques qu’il est possible de porter en un tour.",
    AN: "Les Actions neutres (AN) peuvent être gagnée grâce à des compétences, certains sorts nécessitent des AN. Il est possible de convertir 1 AA ou 1AD en 1 AN mais il faut convertir 2AN pour obtenir 1AA ou 1AD."
};