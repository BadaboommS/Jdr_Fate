import { useState } from "react";
import { Modal } from "../../global/Modal";
import { EditChar } from './EditChar';
import { CharInfo } from "./CharInfo";
import { CharStatsInterface } from "../../types/stats";

interface CharItemPropsInterface {
    charStats: CharStatsInterface;
}

export function CharItem ({ charStats }: CharItemPropsInterface) {
    const [showModal, setShowModal] = useState(false);
    const [editChar, setEditChar] = useState(false);

    function handleCloseModal() {
        setEditChar(false);
        setShowModal(false);
    }

    function handleSetEdit() {
        setEditChar(!editChar);
    }

    return (
        <>
            <div onClick={() => setShowModal(true)} className="flex justify-between gap-2 border border-black rounded">
                <h2>{charStats.Name}</h2>
                <p>Type: {charStats.Type}</p>
                {charStats.Variant && <p>Variant: {charStats.Variant}</p>}
            </div>
            {
                (showModal)
                ?   <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                        {
                            (editChar)
                            ? <EditChar charStats={charStats} handleSetEdit={handleSetEdit} handleCloseModal={handleCloseModal} />
                            : <CharInfo charStats={charStats} handleSetEdit={handleSetEdit} handleCloseModal={handleCloseModal} />
                        }
                    </Modal>
                : <></>
            }
        </>
    );
};