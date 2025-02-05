import React, { useState } from 'react';
import { CharStatsInterface } from '../types/statsType';
import { FilterSettingsInterface } from '../types/filterType';
import { FightListInterface } from '../types/fightType';
import { DataContext } from './DataContext';

export function DataContextProvider ({ children }: { children: React.JSX.Element }) {
    const [charData, setCharData] = useState<CharStatsInterface[]>([]);
    const [filterData, setFilterData] = useState<FilterSettingsInterface[]>([]);
    const [fightData, setFightData] = useState<FightListInterface[]>([]);
    const [playerData, setPlayerData] = useState<string[]>([]);

    return (
        <DataContext.Provider value={{ 
            charData, setCharData,
            filterData, setFilterData,
            fightData, setFightData,
            playerData, setPlayerData
        }}>
            { children }
        </DataContext.Provider>
    );
};