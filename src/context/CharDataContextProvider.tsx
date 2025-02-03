import React, { useState, createContext } from 'react';
import { CharStatsInterface } from '../types/stats';

interface CharDataContextInterface {
    charData: CharStatsInterface[];
    setCharData: (newData: CharStatsInterface[]) => void;
}

const DEFAULT_CONTEXT_VALUE: CharDataContextInterface = {
    charData: [],
    setCharData: () => {}
};

export const CharDataContext = createContext<CharDataContextInterface>(DEFAULT_CONTEXT_VALUE);

export function CharDataContextProvider ({ children }: { children: React.JSX.Element }) {
    const [charData, setCharData] = useState<CharStatsInterface[]>([]);

    return (
        <CharDataContext.Provider value={{ charData, setCharData }}>
            { children }
        </CharDataContext.Provider>
    );
};