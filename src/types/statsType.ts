import { FightStanceInterface } from "../data/FightStance";

export interface CharStatsInterface {
    Id: number;
    Name: string; Joueur: string;
    Type: string; Variant?: string;
    Weapon: WeaponType; Armor: number;
    Hp: number; InitHp: number;
    Mana: number; InitMana: number;
    Caracteristics: CharStatsCaracteristicsInterface; InitCaracteristics: CharStatsCaracteristicsInterface;
    CombatStats: CharStatsCombatStatsInterface; InitCombatStats: CharStatsCombatStatsInterface;
    BuffsList: CharBuffInterface[]; DebuffsList: CharDebuffInterface[];
    TurnEffect: TurnEffectInterface; // Dot & Hot
    FightStyleList: (FightStanceInterface | null)[]; MaxFightStyleAmount: number; // Stances Buffs
    CaracteristicsBuff: CharStatsCaracteristicsValueInterface; // After Buff / Debuff Caracteristics
    CustomCaracteristicsValue: Partial<CharStatsCaracteristicsInterface>; // EX & S
    CharSpeed: number;
}

export interface CharDebuffInterface extends DebuffInterface {
    Applied: boolean;
    Id: number;
    EffectType?: string;
}

export interface CharBuffInterface extends BuffInterface {
    Applied: boolean;
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
    CharCaracteristics?: Partial<CharStatsCaracteristicsValueInterface>;
    CombatStats?: Partial<CharStatsCombatStatsInterface>;
    Dot?: number;
    Hot?: number;
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

/* enum CharEnum { Master, Servant, PNJ };
enum ClassicServantEnum { Archer, Assassin, Berserker, Caster, Lancer, Rider, Saber };
enum SpecialServantEnum { Slayer, Shielder, Outsider, Monster, Launcher, Avenger, Elder }; */

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

export type StatKey = 'E' | 'E+' | 'D-' | 'D' | 'D+' | 'C-' | 'C' | 'C+' | 'B-' | 'B' | 'B+' | 'A-' | 'A' | 'A+' | 'EX' | 'S';
export const StatKeyArray = ['E' , 'E+' , 'D-' , 'D' , 'D+' , 'C-' , 'C' , 'C+' , 'B-' , 'B' , 'B+' , 'A-' , 'A' , 'A+' , 'EX', 'S'];

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
    //Caracteristics
    STR: string;
    END: string;
    AGI: string;
    MANA: string;
    MGK: string;
    LUK: string;
    SPD: string
    //Combat_stats
    Hp: number;
    Mana: number;
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