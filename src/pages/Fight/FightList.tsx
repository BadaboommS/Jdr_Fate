import { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { AddFightControl } from "./AddFightControl";
import { FightListInterface } from "../../types/fightType";
import { FightItem } from "./FightItem";
import { Modal } from "../../global/Modal";
import { FightScreen } from "./FightScreen";

export function FightList() {
    const { fightData, setFightData } = useContext(DataContext);
    const [activeFightData, setActiveFightData]= useState<FightListInterface | null>(null);
    const [showFightModal, setShowFightModal] = useState(false);

    function handleDeleteFight (fightId: number): void {
        if(!window.confirm('Supprimer le Fight ?')){ return };
        setFightData(fightData.filter(fight => fight.fightId !== fightId));
    }

    function handleModalClose(): void {
        setActiveFightData(null);
        setShowFightModal(false);
        setFightData(fightData.map(fight => fight.fightId === activeFightData?.fightId ? activeFightData : fight));
    }

    function setActiveFight(activeFightData: FightListInterface): void{
        saveFightData(activeFightData);
        setShowFightModal(true);
    }

    function saveFightData(data?: FightListInterface): void {
        setActiveFightData(data? data : activeFightData);
    }

    return (
        <div>
            <AddFightControl />
            <div className="p-5 w-full h-full flex gap-2 flex-wrap">
                {
                    (fightData[0])
                    ?   fightData.map((fight: FightListInterface, index: number) => {
                            return <FightItem key={index} fightData={fight} setActiveFight={setActiveFight} handleDeleteFight={handleDeleteFight} />
                        })
                    : <p>No Fight Data available.</p>
                }
            </div>
            {
                (showFightModal && activeFightData)
                    ?   <Modal isOpen={showFightModal} onClose={() => handleModalClose()}>
                            <FightScreen activeFightData={activeFightData} handleModalClose={handleModalClose} saveFightData={saveFightData}/>
                        </Modal>
                    : <></>
            }
        </div>
    );
}