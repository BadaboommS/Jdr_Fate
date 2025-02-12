import { EffectInterface } from "../types/statsType"

export interface EffectPresetInterface {
    Id: number;
    Name: string;
    Desc: string;
    EffectType: "Buff" | "Debuff";
    Dmg?: number;
    Effect?: EffectInterface;
}

export const EffectPresetArray: EffectPresetInterface[] = [
    {
        Id: 0,
        Name: "Test 1",
        Desc: "Debuff dot",
        EffectType: "Debuff",
        Effect: {
            Dot: 1
        }
    },
    {
        Id: 1,
        Name: "Test 2",
        Desc: "Buff combat stats",
        EffectType: "Buff",
        Effect: {
            CombatStats: { Ini: 10 }
        }
    },
    {
        Id: 2,
        Name: "Test 3",
        Desc: "Buff no effect",
        EffectType: "Buff",
    },
    {
        Id: 3,
        Name: "Test 4",
        Desc: "Buff Carac",
        EffectType: "Buff",
        Effect: {
            CharCaracteristics: { STR: 5 }
        }
    },
    { 
        Id: 4,
        Name: "Poison du Serpent",
        Desc: `Vous prenez des dégâts sur la durée (50 pendant 4 tours).
--------------------------
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Debuff",
        Effect: { Dot: 50 }
    },
    { 
        Id: 5,
        Name: "Premier Coup du Rhinocéros",
        Desc: `Votre AA et AD est réduit de 1 pendant 3 tours.
--------------------------
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Debuff",
        Effect: { CombatStats: { AD: -1, AA: -1 } }
    },
    { 
        Id: 6,
        Name: "Second Coup du Rhinocéros",
        Desc: `Votre AD est réduit de 2 pendant 3 tours.
--------------------------
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Debuff",
        Effect: { CombatStats: { AD: -2 } }
    },
    {
        Id: 6,
        Name: "Troisième Coup du Rhinocéros",
        Desc: `Votre AA est réduit de 2 pendant 3 tours.
--------------------------
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Debuff",
        Effect: { CombatStats: { AA: -2 } }
    },
    { 
        Id: 7,
        Name: "Déchainement du Dragon",
        Desc: `Vous êtes prêt à vous déchainer. +30 SA, +2 AA, +20 DMG pendant un tour.
# Laisser la position du dragon pour le tour 2 (les effets négatifs sont annulés par le buff).
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Buff",
        Effect: { CombatStats: { SA: 30, AA: 2, DMG: 20, SD: 15, AD: 1 } }
    },
    { 
        Id: 8,
        Name: "Protection du Gorille",
        Desc: `Vous êtes arrivé a temps pour sauver quelqu'un. +15 SD.
--------------------------
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Buff",
        Effect: { CombatStats: { SD: 15 } }
    },
    { 
        Id: 9,
        Name: "Revers de Roseau",
        Desc: `Vous frappez dans le vide, votre vigueur se brisant contre la souplesse du roseau. -1 AA.
--------------------------
# Le MJ devra gérer manuellement la supression de ceux-ci.`, 
        EffectType: "Debuff",
        Effect: { CombatStats: { AA: -1 } }
    },
    { 
        Id: 10,
        Name: "Raideur du Golem",
        Desc: `Vous êtes résistant, mais perdez la moitié de vos AA.
--------------------------
# Le MJ devra gérer manuellement la supression de ceux-ci.
--------------------------
# La valeur de perte de AA doit être entrée manuellement dans le debuff (-1 de base).
# Le MJ devra par la suite gérer manuellement la suppression de celui-ci.`, 
        EffectType: "Debuff",
        Effect: { CombatStats: { AA: -1 } }
    }
]