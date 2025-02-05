import { createContext } from "react";
import { CharStatsInterface } from '../types/statsType';
import { FilterSettingsInterface, SettingsInterface, DEFAULT_SETTINGS } from '../types/settingsType';

interface CharDataContextInterface {
    charData: CharStatsInterface[];
    setCharData: (newData: CharStatsInterface[]) => void;
    settingsData: SettingsInterface;
    setSettingsData: (newSettings: SettingsInterface) => void;
    filterData: FilterSettingsInterface[];
    setFilterData: (newFilterArray: FilterSettingsInterface[]) => void;
}

const DEFAULT_CONTEXT_VALUE: CharDataContextInterface = {
    charData: [],
    setCharData: () => {},
    settingsData: DEFAULT_SETTINGS,
    setSettingsData: () => {},
    filterData: [],
    setFilterData: () => {}
};

export const CharDataContext = createContext<CharDataContextInterface>(DEFAULT_CONTEXT_VALUE);