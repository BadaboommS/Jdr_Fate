export interface CharStatsInterface {
    Id: number;
    Name: string;
    Joueur: string;
    Type: string;
    Variant?: string;
    Weapon: WeaponType;
    Armor: number;
    Hp: number;
    Mana: number;
    Caracteristics: CharStatsCaracteristics;
    CombatStats: FightStatsType;
    InitCaracteristics: CharStatsCaracteristics;
    InitCombatStats: FightStatsType;
    BuffsList: BuffListType[];
    DebuffsList: DebuffType[];
}

export type DebuffType = {
    Name: string,
    Desc: string,
    Effect: string
}

export type BuffListType = {
    Name: string,
    Desc: string,
    Effect: string
}

/* enum CharEnum { Master, Servant, PNJ };
enum ClassicServantEnum { Archer, Assassin, Berserker, Caster, Lancer, Rider, Saber };
enum SpecialServantEnum { Slayer, Shielder, Outsider, Monster, Launcher, Avenger, Elder }; */

type WeaponType = {
    WeaponName: string,
    WeaponDmg: number,
    WeaponType: string,
}

export type CharStatsCaracteristics = {
    STR: string,
    END: string,
    AGI: string,
    MANA: string,
    MGK: string,
    LUK: string,
    SPD: string
}

export type CharStatsCaracteristicsValue = {
    STR: number,
    END: number,
    AGI: number,
    MANA: number,
    MGK: number,
    LUK: number,
    SPD: number
}

export type StatKey = 'E' | 'D' | 'C' | 'B' | 'A' | 'EX';

type FightStatsType = {
    Ini: number, // Initiative : bonus 1er tour
    SA: number,  // Score Atk : précision
    AA: number,  // Actions Atk : nombre atk en 1 tour
    DMG: number, // Dégats -> Arme + boost
    PA: number,  // Pénétration armure : à soustraire à la ReD adverse
    SD: number,  // Score de Def : capacité à se défendre d'une atk
    AD: number,  // Actions de Def : nombre de jets de def avant de subir des malus
    ReD: number, // Réduction de Dégats : réduit les dmg de chaque atk -> Armure + consitution + boost
    CdC: number, // Chance de Crit : %
    CC: number,  // Coup Critique : nombre de CC max en un tour
    AN: number   // Actions neutres
}

export enum OffFightingPoseEnum {
    Serp, // Serpent
    Rhin, // Rhinocéros
    Drag, // Dragon
    Pant  // Panthère
}

export enum DefFightingPoseEnum {
    Roch, // Rocher
    Leza, // Lezard
    Pieu, // Pieuvre
    Gori  // Gorille
}

export enum NeutralFightningPoseEnum {
    Rose, // Roseau
    Gole, // Golem
    Flam, // Flamant Rose
    Marm  // Marmotte
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
}

/* 
Un jet d’initiative est un jet 1d10+SPD
Un jet d’attaque est un jet 1d100+SA.
Un jet de défense est un jet 1d100+SD.
Un jet de coups critiques est un jet 1d50.
Un jet de paramètre est 1d10+[valeur du paramètre]
 */