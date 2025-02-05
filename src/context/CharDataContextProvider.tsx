import React, { useState, useEffect } from 'react';
import { CharStatsInterface } from '../types/statsType';
import { FilterSettingsInterface, SettingsInterface, DEFAULT_SETTINGS } from '../types/settingsType';
import { CharDataContext } from './CharDataContext';

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