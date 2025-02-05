import { useContext, useState } from 'react';
import { IoMdPeople } from "react-icons/io";
import { RxCross1 } from 'react-icons/rx';
import { DataContext } from '../../context/DataContext';
import { Modal } from '../../global/Modal';

export function PlayerListControl() {
    const { playerData, setPlayerData, filterData, setFilterData } = useContext(DataContext);
    const [ showAddModal, setShowAddModal] = useState(false);

    function handlePlayerAdd(){
        if(!window.confirm('Confirm ?')){ return };
        const newPlayerInput = (document.getElementById('input_new_player') as HTMLInputElement).value;
        if (newPlayerInput) {
            setPlayerData([...playerData, newPlayerInput.trim()]);
            setFilterData([...filterData, {id: filterData[0]? filterData[filterData.length - 1].id + 1: 0, filterName: newPlayerInput.trim(), filterString: newPlayerInput.trim()}])
            resetField();
        }else{
            window.alert('Il faut un nom !');
        }
    }

    function handlePlayerDelete(player: string){
        if(!window.confirm('Confirm Delete ?')){ return };
        setPlayerData(playerData.filter(p => p !== player));
        setFilterData(filterData.filter(p => p.filterName !== player));
    }

    function handleModalClose() {
        resetField();
        setShowAddModal(false);
    }

    function resetField(){
        (document.getElementById('input_new_player') as HTMLInputElement).value = '';
    }

    return (
        <>
            <div className='navbar-icon group' onClick={() => setShowAddModal(true)} >
                <IoMdPeople size="32"/>
                <span className='navbar-tooltip group-hover:scale-100 scale-0'><p>Liste Joueur</p></span>            
            </div>
            {
                (showAddModal)
                ?   <Modal isOpen={showAddModal} onClose={() => handleModalClose()}>
                        <div className='flex flex-col gap-2 justify-center'>
                            <h2 className='text-2xl text-center'>Liste des joueurs :</h2>
                            <div className='flex flex-row gap-2 flex-wrap'>
                                {(playerData.map((player: string, index: number) => {
                                    return (
                                        <div key={index} className='flex gap-2 border border-black rounded p-1'>
                                            <p>{player}</p>
                                            <button onClick={() => handlePlayerDelete(player)} className='cursor-pointer'><RxCross1 size={12} /></button>
                                        </div>
                                )
                                }))}
                            </div>
                            <div className='flex justify-end py-2 gap-2'>
                                <input type="text" placeholder='Nouveau Joueur' id="input_new_player" className='indent-2'/>
                                <button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer' onClick={() => handlePlayerAdd()}>Ajouter</button>
                                <button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer' onClick={() => handleModalClose()}>Cancel</button>
                            </div>
                        </div>
                    </Modal>
                : <></>
            }
        </>
    );
}