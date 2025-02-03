import { useContext } from "react";
import { CharDataContext } from "../../context/CharDataContextProvider";
import { CharItem } from "./CharItem";

export function CharList() {
    const { charData } = useContext(CharDataContext);

    return (
        <div>
            <h1>Char List</h1>
            {
                (charData.length > 0)
                ? charData.map((char, i) => {
                    return <CharItem charStats={char} key={i} />
                })
                : <p>No character Data yet.</p>
            }
        </div>
    );
}