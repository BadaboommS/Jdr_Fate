export interface FightListInterface {
    fightId: number;
    fightName : string;
    fightMembers : string[];
    fightState: boolean;
    fightHistory: fightHistoryType[];
}

export type fightHistoryType = {
    historyMsg: string;
    msgType: string;
    msgTitle: string;
}

export const CCDebuffList = [
    {
        "Type" : "Contondant",
        "Debuffs": [
            {
                "Name": "Trachée écrasée",
                "Desc": "Ne peut plus parler pendant 5 tours. Ne peut pas utiliser de NP.",
                "Effect": '{}',
            },
            {
                "Name": "Crâne fracassé",
                "Desc": "Subit 50 dégâts, -1 AA, -1 AD.",
                "Effect": '{ "Hp": -50, "AA": -1, "AD": -1 }',
            },
            {
                "Name": "Sonné",
                "Desc": "-1 AA, -1 AD, -10 SA, -10 SD, -5 DMG pendant 2 tours.",
                "Effect": '{ "AA": -1, "AD": -1, "SA": -10, "SD": -10, "DMG": -5 }',
            },
            {
                "Name": "Renversé",
                "Desc": "Projeté au sol, -20 SA. Pour se relever, -1 AA et -1 AD.",
                "Effect": '{ "SA": -20, "AA": -1, "AD": -1 }', // VOIR AVEC HUGO
            },
            {
                "Name": "Martelé",
                "Desc": "Subit -10 Red. Pendant 1 tour , -10 SD.",
                "Effect": '{ "ReD": -10, "SD": -10 }',
            },
            {
                "Name": "Estomac broyé",
                "Desc": "Manger devient très difficile. -25% regen de vie et mana pendant 2 jours.",
                "Effect": '{}', // Rajouter stats regen mana et hp ?
            }
        ]
    },
    {
        "Type" : "Perçant",
        "Debuffs": [
            {
                "Name": "Poumon perforé",
                "Desc": "Ne peut plus courir.",
                "Effect": '{}',
            },
            {
                "Name": "Estomac transpercé",
                "Desc": "Subit 50 dégâts, -10 SA, -10 SD.",
                "Effect": '{"Hp": -50, "SA": -1, "SD": -1}',
            },
            {
                "Name": "Empalé",
                "Desc": "Tant qu'elle est empalée, la cible ne peut pas bouger et subit -2 AD. Peut consommer 2 AA et 2 AD pour se retirer. La cible subit 200 dégâts. Priorité au défenseur.",
                "Effect": '{ "AD": -2 }', // VOIR AVEC HUGO
            },
            {
                "Name": "Epaule perforée",
                "Desc": "Subit 30 dégâts et lâche son arme en fonction du bras. Pour ramasser l'arme : -2 AD et -10 SD.",
                "Effect": '{ "Hp": -30 }', // VOIR AVEC HUGO
            },
            {
                "Name": "Jambe percée",
                "Desc": "-1 Rang SPD, AGI. Ne peut plus fuir.",
                "Effect": '{ "SPD": -1, "AGI": -1 }', // RANG ?
            },
            {
                "Name": "Crâne touché",
                "Desc": "Pendant 1 jour, consommation en mana augmentée de moitié.",
                "Effect": '{}', // Rajouter stats conso mana ?
            }
        ]
    },
    {
        "Type" : "Tranchant",
        "Debuffs": [
            {
                "Name": "Oeil balafré",
                "Desc": "Vision réduite à 5m.",
                "Effect": '{}',
            },
            {
                "Name": "Nerf sectionné",
                "Desc": "Subit 75 dégâts, -10 DMG, -5 PA.",
                "Effect": '{ "Hp": -75, "DMG": -10, "PA": -5 }',
            },
            {
                "Name": "Artère tranchée",
                "Desc": "Subit 30 dégâts par tour pendant 10 tours.",
                "Effect": '{}', // VOIR AVEC HUGO
            },
            {
                "Name": "Lèvre tranchée",
                "Desc": "Subit 40 dégâts et ne peut plus parler pendant 2 tours. Ne peut pas utiliser de NP.",
                "Effect": '{ "Hp": -40 }',
            },
            {
                "Name": "Doigt coupé",
                "Desc": "-1 Rang STR, -15 SA.",
                "Effect": '{ "STR": -1, "SA": -15 }', // RANG ?
            },
            {
                "Name": "Taillé profondément",
                "Desc": "Réduit les soins reçus de moitié pendant 2 jours.",
                "Effect": '{}', // Rajouter stats soins reçu ?
            }
        ]
    }
]