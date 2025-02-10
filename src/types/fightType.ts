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