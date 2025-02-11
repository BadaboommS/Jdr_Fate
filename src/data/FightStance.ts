import { EffectInterface } from "../types/statsType";

interface FightStanceInterface {
    Name: string;
    Desc: string;
    Type: "Offensif" | "Defensif" | "Neutre";
    Effect: EffectInterface,
}

export const StanceBaseEffectArray = {
    "Offensif": { SA: 10, AA: 1, AD: -1 },
    "Defensif": { SD: 10, AD: 1, AA: -1 },
    "Neutre": { SA: 10, SD: 10 }
}

export const FightStanceArray: FightStanceInterface[] = [
    {
        Name: "Position du Serpent",
        Desc: `Position de combat Offensive: +10 SA, +1 AA, -1 AD.
--------------------------
Le premier coup qui touche fait saigner l'adversaire, inflige 50 dmg par tour pendant 4 tours.`,
        Type: "Offensif",
        Effect: {}
    },
    {
        Name: "Position du Rhinocéros",
        Desc: `Position de combat Offensive: +10 SA, +1 AA, -1 AD.
--------------------------
Les 3 premiers coups (dans cet ordre et non stackable) ont 50% de chance de :  
    1. Baisser de 1 l'AGI et la SPD pendant 3 tours (considéré comme un effet de CC)
    2. Baisser de 2 la STA pendant 3 tours (considéré comme un effet de CC)
    3. Baisser de 2 la STR pendant 3 tours (considéré comme un effet de CC)`,
        Type: "Offensif",
        Effect: {}
    },
    {
        Name: "Position du Dragon",
        Desc: `Position de combat Offensive: +10 SA, +1 AA, -1 AD.
--------------------------
Pour ce tour ci, -15 SD, -1 AD. Au prochain tour +30 SA, +2 AA, +20 DMG. La position dure 2 tours. (1 fois tous les 5 tours max).`,
        Type: "Offensif",
        Effect: {}
    },
    {
        Name: "Position de la Panthère",
        Desc: `Position de combat Offensive: +10 SD, +1 AD, -1 AA.
--------------------------
+1 AA, +10 SA, -1 AD.`,
        Type: "Offensif",
        Effect: {
            CombatStats: { AA: 1, SA: 10, AD: -1 }
        }
    },
    {
        Name: "Position du Rocher",
        Desc: `Position de combat Defensive: +10 SD, +1 AD, -1 AA.
--------------------------
+15 Red.`,
        Type: "Defensif",
        Effect: { CombatStats: { ReD: 15 }}
    },
    {
        Name: "Position du Lézard",
        Desc: `Position de combat Defensive: +10 SD, +1 AD, -1 AA.
--------------------------
Le malus maximum de défenses excédentaires passe à -45.`,
        Type: "Defensif",
        Effect: {}
    },
    {
        Name: "Position de la Pieuvre",
        Desc: `Position de combat Defensive: +10 SD, +1 AD, -1 AA.
--------------------------
Ignore les CC ce tour ci, et annule un effet de CC subi précédemment (1 fois tous les 2 tours au max).`,
        Type: "Defensif",
        Effect: {}
    },
    {
        Name: "Position du Gorille",
        Desc: `Position de combat Defensive: +10 SD, +1 AD, -1 AA.
--------------------------
Gagne un bonus de +3 SPD pour protéger quelqu’un. Si réussi, il gagne un bonus de +15 SD.`,
        Type: "Defensif",
        Effect: {}
    },
    {
        Name: "Position du Roseau",
        Desc: `Position de combat Neutre: +10 SA, +10 SD.
--------------------------
Pour chaque 2 défenses réussies ce tour ci, l’adversaire a -1 AA au prochain tour.`,
        Type: "Neutre",
        Effect: {}
    },
    {
        Name: "Position du Golem",
        Desc: `Position de combat Neutre: +10 SA, +10 SD.
--------------------------
Gagne 40 PA, mais perd l’utilisation de ½ (arrondie à l’inférieur) de ses AA.`,
        Type: "Neutre",
        Effect: {
            CombatStats: { PA: 40 }
        }
    },
    {
        Name: "Position du Flamant Rose",
        Desc: `Position de combat Neutre: +10 SA, +10 SD.*
--------------------------
Pour tous les jets d’attaque et de défense, on considère que le jet fait 50.
Aucune attaque ne provoque de coup critique naturel. (1 fois tous les 5 tours max).`,
        Type: "Neutre",
        Effect: {}
    },
    {
        Name: "Position de la Marmotte",
        Desc: `Position de combat Neutre: +10 SA, +10 SD.
--------------------------
Pour les 3 prochains tours, se battre ne consomme pas de mana. Si le personnage est à cours de mana, à la place, il lui est possible de se battre normalement pendant 1 tour (1 fois tous les 5 tours max).`,
        Type: "Neutre",
        Effect: {}
    },
]