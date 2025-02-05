import { useContext, useEffect, useState } from "react";
import { MdSave, MdSettings } from "react-icons/md";
import { DataContext } from "../../context/DataContext";
import { FightActorStatsDisplay } from "./FightActorStatsDisplay";
import { CharStatsInterface } from "../../types/statsType";
import { FightListInterface } from "../../types/fightType";
import { Modal } from "../../global/Modal";

interface FightScreenPropsInterface {
    activeFightData: FightListInterface;
    handleModalClose: () => void;
    saveFightData: (activeFightData: FightListInterface) => void;
}

export function FightScreen ({ activeFightData, handleModalClose, saveFightData }: FightScreenPropsInterface) {
    const { charData } = useContext(DataContext);
    const [activeData, setActiveData] = useState(activeFightData);
    const [actorAData, setActorAData] = useState<CharStatsInterface | null>(null);
    const [actorBData, setActorBData] = useState<CharStatsInterface | null>(null);
    const [fightSettingsModal, setFightSettingsModal] = useState(false);

    function handleChangeActorA(selectedChar: string){
        setActorAData(charData[charData.findIndex((char) => char.Name === selectedChar)]);
    };

    function handleChangeActorB(selectedChar: string){
        setActorBData(charData[charData.findIndex((char) => char.Name === selectedChar)]);
    };

    function handleFightStateChange() {
        setActiveData(prevState => ({...prevState, fightState: !prevState.fightState}));
    }

    function handleMemberListChange(name: string){
        setActiveData(prevdata => ({
            ...prevdata,
            fightMembers: prevdata.fightMembers.includes(name)
                ? prevdata.fightMembers.filter(m => m !== name)
                : [...prevdata.fightMembers, name]
        }));
    }

    function handleFightModalClose(){
        saveFightData(activeData);
        setFightSettingsModal(false);
        console.log("test")
    }

    useEffect(() => {
        console.log(activeData);
    }, [activeData]);

    return (
        <div className="w-screen h-screen">
            <div className="flex flex-col items-center gap-2 border border-black p-2 bg-[#DFDDCF] text-black rounded">
                <nav className="flex justify-around px-2 items-center gap-3 py-4 w-screen">
                    <div className="text-xl">
                        <p>Combat N°{activeData.fightId}: {activeData.fightName}</p>
                        <p>Participants: {activeData.fightMembers.map((member: string) => <span key={member}>- {member} -</span>)}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button onClick={() => setFightSettingsModal(true)} className="cursor-pointer" title="Fight Settings"><MdSettings size={32} /></button>
                        {
                            (fightSettingsModal)
                                ?   <Modal isOpen={fightSettingsModal} onClose={() => handleFightModalClose()}>
                                        <div className="flex flex-col justify-center gap-4 items-center">
                                            <div className="flex flex-col gap-2">
                                                <p className="text-center">Etat du combat: {activeData.fightState? 'En cours' : "Fini"}</p>
                                                <button onClick={() => handleFightStateChange()} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Changer Fight State</button>
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <p className="text-center">Participants :</p>
                                                <div className="flex flex-row gap-2 flex-wrap">
                                                    {charData.map((character) => (
                                                        <div key={`${character.Joueur}_${character.Name}`} className="flex gap-2 border border-black rounded p-1">
                                                            <label htmlFor={`${character.Joueur}_${character.Name}`}>{character.Name}</label>
                                                            <input 
                                                                type="checkbox"
                                                                value={character.Name}
                                                                id={`${character.Joueur}_${character.Name}`}
                                                                checked={activeData.fightMembers.includes(character.Name)}
                                                                onChange={() => handleMemberListChange(character.Name)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleFightModalClose()} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Retour</button>
                                            </div>
                                        </div>
                                    </Modal>
                                :   <></>
                        }
                        <button onClick={() => saveFightData(activeData)} className="cursor-pointer" title="Save"><MdSave size={32} /></button>
                        <div className='flex justify-end gap-2 py-2'>
                            <button title="Cancel" className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer' onClick={() => handleModalClose()}>Cancel</button>
                        </div>
                    </div>
                </nav>
                <div className="flex justify-around w-screen">
                    <div className="flex flex-col h-screen">
                        <h2 className="text-xl text-center">Acteur A: </h2>
                        <select onChange={(e) => handleChangeActorA(e.currentTarget.value)} className="text-lg text-center bg-white p-2 my-2 border border-black rounded">
                            {
                                (activeData.fightMembers.length > 1) &&
                                    (activeData.fightMembers.map((member, index) => {
                                        return <option key={index} value={member}>{member}</option>
                                    }))
                            }
                        </select>
                        {(actorAData !== null) && <FightActorStatsDisplay characterData={actorAData}/>}
                    </div>
                    <div className="flex flex-col h-screen w-50">
                        Log
                    </div>
                    <div className="flex flex-col h-screen">
                        <h2 className="text-xl text-center">Acteur B: </h2>
                        <select onChange={(e) => handleChangeActorB(e.currentTarget.value)} className="text-lg text-center bg-white p-2 my-2 border border-black rounded">
                            {
                                (activeData.fightMembers.length > 1) &&
                                    (activeData.fightMembers.map((member, index) => {
                                        return <option key={index} value={member}>{member}</option>
                                    }))
                            }
                        </select>
                        {(actorBData !== null) && <FightActorStatsDisplay characterData={actorBData}/>}
                    </div>
                </div>
            </div>
        </div>
    );
};