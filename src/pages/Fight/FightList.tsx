import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { AddFightControl } from "./AddFightControl";
import { FightListInterface } from "../../types/fightType";
import { FightItem } from "./FightItem";

export function FightList() {
    const { fightData, setFightData } = useContext(DataContext);

    function handleDeleteFight (fightId: number) {
        if(!window.confirm('Supprimer le Fight ?')){ return };
        setFightData(fightData.filter(fight => fight.fightId !== fightId));
    }

    return (
        <div>
            <AddFightControl />
            <div className="p-5 w-full h-full flex gap-2 flex-wrap">
                {
                    (fightData[0])
                    ?   fightData.map((fight: FightListInterface, index: number) => {
                            return <FightItem key={index} fightData={fight} handleDeleteFight={handleDeleteFight} />
                        })
                    : <p>No Fight Data available.</p>
                }
            </div>
        </div>
    );
}