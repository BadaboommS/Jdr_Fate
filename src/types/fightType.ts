export interface FightListInterface {
    fightId: number;
    fightName : string;
    fightMembers : string[];
    fightState: boolean;
    fightHistory: fightHistoryType[];
    activeActorA: string | null;
    activeActorB: string | null;
}

export type fightHistoryType = {
    historyMsg: string;
    msgType: string;
    msgTitle: string;
}

export const CCDebuffList = [
    {
        Type : "Contondant",
        Debuffs : [
            {
                Name: "Trachée écrasée",
                Desc: "Ne peut plus parler pendant 5 tours. Ne peut pas utiliser de NP."
            },
            {
                Name: "Crâne fracassé",
                Desc: "Subit 50 dégâts, -1 AA, -1 AD.",
                Dmg: -50,
                Effect: {
                    CombatStats: { AA: -1, AD: -1 }
                }
            },
            {
                Name: "Sonné",
                Desc: "-1 AA, -1 AD, -10 SA, -10 SD, -5 DMG pendant 2 tours.",
                Effect: {
                    CombatStats: { SA: -10, AA: -1, DMG: -5, SD: -10, AD: -1 }
                }
            },
            {
                Name: "Renversé", // VOIR AVEC HUGO
                Desc: "Projeté au sol, -20 SA. Pour se relever, -1 AA et -1 AD.",
                Effect: {
                    CombatStats: { SA: -20 }
                }
            },
            {
                Name: "Martelé",
                Desc: "Subit -10 Red. Pendant 1 tour, -10 SD.",
                Effect: {
                    CombatStats: { SD: -10, ReD: -10 }
                }
            },
            {
                Name: "Estomac broyé",
                Desc: "Manger devient très difficile. -25% regen de vie et mana pendant 2 jours."
            }
        ]
    },
    {
        Type : "Perçant",
        Debuffs : [
            {
                Name: "Poumon perforé",
                Desc: "Ne peut plus courir."
            },
            {
                Name: "Estomac transpercé",
                Desc: "Subit 50 dégâts, -10 SA, -10 SD.",
                Dmg: -50,
                Effect: {
                    CombatStats: { SA: -1, SD: -1 }
                }
            },
            {
                Name: "Empalé", // VOIR AVEC HUGO
                Desc: "Tant qu'elle est empalée, la cible ne peut pas bouger et subit -2 AD. Peut consommer 2 AA et 2 AD pour se retirer. La cible subit 200 dégâts. Priorité au défenseur.",
                Effect: {
                    CombatStats: { AD: -2 }
                }
            },
            {
                Name: "Epaule perforée", // VOIR AVEC HUGO
                Desc: "Subit 30 dégâts et lâche son arme en fonction du bras. Pour ramasser l'arme : -2 AD et -10 SD.",
                Dmg: -30
            },
            {
                Name: "Jambe percée", // RANG ?
                Desc: "-1 Rang SPD, AGI. Ne peut plus fuir.",
                Effect: {
                    CharCaracteristics: { AGI: -1, SPD: -1 },                
                }
            },
            {
                Name: "Crâne touché",
                Desc: "Pendant 1 jour, consommation en mana augmentée de moitié."
            }
        ]
    },
    {
        Type : "Tranchant",
        Debuffs : [
            {
                Name: "Oeil balafré",
                Desc: "Vision réduite à 5m."
            },
            {
                Name: "Nerf sectionné",
                Desc: "Subit 75 dégâts, -10 DMG, -5 PA.",
                Dmg: -75,
                Effect: {
                    CombatStats: { DMG: -10, PA: -5 }
                }
            },
            {
                Name: "Artère tranchée", // VOIR AVEC HUGO -> par tour ?
                Desc: "Subit 30 dégâts par tour pendant 10 tours.",
                Effect: {
                    Dot: 30
                }
            },
            {
                Name: "Lèvre tranchée",
                Desc: "Subit 40 dégâts et ne peut plus parler pendant 2 tours. Ne peut pas utiliser de NP.",
                Dmg: -40
            },
            {
                Name: "Doigt coupé", // RANG ?
                Desc: "-1 Rang STR, -15 SA.",
                Effect: {
                    CharCaracteristics: { STR: -1 },
                    CombatStats: { SA: -15 }
                }
            },
            {
                Name: "Taillé profondément",  // Rajouter stats soins reçu ?
                Desc: "Réduit les soins reçus de moitié pendant 2 jours."
            }
        ]
    }
]