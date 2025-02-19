import { useState } from "react";
import { Modal } from "../../../../global/Modal";
import { EditChar } from "../../../CharList/EditChar";
import { CharStatsInterface } from "../../../../types/statsType";

interface CharItemPropsInterface {
    toEditCharData: CharStatsInterface;
}

export function FightEditCharModal ({ toEditCharData }: CharItemPropsInterface) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div onClick={() => setShowModal(true)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">
                <h2>Edit</h2>
            </div>
            {
                (showModal)
                ?   <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                        <EditChar charStats={toEditCharData} handleCloseModal={() => setShowModal(false)} />
                    </Modal>
                :   <></>
            }
        </>
    );
};