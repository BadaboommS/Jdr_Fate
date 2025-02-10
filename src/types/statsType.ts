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
    Caracteristics: CharStatsCaracteristicsType;
    CombatStats: FightStatsType;
    InitCaracteristics: CharStatsCaracteristicsType;
    InitCombatStats: FightStatsType;
    BuffsList: CharBuffInterface[];
    DebuffsList: CharDebuffInterface[];
    TurnEffect: TurnEffectInterface;
}

export interface CharDebuffInterface extends DebuffInterface {
    Applied: boolean;
    Id: number;
}

export interface CharBuffInterface extends BuffInterface {
    Applied: boolean;
    Id: number;
}

export interface DebuffInterface {
    Name: string;
    Desc: string;
    Dmg?: number;
    Effect?: EffectInterface;
}

export interface BuffInterface {
    Id: number;
    Name: string;
    Desc: string;
    Effect?: EffectInterface;
}

export interface FightStyleInterface {
    Name: string;
    Type: string;
    Effect?: EffectInterface;
}

export interface CharSkillsInteface {
    Id: number;
    Name: string;
    Desc: string;
    Effect?: EffectInterface;
    Enabled: boolean;
}

interface EffectInterface {
    CharCaracteristics?: Partial<CharStatsCaracteristicsValueType>;
    CombatStats?: Partial<FightStatsType>;
    Dot?: number;
    Hot?: number;
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

export type CharStatsCaracteristicsType = {
    STR: string,
    END: string,
    AGI: string,
    MANA: string,
    MGK: string,
    LUK: string,
    SPD: string
}

export type CharStatsCaracteristicsValueType = {
    STR: number,
    END: number,
    AGI: number,
    MANA: number,
    MGK: number,
    LUK: number,
    SPD: number
}

export type StatKey = 'E' | 'D' | 'C' | 'B' | 'A' | 'EX';

export type FightStatsType = {
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
    BuffsList: CharBuffInterface[];
    DebuffsList: CharDebuffInterface[];
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