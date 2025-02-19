import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { CharItem } from "./CharItem";
import { SearchBar } from "./CharListFilter/SearchBar";
import { CharStatsInterface } from "../../types/statsType";

export function CharList() {
    const { charData } = useContext(DataContext);
    const [sortQuery, setSortQuery] = useState('');

    const [ sortedPasswordList, setSortedPasswordList ] = useState<CharStatsInterface[]>([]);

    useEffect(() => {
        if (sortQuery !== '') {
            const query = sortQuery.toLowerCase();
            const newCharArray = charData.filter((char) => 
                char.Joueur.toLowerCase().includes(query) ||
                char.Name.toLowerCase().includes(query) ||
                char.Type.toString().toLowerCase().includes(query)
            );
            setSortedPasswordList(newCharArray);
        } else {
            setSortedPasswordList(charData);
        }
    },[sortQuery, charData]);

    return (
        <>
        <div className="flex">
            <SearchBar onSearch={setSortQuery}/>
            <div className="w-full h-full flex flex-col py-2">
                <h1 className="text-2xl text-center">Liste de characters :</h1>
                <div className="p-5 w-full h-full flex gap-2 flex-wrap">
                    {
                        (sortedPasswordList.length > 0)
                        ? sortedPasswordList.map((char) => {
                            return <CharItem charStats={char} key={`${char.Name}_${char.Joueur}`} />
                        })
                        : <p>No character Data found.</p>
                    }
                </div>
            </div>
        </div>
        </>
    );
}