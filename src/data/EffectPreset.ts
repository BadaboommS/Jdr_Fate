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
]