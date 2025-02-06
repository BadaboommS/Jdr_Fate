import { useContext, useState } from "react";
import { MdSave, MdSettings } from "react-icons/md";
import { DataContext } from "../../context/DataContext";
import { FightActorStatsDisplay } from "./Display/FightActorStatsDisplay";
import { CharStatsInterface } from "../../types/statsType";
import { FightListInterface } from "../../types/fightType";
import { Terminal } from "./Display/Terminal";
import { Modal } from "../../global/Modal";
import { handleDmgCalc } from "./fightCalc";

interface FightScreenPropsInterface {
    activeFightData: FightListInterface;
    handleModalClose: () => void;
    saveFightData: (activeFightData: FightListInterface) => void;
}

export function FightScreen ({ activeFightData, handleModalClose, saveFightData }: FightScreenPropsInterface) {
    const { charData, setCharData } = useContext(DataContext);
    const [activeData, setActiveData] = useState<FightListInterface>(activeFightData);
    const [displayActorAData, setDisplayActorAData] = useState<CharStatsInterface | null>(null);
    const [displayActorBData, setDisplayActorBData] = useState<CharStatsInterface | null>(null);
    const [fightSettingsModal, setFightSettingsModal] = useState<boolean>(false);

    function handleSetDisplayActorData(actorType: string, charName: string): void {
        if(charName === 'None' && actorType === 'A') { setDisplayActorAData(null); return; }
        if(charName === 'None' && actorType === 'B') { setDisplayActorBData(null); return; }
        if(actorType === 'A') { setDisplayActorAData(charData[charData.findIndex((char) => char.Name === charName)]); return; }
        if(actorType === 'B') { setDisplayActorBData(charData[charData.findIndex((char) => char.Name === charName)]); return; }
    }

    function handleFightStateChange(): void {
        setActiveData(prevState => ({...prevState, fightState: !prevState.fightState}));
        handleHistoryEventAdd(`Le combat ${activeData.fightState ? 'est en fini / en pause.' : 'reprends.'}`, 'Info');
        saveFightData(activeData);
    }

    function handleMemberListChange(name: string): void {
        const memberListChangeMsg = (activeData.fightMembers.includes(name)) ? 'a quitté le combat.' : 'a rejoint le combat.';
        setActiveData(prevState => ({
            ...prevState,
            fightMembers: prevState.fightMembers.includes(name)
                ? prevState.fightMembers.filter(m => m !== name)
                : [...prevState.fightMembers, name]
        }));
        handleHistoryEventAdd(`${name} ${memberListChangeMsg}`, 'Info');
    }

    function handleHistoryEventAdd(newHistoryEntry: string, newMsgType: string): void {
        setActiveData(prevState => ({
            ...prevState,
            fightHistory: [{historyMsg: newHistoryEntry, msgType: newMsgType}, ...prevState.fightHistory]
        }))
    }

    function handleFightModalClose(): void {
        saveFightData(activeData);
        setFightSettingsModal(false);
    }

    function handleDeleteBuff(charId: number, buffName: string): void {
        setCharData(charData.map((char) => char.Id === charId ? {...char, BuffsList: char.BuffsList.filter(buff => buff.Name !== buffName)} : char));
    }

    function handleDeleteDebuff(charId: number, debuffName: string): void {
        setCharData(charData.map((char) => char.Id === charId ? {...char, BuffsList: char.DebuffsList.filter(debuff => debuff.Name !== debuffName)} : char));
    }


    function handleFightAtk(attackerId: number | null, defenderId: number | null, nbAtk?: number): void {
        if(attackerId === null || defenderId === null) { return; }

        const attackerData = charData[charData.findIndex((char) => char.Id === attackerId)];
        let defenderData = charData[charData.findIndex((char) => char.Id === defenderId)];
        const atkCount = (nbAtk) ? nbAtk :  attackerData.CombatStats.AA;

        handleHistoryEventAdd(`-- ${attackerData.Name} attaque ${defenderData.Name} --`, 'Text');

        for(let i = 0; i < atkCount; i ++){
            const combatRes = handleDmgCalc(attackerData, defenderData, i);

            combatRes.msg.map((msg) => handleHistoryEventAdd(msg.historyMsg, msg.msgType)); // display all turn info

            if(combatRes.debuff !== null && combatRes.debuff !== undefined){ 
                defenderData = { ...defenderData, DebuffsList: [...defenderData.DebuffsList, combatRes.debuff]}
            }

            // setData
            //attackerData = {...attackerData, Hp: attackerData.Hp - combatRes.dmg};
            defenderData = {...defenderData, Hp: defenderData.Hp - combatRes.dmg};
        }

        handleHistoryEventAdd(`-- Fin de l'attaque --`, 'Text');

        //setCharData(charData.map((char) => char.Id === attackerData.Id ? attackerData : char));
        setCharData(charData.map((char) => char.Id === defenderData.Id ? defenderData : char));

        // reload state for display
        if(displayActorAData?.Id === attackerId) { setDisplayActorAData(attackerData); }
        if(displayActorAData?.Id === defenderId) { setDisplayActorAData(defenderData); }
        if(displayActorBData?.Id === attackerId) { setDisplayActorBData(attackerData); }
        if(displayActorBData?.Id === defenderId) { setDisplayActorBData(defenderData); }
    }

    return (
        <div className="w-screen h-screen">
            <div className="flex flex-col items-center gap-2 border border-black p-2 bg-[#DFDDCF] text-black rounded">
                <nav className="flex justify-around px-2 items-center gap-3 py-4 w-screen">
                    <div className="text-xl">
                        <p>Combat N°{activeData.fightId}: {activeData.fightName}</p>
                        <p>Participants: {
                            (activeData.fightMembers.length > 0)
                                ?   activeData.fightMembers.map((member: string) => <span key={member}>- {member} -</span>)
                                :   <span>Pas de participants.</span>
                        }</p>
                        <p>Combat <span className={`text-xl ${activeData.fightState? 'text-green-500' : 'text-gray-500'}`}>{activeData.fightState? 'Actif' :'Fini'}</span>.</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button onClick={() => setFightSettingsModal(true)} className="cursor-pointer" title="Fight Settings"><MdSettings size={32} /></button>
                        {
                            (fightSettingsModal)
                                ?   <Modal isOpen={fightSettingsModal} onClose={() => handleFightModalClose()}>
                                        <div className="grid flex-col justify-center gap-4 items-center">
                                            <div className="flex flex-col gap-2">
                                                <p className="text-center">Etat du combat: {activeData.fightState? 'En cours' : "Fini"}</p>
                                                <button onClick={() => handleFightStateChange()} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Changer Fight State</button>
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <p className="text-center">Participants :</p>
                                                <div className="flex flex-row gap-2 flex-wrap">
                                                    {
                                                        (charData.length > 0)
                                                        ?   (charData.map((character) => (
                                                                <div key={`${character.Joueur}_${character.Name}`} className="flex gap-2 border border-black rounded p-1">
                                                                    <label htmlFor={`${character.Joueur}_${character.Name}`}>{character.Name}</label>
                                                                    <input 
                                                                        type="checkbox"
                                                                        value={character.Name}
                                                                        id={`${character.Joueur}_${character.Name}`}
                                                                        checked={activeData.fightMembers.includes(character.Name)}
                                                                        onChange={() => handleMemberListChange(character.Name)}
                                                                    />
                                                                </div>)))
                                                        : <p>Pas de Joueur.</p>
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex gap-2 justify-end">
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
                <div className="flex grid grid-cols-3 w-full min-h-[90vh]">
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl text-center">Acteur A: </h2>
                        <select onChange={(e) => handleSetDisplayActorData('A', e.currentTarget.value)} name="actorASelect" defaultValue="None" className="text-lg bg-white p-2 my-2 border border-black rounded">
                            <option value="None">None</option>
                            {
                                (activeData.fightMembers.length > 0) &&
                                    (activeData.fightMembers.map((member, index) => {
                                        return <option  key={`${member}_${index}`} value={member}>{member}</option>
                                    }))
                            }
                        </select>
                        {(displayActorAData !== null) && <FightActorStatsDisplay characterData={displayActorAData} handleDeleteBuff={handleDeleteBuff} handleDeleteDebuff={handleDeleteDebuff} />}
                    </div>
                    <div className="flex flex-col items-center justify-around">
                        <div className="flex flex-col items-center gap-2">
                            <h2 className="input_label">Controles de combat: </h2>
                            <div className="flex flex-row gap-2">
                                <button onClick={() => handleFightAtk(displayActorAData?.Id?? null, displayActorBData?.Id?? null)} disabled={(displayActorAData === null || displayActorBData === null)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">A attaque B</button>
                                <button onClick={() => handleFightAtk(displayActorBData?.Id?? null, displayActorAData?.Id?? null)} disabled={(displayActorAData === null || displayActorBData === null)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">B attaque A</button>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <h2 className="input_label">Compétences activables :</h2>
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <div className="flex flex-col">
                                        <h2 className="text-center input_label">Acteur A :</h2>
                                        <ul className="flex flex-col gap-1 border border-black p-2">
                                            <li>Test</li>
                                            <li>Surcharge Mana</li>
                                        </ul>
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-center input_label">Acteur B :</h2>
                                        <ul className="flex flex-col gap-1 border border-black p-2">
                                            <li>Test</li>
                                            <li>Surcharge Mana</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <h2>Historique de combat :</h2>
                            <Terminal fightHistory={activeData.fightHistory}/>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl text-center">Acteur B: </h2>
                        <select onChange={(e) => handleSetDisplayActorData('B', e.currentTarget.value)} name="actorBSelect" defaultValue="None" className="text-lg bg-white p-2 my-2 border border-black rounded">
                            <option value="None">None</option>
                            {
                                (activeData.fightMembers.length > 1) &&
                                    (activeData.fightMembers.map((member, index) => {
                                        return <option key={`${member}_${index}`} value={member}>{member}</option>
                                    }))
                            }
                        </select>
                        {(displayActorBData !== null) && <FightActorStatsDisplay characterData={displayActorBData} handleDeleteBuff={handleDeleteBuff} handleDeleteDebuff={handleDeleteDebuff} />}
                    </div>
                </div>
            </div>
        </div>
    );
};