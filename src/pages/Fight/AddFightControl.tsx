import { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { BsBookmarkPlusFill } from "react-icons/bs";
import { DataContext } from "../../context/DataContext";
import { Modal } from "../../global/Modal";

type FightFormInput = {
    fightName : string;
    fightMembers : string[];
}

export function AddFightControl() {
    const [showAddModal, setShowAddModal] = useState(false);
    const { fightData, setFightData, charData } = useContext(DataContext);

    const { register, handleSubmit, reset} = useForm<FightFormInput>({ 
        defaultValues: {
            fightName: '',
            fightMembers: [],
        }
    });

    const onSubmit: SubmitHandler<FightFormInput> = (data) => {
        if(!window.confirm('Ajouter le Fight ?')){ return };
        const { fightName, fightMembers } = data;
        const newFight = {
            fightId : fightData[0] ? fightData[fightData.length - 1].fightId + 1: 0,
            fightName: fightName,
            fightMembers : fightMembers,
            fightHistory : [
                { historyMsg: `--------------------`, msgType: 'Text', msgTitle: ''},
                { historyMsg: `Membre présents: ${data.fightMembers.join(', ')}`, msgType: 'Info', msgTitle: ''},
                { historyMsg: `Fight ${data.fightName} crée ${new Date().toLocaleString()} .`, msgType: "Info", msgTitle: ''},
                { historyMsg: `--------------------`, msgType: 'Text', msgTitle: ''}
            ],
            fightState : true,
            activeActorA: null,
            activeActorB: null,
        }
        setFightData([...fightData, newFight]);
        handleModalClose();
    }

    function handleModalClose() {
        reset();
        setShowAddModal(false);
    }

    return (
        <div style={{margin:'2em', marginTop: '3em'}}>
            <button onClick={() => setShowAddModal(true)} title="Add Fight" className='hover:text-white cursor-pointer transition-all' style={{color: '#f2e7e3', display: 'flex', backgroundColor: '#fd4a4a', padding: '0.8em', borderRadius: '0.8em'}}><BsBookmarkPlusFill size={32}/><p style={{margin: 'auto', marginLeft: '0.8em'}}>Créer un combat</p></button>
            {
                (showAddModal)
                ?   <Modal isOpen={showAddModal} onClose={() => handleModalClose()}>
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                            <h2 className='text-center font-bold'>Nouveau Fight :</h2>
                            <div className='flex flex-row gap-1'>
                                <label htmlFor="input_fight_name">Name:</label>
                                <input {...register("fightName", {required: "This Field is required."})} id="input_fight_name" placeholder='Name' className='indent-2' />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <p>Participants :</p>
                                <div className="flex flex-row gap-2 flex-wrap">
                                    {charData.map((character) => (
                                        <div key={`${character.Joueur}_${character.Name}`} className="flex gap-2 border border-black rounded p-1">
                                            <label htmlFor={`${character.Joueur}_${character.Name}`}>{character.Name}</label>
                                            <input 
                                                type="checkbox"
                                                value={character.Name}
                                                {...register("fightMembers")} 
                                                id={`${character.Joueur}_${character.Name}`} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex justify-end gap-2 py-2'>
                                <button type="submit" title="Ajouter" className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer' >Ajouter</button>
                                <button type="reset" title="Cancel" className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer' onClick={() => handleModalClose()}>Cancel</button>
                            </div>
                        </form>
                    </Modal>
                : <></>
            }
        </div>
    );
}