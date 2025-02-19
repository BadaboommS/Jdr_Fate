import { useContext, useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";
import { DataContext } from "../../../context/DataContext";
import { CharacterStatsDisplay } from "../../../global/CharacterStatsDisplay";
import { CharBuffInterface, CharDebuffInterface, CharStatsInterface } from "../../../types/statsType";
import { FightListInterface } from "../../../types/fightType";
import { Modal } from "../../../global/Modal";
import { removeEffect } from "../../../function/FightCalc";
import { FightEditCharModal } from "./FightControl/FightEditCharModal";
import { FightControl } from "./FightControl/FightControl";
import { FightSettingsModal } from "./FightControl/FightSettingsModal";
import { FightANModal } from "./FightControl/FightANModal";
import { FightStatsEdit } from "./FightControl/FightStatsEdit";
import './fightScreen.css';


interface FightScreenPropsInterface {
    activeFightData: FightListInterface;
    handleModalClose: () => void;
    saveFightData: (activeFightData: FightListInterface) => void;
}

export function FightScreen ({ activeFightData, handleModalClose, saveFightData }: FightScreenPropsInterface) {
    const { charData, setCharData } = useContext(DataContext);
    const [activeData, setActiveData] = useState<FightListInterface>(activeFightData);
    const [displayActorAData, setDisplayActorAData] = useState<CharStatsInterface | null>(charData.find((char) => char.Name === activeFightData.activeActorA) || null);
    const [displayActorBData, setDisplayActorBData] = useState<CharStatsInterface | null>(charData.find((char) => char.Name === activeFightData.activeActorB) || null);
    const [fightSettingsModal, setFightSettingsModal] = useState<boolean>(false);

    function handleSetDisplayActorData (actorType: string, charName: string): void {
        const selectedChar = charData.find((char) => char.Name === charName) || null;
        if (actorType === 'A') { setDisplayActorAData(selectedChar); setActiveData(prevState => ({ ...prevState, activeActorA: charName })); };
        if (actorType === 'B') { setDisplayActorBData(selectedChar); setActiveData(prevState => ({ ...prevState, activeActorB: charName })); };
    };

    function handleRemoveEffect(charD: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface, effectType: "Buff" | "Debuff"){
        setCharData(charData.map((char) => char.Id === charD.Id? removeEffect(charD, effect, effectType) : char));
    }

    function handleFightStateChange(): void {
        setActiveData(prevState => ({...prevState, fightState: !prevState.fightState}));
        handleHistoryEventAdd(`Le combat ${activeData.fightState ? 'est en fini / en pause.' : 'reprends.'}`, 'Info');
    }

    function handleMemberListChange(name: string): void {
        const memberListChangeMsg = (activeData.fightMembers.includes(name)) ? 'a quitté le combat.' : 'a rejoint le combat.';
        setActiveData(prevState => ({ ...prevState,
            fightMembers: prevState.fightMembers.includes(name)
                ? prevState.fightMembers.filter(m => m !== name)
                : [...prevState.fightMembers, name]
        }));
        handleHistoryEventAdd(`${name} ${memberListChangeMsg}`, 'Info');
    }

    function handleHistoryEventAdd(newHistoryEntry: string, newMsgType: string, msgTitle: string = ''): void { 
        setActiveData(prevState => ({ ...prevState, fightHistory: [{historyMsg: newHistoryEntry, msgType: newMsgType, msgTitle: msgTitle}, ...prevState.fightHistory]}));
    };

    function handleFightModalClose(): void {
        setFightSettingsModal(false);
    }

    // auto save
    useEffect(() => {
        saveFightData(activeData);
    }, [activeData, saveFightData]);

    useEffect(() => {
        setDisplayActorAData(charData.find((char) => char.Name === activeData.activeActorA) || null);
        setDisplayActorBData(charData.find((char) => char.Name === activeData.activeActorB) || null);
    }, [charData, activeData]);

    return (
        <div className="w-screen h-screen">
            <div className="flex flex-col items-center gap-2 border border-black p-2 bg-[#DFDDCF] text-black rounded">
                <nav className="flex justify p-2 items-center justify-around gap-3 w-screen">
                    <div className="flex gap-3 items-center text-2xl">
                        <p className="text-bold">{activeData.fightName} : </p>
                        <p className={`${activeData.fightState? 'text-green-500' : 'text-gray-500'}`}>{activeData.fightState? 'En Cours' : 'Fini'}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button onClick={() => setFightSettingsModal(true)} className="cursor-pointer" title="Fight Settings"><MdSettings size={32} /></button>
                        {
                            (fightSettingsModal)
                                ?   <Modal isOpen={fightSettingsModal} onClose={() => handleFightModalClose()}>
                                        <FightSettingsModal charData={charData} activeData={activeData} handleFightStateChange={handleFightStateChange} handleMemberListChange={handleMemberListChange} handleSettingsModalClose={handleFightModalClose} />
                                    </Modal>
                                :   <></>
                        }
                        <div className='flex justify-end gap-2 py-2'>
                            <button title="Cancel" className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer' onClick={() => handleModalClose()}>Cancel</button>
                        </div>
                    </div>
                </nav>
                <div className="flex grid grid-cols-3 w-full min-h-[90vh]">
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl text-center">Acteur A: </h2>
                        <select onChange={(e) => handleSetDisplayActorData('A', e.currentTarget.value)} name="actorASelect" defaultValue={displayActorAData?.Name || 'None'} className="text-lg bg-white p-2 my-2 border border-black rounded">
                            <option value="None">None</option>
                            {
                                (activeData.fightMembers.length > 0) &&
                                    (activeData.fightMembers.map((member, index) => {
                                        return <option key={`${member}_${index}`} value={member}>{member}</option>
                                    }))
                            }
                        </select>
                        {(displayActorAData !== null) && 
                            <CharacterStatsDisplay 
                                charStats={displayActorAData} 
                                handleRemoveEffect={handleRemoveEffect}
                                showEditButtons={true} 
                                extraButtons={
                                    <>
                                        <FightEditCharModal toEditCharData={displayActorAData} />
                                        <FightStatsEdit toEditCharData={displayActorAData} />
                                        <FightANModal toEditCharData={displayActorAData} />
                                    </>
                                }
                            />
                        }
                    </div>
                    <FightControl activeData={activeData} displayActorAData={displayActorAData} displayActorBData={displayActorBData} handleHistoryEventAdd={handleHistoryEventAdd}/>
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl text-center">Acteur B: </h2>
                        <select onChange={(e) => handleSetDisplayActorData('B', e.currentTarget.value)} name="actorBSelect" defaultValue={displayActorBData?.Name || 'None'} className="text-lg bg-white p-2 my-2 border border-black rounded">
                            <option value="None">None</option>
                            {
                                (activeData.fightMembers.length > 1) &&
                                    (activeData.fightMembers.map((member, index) => {
                                        return <option key={`${member}_${index}`} value={member}>{member}</option>
                                    }))
                            }
                        </select>
                        {(displayActorBData !== null) && 
                            <CharacterStatsDisplay 
                                charStats={displayActorBData} 
                                handleRemoveEffect={handleRemoveEffect}
                                showEditButtons={true} 
                                extraButtons={
                                    <>
                                        <FightEditCharModal toEditCharData={displayActorBData} />
                                        <FightStatsEdit toEditCharData={displayActorBData} />
                                        <FightANModal toEditCharData={displayActorBData} />
                                    </>
                                }
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};