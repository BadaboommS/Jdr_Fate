import { CharStatsInterface } from "../types/statsType";

export function rollDice(sides: number): number {
    if (sides <= 0) {
        throw new Error("Number of sides must be greater than zero.");
    }
    return Math.floor(Math.random() * (sides - 1)) + 1;
}

export function updateCharData(charData: CharStatsInterface[], ...actors: CharStatsInterface[]): CharStatsInterface[]{
    if(!actors || !charData){ return charData; };
    return charData.map((char) => {
        for(const actor of actors){ if(char.Id === actor.Id) return actor; };
        return char;
    })
}