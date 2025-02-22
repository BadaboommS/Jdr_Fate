import { useContext, useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";
import { DataContext } from "../../../context/DataContext";
import { CharacterStatsDisplay } from "../../../global/CharacterStatsDisplay";
import { CharSlidePannel } from "./FightDisplay/CharSlidePannel";
import { Modal } from "../../../global/Modal";
import { FightSettingsModal } from "./FightSettingsModal";
import { FightEditCharModal } from "./FightCustomControl/FightEditCharModal";
import { FightControl } from "./FightControl/FightControl";
import { FightANModal } from "./FightCustomControl/FightANModal";
import { FightStatsEdit } from "./FightCustomControl/FightStatsEdit";
import { CharStatsInterface } from "../../../types/statsType";
import { FightListInterface } from "../../../types/fightType";
import './fightScreen.css';
import { FightStanceArray, findStance } from "../../../data/FightStance";
import { applyAllStance, unapplyAllStance } from "../../../function/FightCalc";

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

    function handleFightStanceChange(actorId: number | undefined, stanceName: string, stanceNumber: number): void {
        const actorData = charData.find((char) => char.Id === actorId);
        if(!actorData){ return; }
        const currentData = [ ...charData ];
        const newStanceData = findStance(stanceName);
        const removedStanceBuffData = unapplyAllStance(actorData);
        
        if(newStanceData){
            if(newStanceData.Name === "Position du Golem" && newStanceData.Effect.CombatStats){ newStanceData.Effect.CombatStats.AA = -(Math.floor(actorData.CombatStats.AA / 2)); };
            removedStanceBuffData.FightStyleList[stanceNumber] = newStanceData;
        }else{
            removedStanceBuffData.FightStyleList[stanceNumber] = null;
        }
        const appliedStanceBuffData = applyAllStance(removedStanceBuffData);
        const finalData = currentData.map((char) => char.Id === actorId ? appliedStanceBuffData : char);

        setCharData(finalData);
    }

    function handleHistoryEventAdd(newHistoryEntry: string, newMsgType: string, msgTitle: string = ''): void { 
        setActiveData(prevState => ({ ...prevState, fightHistory: [{ historyMsg: newHistoryEntry, msgType: newMsgType, msgTitle: msgTitle }, ...prevState.fightHistory]}));
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
        <div className="w-screen h-screen p-2 bg-[#DFDDCF] text-black">
            <div className="flex grid grid-cols-3 w-full">
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
                        <>
                            <CharSlidePannel side="Left" charStats={displayActorAData} handleHistoryEventAdd={handleHistoryEventAdd} />
                            <CharacterStatsDisplay charStats={displayActorAData} showVariant={false} />
                            {Array.from({ length: displayActorAData?.MaxFightStyleAmount }).map((_, index) => (
                                <div key={`actorA_stance_${index}`} className="input_group w-50 mx-auto py-2">
                                    <h3 className="input_label">Position de combat:</h3>
                                    <select key={index} className="input_field" id={`${displayActorAData.Name}_stance_select_${index}`} onChange={(e) => handleFightStanceChange(displayActorAData?.Id, e.currentTarget.value, index)} defaultValue={displayActorAData?.FightStyleList[index]?.Name || "None"}>
                                        <option value="None">None</option>
                                        {FightStanceArray.map((stance) => {
                                            return <option key={stance.Name} value={stance.Name} title={stance.Desc} className={`stance_${stance.Type}`}>{stance.Name}</option>
                                        })} 
                                    </select>
                                </div>
                            ))}
                            <div className="flex justify-center py-2">
                                <div className="min-w-80 flex justify-around">
                                    <FightEditCharModal toEditCharData={displayActorAData} />
                                    <FightStatsEdit toEditCharData={displayActorAData} handleHistoryEventAdd={handleHistoryEventAdd} />
                                    <FightANModal toEditCharData={displayActorAData} handleHistoryEventAdd={handleHistoryEventAdd} />
                                </div>
                            </div>
                        </>
                    }
                </div>
                <div className="flex flex-col gap-2">
                    <nav className="flex p-2 items-center justify-around gap-3 w-full">
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
                    <FightControl activeData={activeData} displayActorAData={displayActorAData} displayActorBData={displayActorBData} handleHistoryEventAdd={handleHistoryEventAdd}/>
                </div>
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
                        <>
                            <CharSlidePannel side="Right" charStats={displayActorBData} handleHistoryEventAdd={handleHistoryEventAdd} />
                            <CharacterStatsDisplay charStats={displayActorBData} showVariant={false} />
                            {Array.from({ length: displayActorBData?.MaxFightStyleAmount }).map((_, index) => (
                                <div key={`actorB_stance_${index}`} className="input_group w-50 mx-auto py-2">
                                    <h3 className="input_label">Position de combat:</h3>
                                    <select key={index} className="input_field" id={`${displayActorBData.Name}_stance_select_${index}`} onChange={(e) => handleFightStanceChange(displayActorBData?.Id, e.currentTarget.value, index)} defaultValue={displayActorBData?.FightStyleList[index]?.Name || "None"}>
                                        <option value="None">None</option>
                                        {FightStanceArray.map((stance) => {
                                            return <option key={stance.Name} value={stance.Name} title={stance.Desc} className={`stance_${stance.Type}`}>{stance.Name}</option>
                                        })} 
                                    </select>
                                </div>
                            ))}
                            <div className="flex justify-center py-2">
                                <div className="min-w-80 flex justify-around">
                                    <FightEditCharModal toEditCharData={displayActorBData} />
                                    <FightStatsEdit toEditCharData={displayActorBData} handleHistoryEventAdd={handleHistoryEventAdd} />
                                    <FightANModal toEditCharData={displayActorBData} handleHistoryEventAdd={handleHistoryEventAdd} />
                                </div>
                            </div>
                        </>
                    }
                    
                </div>
            </div>
        </div>
    );
};