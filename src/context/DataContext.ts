import { createContext } from "react";
import { CharStatsInterface } from '../types/statsType';
import { FilterSettingsInterface } from '../types/filterType';
import { FightListInterface } from "../types/fightType";

interface DataContextInterface {
    charData: CharStatsInterface[];
    setCharData: (newData: CharStatsInterface[]) => void;
    filterData: FilterSettingsInterface[];
    setFilterData: (newFilterArray: FilterSettingsInterface[]) => void;
    fightData: FightListInterface[];
    setFightData: (newFightData: FightListInterface[]) => void;
    playerData: string[];
    setPlayerData: (newPlayerData: string[]) => void;
}

const DEFAULT_CONTEXT_VALUE: DataContextInterface = {
    charData: [],
    setCharData: () => {},
    filterData: [],
    setFilterData: () => [],
    fightData: [],
    setFightData: () => [],
    playerData: [],
    setPlayerData: () => [],
};

export const DataContext = createContext<DataContextInterface>(DEFAULT_CONTEXT_VALUE);