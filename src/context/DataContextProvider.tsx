import  { useState, useEffect, ReactNode } from 'react';
import { CharStatsInterface } from '../types/statsType';
import { FilterSettingsInterface } from '../types/filterType';
import { FightListInterface } from '../types/fightType';
import { DataContext } from './DataContext';

const loadFromCache = <T,>(key: string, fallback: T): T => {
    try {
        const cached = localStorage.getItem(key);
        return cached ? JSON.parse(cached) : fallback;
    } catch (e) {
        console.warn(`Erreur chargement ${key} depuis le cache`, e);
        return fallback;
    }
};

const saveToCache = <T,>(key: string, data: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn(`Erreur sauvegarde ${key} dans le cache`, e);
    }
};

export function DataContextProvider({ children }: { children: ReactNode }) {
    const [charData, setCharDataState] = useState<CharStatsInterface[]>(
        () => loadFromCache<CharStatsInterface[]>('charData', [])
    );
    const [filterData, setFilterDataState] = useState<FilterSettingsInterface[]>(
        () => loadFromCache<FilterSettingsInterface[]>('filterData', [])
    );
    const [fightData, setFightDataState] = useState<FightListInterface[]>(
        () => loadFromCache<FightListInterface[]>('fightData', [])
    );
    const [playerData, setPlayerDataState] = useState<string[]>(
        () => loadFromCache<string[]>('playerData', [])
    );

    useEffect(() => saveToCache('charData', charData), [charData]);
    useEffect(() => saveToCache('filterData', filterData), [filterData]);
    useEffect(() => saveToCache('fightData', fightData), [fightData]);
    useEffect(() => saveToCache('playerData', playerData), [playerData]);

    return (
        <DataContext.Provider value={{
            charData,
            setCharData: setCharDataState,
            filterData,
            setFilterData: setFilterDataState,
            fightData,
            setFightData: setFightDataState,
            playerData,
            setPlayerData: setPlayerDataState
        }}>
            {children}
        </DataContext.Provider>
    );
}