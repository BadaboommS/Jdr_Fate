import { createContext } from "react";
import { CharStatsInterface } from '../types/statsType';
import { FilterSettingsInterface } from '../types/filterType';
import { FightListInterface } from "../types/fightType";

export interface DataContextInterface {
    charData: CharStatsInterface[];
    setCharData: (data: CharStatsInterface[]) => void;
    filterData: FilterSettingsInterface[];
    setFilterData: (data: FilterSettingsInterface[]) => void;
    fightData: FightListInterface[];
    setFightData: (data: FightListInterface[]) => void;
    playerData: string[];
    setPlayerData: (data: string[]) => void;
}

export const DataContext = createContext<DataContextInterface>({
    charData: [],
    setCharData: () => {},
    filterData: [],
    setFilterData: () => {},
    fightData: [],
    setFightData: () => {},
    playerData: [],
    setPlayerData: () => {},
});

DataContext.displayName = "DataContext";