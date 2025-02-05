export function rollDice(sides: number): number {
    if (sides <= 0) {
        throw new Error("Number of sides must be greater than zero.");
    }
    return Math.floor(Math.random() * sides) + 1;
}