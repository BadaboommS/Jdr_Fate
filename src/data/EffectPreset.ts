import { EffectInterface } from "../types/statsType"

export interface EffectPresetInterface {
    Id: number;
    Name: string;
    Desc: string;
    EffectType: "Buff" | "Debuff";
    Dmg?: number;
    Effect?: EffectInterface;
}

export function findPreset ( Name?: string, Id?: number ){
    let preset = null;
    if(Name) preset = EffectPresetArray.find(p => p.Name === Name);
    if(Id) preset = EffectPresetArray.find(p => p.Id === Id);
    return preset ? { Name: preset.Name, Desc: preset.Desc, Effect: preset.Effect } : null;
}

export const EffectPresetArray: EffectPresetInterface[] = [
    { 
        Id: 0,
        Name: "Poison du Serpent",
        Desc: `Poison du Serpent
--------------------------
Vous prenez des dégâts sur la durée (50 pendant 4 tours).
--------------------------
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Debuff",
        Effect: { TurnEffect: { Dot: 50 } }
    },
    { 
        Id: 1,
        Name: "Premier Coup du Rhinocéros",
        Desc: `Premier Coup du Rhinocéros
--------------------------
Votre AA et AD est réduit de 1 pendant 3 tours.
--------------------------
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Debuff",
        Effect: { CombatStats: { AD: -1, AA: -1 } }
    },
    { 
        Id: 2,
        Name: "Second Coup du Rhinocéros",
        Desc: `Second Coup du Rhinocéros
--------------------------
Votre AD est réduit de 2 pendant 3 tours.
--------------------------
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Debuff",
        Effect: { CombatStats: { AD: -2 } }
    },
    {
        Id: 3,
        Name: "Troisième Coup du Rhinocéros",
        Desc: `Troisième Coup du Rhinocéros
--------------------------
Votre AA est réduit de 2 pendant 3 tours.
--------------------------
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Debuff",
        Effect: { CombatStats: { AA: -2 } }
    },
    { 
        Id: 4,
        Name: "Déchainement du Dragon",
        Desc: `Déchainement du Dragon
--------------------------
Vous êtes prêt à vous déchainer. +30 SA, +2 AA, +20 DMG pendant un tour.
--------------------------
# Laisser la position du dragon pour le tour 2 (les effets négatifs sont annulés par le buff).
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Buff",
        Effect: { CombatStats: { SA: 30, AA: 2, DMG: 20, SD: 15, AD: 1 } }
    },
    { 
        Id: 5,
        Name: "Protection du Gorille",
        Desc: `Protection du Gorille
--------------------------
Vous êtes arrivé a temps pour sauver quelqu'un. +15 SD.
--------------------------
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Buff",
        Effect: { CombatStats: { SD: 15 } }
    },
    { 
        Id: 6,
        Name: "Revers de Roseau",
        Desc: `Revers de Roseau
--------------------------
Vous frappez dans le vide, votre vigueur se brisant contre la souplesse du roseau. -1 AA.
--------------------------
# Le MJ devra gérer manuellement la supression de ceux-ci.`, 
        EffectType: "Debuff",
        Effect: { CombatStats: { AA: -1 } }
    },
    { 
        Id: 7,
        Name: "Raideur du Golem",
        Desc: `Raideur du Golem
--------------------------
Vous êtes résistant, mais perdez la moitié de vos AA.
--------------------------
# Le MJ devra gérer manuellement la supression de celui-ci.`, 
        EffectType: "Debuff",
        Effect: { CombatStats: { AA: -1 } }
    },
    { 
        Id: 8,
        Name: "Bonus Initiative 1",
        Desc: `Bonus Initiative 1
--------------------------
Vous avez l'initiative.
--------------------------
# Si ce buff est visible, le calcul d'initiative custom a été activé.
# Dans ce cas précis, le MJ devras retirer manuellement le buff à la fin du tour.`, 
        EffectType: "Buff",
        Effect: { CombatStats: { SA: 15, SD: 15 } }
    },
    { 
        Id: 9,
        Name: "Bonus Initiative 2",
        Desc: `Bonus Initiative 2
--------------------------
Vous avez grandement l'initiative.
--------------------------
# Si ce buff est visible, le calcul d'initiative custom a été activé.
# Dans ce cas précis, le MJ devras retirer manuellement le buff à la fin du tour.`, 
        EffectType: "Buff",
        Effect: { CombatStats: { SA: 30, SD: 30, CdC: 2 } }
    },
    { 
        Id: 10,
        Name: "Mal de mana",
        Desc: `Mal de mana
--------------------------
Vous n'avez pas assez de mana pour vous mouvoir correctement ce tour.
--------------------------
# Si ce buff est visible, le calcul des coûts en mana custom a été activé.
# Dans ce cas précis, le MJ devras retirer manuellement le buff à la fin du tour.`, 
        EffectType: "Debuff",
        Effect: { CombatStats: { AA: 0, AD: 0, SA: 50, SD: 50 } }
    }
]