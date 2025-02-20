import { useContext, useState } from "react";
import { Modal } from "../../../../global/Modal";
import { CharStatsInterface } from "../../../../types/statsType";
import { DataContext } from "../../../../context/DataContext";

interface CharItemPropsInterface {
    toEditCharData: CharStatsInterface;
    handleHistoryEventAdd?: (msg: string, type: string, title?: string) => void,
}

export function FightStatsEdit ({ toEditCharData, handleHistoryEventAdd }: CharItemPropsInterface) {
    const { charData, setCharData } = useContext(DataContext);
    const [showModal, setShowModal] = useState(false);

    function handleChangeValues(){
        const HpModif = Number((document.getElementById('input_hp') as HTMLInputElement).value);
        const ManaModif = Number((document.getElementById('input_mana') as HTMLInputElement).value);
        const ANModif = Number((document.getElementById('input_an') as HTMLInputElement).value);
        const newData = { 
            ...toEditCharData,
            Hp: toEditCharData.Hp + HpModif,
            Mana: toEditCharData.Mana + ManaModif,
            CombatStats: {
                ...toEditCharData.CombatStats,
                AN: toEditCharData.CombatStats.AN + ANModif,
            }
        }
        if(handleHistoryEventAdd) handleHistoryEventAdd(`${toEditCharData.Name} a reçu: ${HpModif !== 0? `${HpModif} Hp ` : ''} ${ManaModif !== 0? `${ManaModif} Mana ` : ''} ${ANModif !== 0? `${ANModif} AN` : ''}`, 'Info');
        setCharData(charData.map((char) => char.Id === newData.Id? newData : char));
    }

    function handleModalClose(){
        (document.getElementById('input_hp') as HTMLInputElement).value = '';
        (document.getElementById('input_mana') as HTMLInputElement).value = '';
        (document.getElementById('input_an') as HTMLInputElement).value = '';
        setShowModal(false);
    }

    return (
        <>
            <button onClick={() => setShowModal(true)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Action</button>
            {
                (showModal)
                ?   <Modal isOpen={showModal} onClose={() => handleModalClose()}>
                        <div className="flex flex-col gap-2">
                            <h2>Appliquer un effet direct sur une stat.</h2>
                            <div className="input_group">
                                <div className="input_entry">
                                    <label htmlFor="input_hp" className="input_label">Hp:</label>
                                    <input id="input_hp" type="number" className="input_field" defaultValue={0} required />
                                </div>
                                <div className="input_entry">
                                    <label htmlFor="input_mana" className="input_label">Mana:</label>
                                    <input id="input_mana" type="number" className="input_field" defaultValue={0} required/>
                                </div>
                                <div className="input_entry">
                                    <label htmlFor="input_an" className="input_label">AN:</label>
                                    <input id="input_an" type="number" className="input_field" defaultValue={0} required/>
                                </div>
                            </div>
                            <div className='flex justify-end items-center'>
                            <button type="button" onClick={() => handleChangeValues()} className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer'>Valider</button>
                                <button type="button" onClick={() => handleModalClose()} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Cancel</button>
                            </div>
                        </div>
                    </Modal>
                :   <></>
            }
        </>
    );
};