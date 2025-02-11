interface FightStanceInterface {
    Name: string;
    Desc: string;
    Type: "Offensif" | "Défensif" | "Neutre";
}

export const StanceBaseEffectArray = {
    "Offensif": {SA: 10, AA: 1, AD: -1},
    "Défensif": {SD: 10, AD: 1, AA: -1},
    "Neutre": {SA: 10, SD: 10}
}

export const FightStanceArray: FightStanceInterface[] = [
    {
        Name: "Position du Serpent",
        Desc: `Le premier coup qui touche fait saigner l'adversaire, inflige 50 dmg par tour pendant 4 tours.`,
        Type: "Offensif",
    },
    {
        Name: "Position du Rhinocéros",
        Desc: `Les 3 premiers coups (dans cet ordre et non stackable) ont 50% de chance de :  
    1. Baisser de 1 l'AGI et la SPD pendant 3 tours (considéré comme un effet de CC)
    2. Baisser de 2 la STA pendant 3 tours (considéré comme un effet de CC)
    3. Baisser de 2 la STR pendant 3 tours (considéré comme un effet de CC)`,
        Type: "Offensif",
    },
    {
        Name: "Position du Dragon",
        Desc: `Pour ce tour ci, -15 SD, -1 AD. Au prochain tour +30 SA, +2 AA, +20 DMG. La position dure 2 tours. (1 fois tous les 5 tours max).`,
        Type: "Offensif",
    },
    {
        Name: "Position de la Panthère",
        Desc: `+1 AA, +10 SA, -1 AD.`,
        Type: "Offensif",
    },
    {
        Name: "Position du Rocher",
        Desc: `+15 Red.`,
        Type: "Défensif",
    },
    {
        Name: "Position du Lézard",
        Desc: `Le malus maximum de défenses excédentaires passe à -45.`,
        Type: "Défensif",
    },
    {
        Name: "Position de la Pieuvre",
        Desc: `Ignore les CC ce tour ci, et annule un effet de CC subi précédemment (1 fois tous les 2 tours au max).`,
        Type: "Défensif",
    },
    {
        Name: "Position du Gorille",
        Desc: `Gagne un bonus de +3 SPD pour protéger quelqu’un. Si réussi, il gagne un bonus de +15 SD.`,
        Type: "Défensif",
    },
    {
        Name: "Position du Roseau",
        Desc: `Pour chaque 2 défenses réussies ce tour ci, l’adversaire a -1 AA au prochain tour.`,
        Type: "Neutre",
    },
    {
        Name: "Position du Golem",
        Desc: `Gagne 40 PA, mais perd l’utilisation de ½ (arrondie à l’inférieur) de ses AA.`,
        Type: "Neutre",
    },
    {
        Name: "Position du Flamant Rose",
        Desc: `Pour tous les jets d’attaque et de défense, on considère que le jet fait 50. Aucune attaque ne provoque de coup critique naturel. (1 fois tous les 5 tours max).`,
        Type: "Neutre",
    },
    {
        Name: "Position de la Marmotte",
        Desc: `Pour les 3 prochains tours, se battre ne consomme pas de mana. Si le personnage est à cours de mana, à la place, il lui est possible de se battre normalement pendant 1 tour (1 fois tous les 5 tours max).`,
        Type: "Neutre",
    },
]