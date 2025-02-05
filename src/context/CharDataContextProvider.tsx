import React, { useState, createContext, useEffect } from 'react';
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

export function CharDataContextProvider ({ children }: { children: React.JSX.Element }) {
    const [charData, setCharData] = useState<CharStatsInterface[]>([]);
    const [settingsData, setSettingsData] = useState<SettingsInterface>(DEFAULT_SETTINGS);
    const [filterData, setFilterData] = useState<FilterSettingsInterface[]>([]);

    useEffect(() => {
        if (Array.isArray(settingsData.filter)) {
            setFilterData(settingsData.filter);
        } else {
            setFilterData([]);
        }
    }, [settingsData])

    return (
        <CharDataContext.Provider value={{ charData, setCharData, settingsData, setSettingsData, filterData, setFilterData }}>
            { children }
        </CharDataContext.Provider>
    );
};