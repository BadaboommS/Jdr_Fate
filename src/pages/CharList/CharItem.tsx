import { useContext, useState } from "react";
import { Modal } from "../../global/Modal";
import { EditChar } from './EditChar';
import { CharInfo } from "./CharInfo";
import { CharStatsInterface } from "../../types/statsType";
import { CharDataContext } from "../../context/CharDataContext";
import './charItem.css';

interface CharItemPropsInterface {
    charStats: CharStatsInterface;
}

export function CharItem ({ charStats }: CharItemPropsInterface) {
    const { charData, setCharData } = useContext(CharDataContext);
    const [showModal, setShowModal] = useState(false);
    const [editChar, setEditChar] = useState(false);

    function handleSetEdit(): void {
        setEditChar(!editChar);
    }

    function handleCloseModal(): void {
        setEditChar(false);
        setShowModal(false);
    }

    function handleDeleteChar(charId: number): void {
        if(!window.confirm('Delete le personnage ?')){
            return;
        }

        setCharData(charData.filter((char: CharStatsInterface) => char.Id !== charId));
        handleCloseModal();
    }

    return (
        <>
            <div onClick={() => setShowModal(true)} className={`item_${charStats.Type} border border-black p-2 bg-[#DFDDCF] text-black rounded cursor-pointer bg`}>
                <h2>{charStats.Name} ({charStats.Type})</h2>
            </div>
            {
                (showModal)
                ?   <Modal isOpen={showModal} onClose={() => handleCloseModal()}>
                        {
                            (editChar)
                            ? <EditChar charStats={charStats} handleSetEdit={handleSetEdit} handleCloseModal={handleCloseModal} handleDeleteChar={handleDeleteChar}/>
                            : <CharInfo charStats={charStats} handleSetEdit={handleSetEdit} handleCloseModal={handleCloseModal} />
                        }
                    </Modal>
                : <></>
            }
        </>
    );
};