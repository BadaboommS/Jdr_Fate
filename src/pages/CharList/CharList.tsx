import { useContext } from "react";
import { CharDataContext } from "../../context/CharDataContextProvider";
import { CharItem } from "./CharItem";

export function CharList() {
    const { charData } = useContext(CharDataContext);

    return (
        <>
        <div className="w-full flex flex-col py-2">
            <h1 className="text-2xl text-center">Liste de characters :</h1>
            <div className="p-5 w-full h-full flex gap-2 flex-wrap">
                {
                    (charData.length > 0)
                    ? charData.map((char, i) => {
                        return <CharItem charStats={char} key={i} />
                    })
                    : <p>No character Data yet.</p>
                }
            </div>
        </div>
        </>
    );
}