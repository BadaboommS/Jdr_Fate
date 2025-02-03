import { createContext, useState, ReactNode } from 'react';
import { CharStatsInterface } from '../types/stats';

interface FileContextInterface {
    data: CharStatsInterface[];
    setData: (newData: CharStatsInterface[]) => void;
    addData: (newData: CharStatsInterface) => void;
}

const FileContext = createContext<FileContextInterface | undefined>(undefined);

export default function FileContextProvider ({ children }: { children: ReactNode }) {
    const [data, setData] = useState<CharStatsInterface[]>([]);

    function addData (newData: CharStatsInterface) {
        setData([...data, newData]);
    }

    return (
        <FileContext.Provider value={{ data, setData, addData }}>
            { children }
        </FileContext.Provider>
    );
};