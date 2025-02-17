import { useContext, useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";
import { DataContext } from "../../../context/DataContext";
import { FightActorStatsDisplay } from "./FightDisplay/FightActorStatsDisplay";
import { CharBuffInterface, CharDebuffInterface, CharStatsInterface } from "../../../types/statsType";
import { FightListInterface } from "../../../types/fightType";
import { Terminal } from "./FightDisplay/Terminal";
import { Modal } from "../../../global/Modal";
import { applyStance, handleFightAtk, handleTurnManaCost, removeEffect, unapplyStance, handleIniCalc, applyTurnEffect, handleTurn } from "../../../function/FightCalc";
import { FightSettingsModal } from "./FightSettingsModal";
import { FightStanceArray, findStance } from "../../../data/FightStance";
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

    function handleTurnPrep(actorA: CharStatsInterface | null, actorB: CharStatsInterface | null): void{
        if(actorA === null || actorB === null){ return; };
        const initActorA = { ...actorA };
        const initActorB = { ...actorB };

        handleHistoryEventAdd('Début du tour de combat !', "Info", "");

        // Turn effect
        const turnEffectActorA = applyTurnEffect(initActorA, handleHistoryEventAdd);
        const turnEffectActorB = applyTurnEffect(initActorB, handleHistoryEventAdd);

        // Coup en Mana
        const actorAManaUsed = handleTurnManaCost(turnEffectActorA, handleHistoryEventAdd);
        const actorBManaUsed = handleTurnManaCost(turnEffectActorB, handleHistoryEventAdd);

        // Initiative
        const { firstActor, secondActor } = handleIniCalc(actorAManaUsed, actorBManaUsed, handleHistoryEventAdd);

        // Fight Turn
        const turnRes = handleTurn(firstActor, secondActor, charData, handleHistoryEventAdd);

        if(turnRes) setCharData(turnRes);
    }

    function handleSingleTurn(firstActor: CharStatsInterface | null, secondActor: CharStatsInterface | null, nbAtk?: number){
        if(!firstActor || !secondActor){ return; };
        let currentData = charData;
        const singleAtkRes = handleFightAtk(firstActor.Id, secondActor.Id, charData, handleHistoryEventAdd, nbAtk);

        if(singleAtkRes){
            currentData = currentData.map((char) => {
                switch(true){
                    case char.Id === singleAtkRes?.defenderData.Id: return singleAtkRes.defenderData;
                    case char.Id === singleAtkRes?.attackerData.Id: return singleAtkRes.attackerData;
                    default: return char;
                }
            })
        }
        setCharData(currentData);
    }

    

    function handleSingleManaCost(actorData: CharStatsInterface | null): void{
        if(!actorData){ return; };
        let newData = { ...actorData };

        newData = handleTurnManaCost(newData, handleHistoryEventAdd);
        setCharData(charData.map(char => char.Id === newData.Id? newData : char));
    }

    function handleSingleInitCalc(actorA: CharStatsInterface | null, actorB: CharStatsInterface | null): void {
        if(!actorA || !actorB){ return; };
        let newData = { ...charData };
        const initActorA = { ...actorA };
        const initActorB = { ...actorB };

        const iniCalcRes = handleIniCalc(initActorA, initActorB, handleHistoryEventAdd);
        if(iniCalcRes){
            newData = charData.map((char) => {
                switch(true){
                    case char.Id === iniCalcRes.firstActor.Id: return iniCalcRes.firstActor;
                    case char.Id === iniCalcRes.secondActor.Id: return iniCalcRes.secondActor;
                    default: return char;
                }
            })
        }
        setCharData(newData);
    }

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

    function handleFightStanceChange(actorId: number | undefined, stanceName: string) {
        const actorData = charData.find((char) => char.Id === actorId);
        if(!actorData){ return; }
        let currentData = { ...charData };

        const removedOldStanceBuffData = unapplyStance(actorData);
        const stanceData = findStance(stanceName);
        if(stanceData){
            if(stanceData.Name === "Position du Golem" && stanceData.Effect.CombatStats){ stanceData.Effect.CombatStats.AA = -(Math.floor(actorData.CombatStats.AA / 2)); };
            removedOldStanceBuffData.FightStyle = stanceData;

            const addedNewStanceBuffData = applyStance(removedOldStanceBuffData);
            currentData = currentData.map((char) => char.Id === actorId ? addedNewStanceBuffData : char);
        }else{
            removedOldStanceBuffData.FightStyle = null;
            currentData = currentData.map((char) => char.Id === actorId ? removedOldStanceBuffData : char);
        }
        setCharData(currentData);
    }

    function handleHistoryEventAdd(newHistoryEntry: string, newMsgType: string, msgTitle: string = ''): void { setActiveData(prevState => ({ ...prevState, fightHistory: [{historyMsg: newHistoryEntry, msgType: newMsgType, msgTitle: msgTitle}, ...prevState.fightHistory]})); };

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
                        {(displayActorAData !== null) && <FightActorStatsDisplay characterData={displayActorAData} handleRemoveEffect={handleRemoveEffect}/>}
                    </div>
                    <div className="flex flex-col items-center justify-around">
                        <div className="flex flex-col items-center gap-2">
                            <h2 className="input_label">Controles de combat: </h2>
                            <div className="flex flex-row gap-2 items-center">
                                <h3 className="text-xl font-bold">Atk: </h3>
                                <button onClick={() => handleSingleTurn(displayActorAData, displayActorBData)} disabled={(displayActorAData === null || displayActorBData === null)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">A &#8594; B</button>
                                <button onClick={() => handleTurnPrep(displayActorAData, displayActorBData)} disabled={(displayActorAData === null || displayActorBData === null)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">Tour de combat</button>
                                <button onClick={() => handleSingleTurn(displayActorBData, displayActorAData)} disabled={(displayActorAData === null || displayActorBData === null)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">A &#8592; B</button>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <h3 className="text-xl font-bold">Coup Mana: </h3>
                                <button onClick={() => handleSingleManaCost(displayActorAData)} disabled={displayActorAData === null} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">Coup Mana A (1 tour)</button>
                                <button onClick={() => handleSingleManaCost(displayActorBData)} disabled={displayActorBData === null} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">Coup Mana B (1 tour)</button>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <h3 className="text-xl font-bold">Calcul Ini: </h3>
                                <button onClick={() => handleSingleInitCalc(displayActorAData, displayActorBData)} disabled={displayActorAData === null} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">Calcul Initiative</button>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <h2 className="input_label">Choix Position de combat :</h2>
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <div className="flex flex-col">
                                        <h2 className="text-center input_label">Acteur A :</h2>
                                        <select className="input_field" id="actorA_stance_select" onChange={(e) => handleFightStanceChange(displayActorAData?.Id, e.currentTarget.value)} defaultValue={displayActorAData?.FightStyle?.Name || "None"}>
                                            <option value="None">None</option>
                                            {FightStanceArray.map((stance) => {
                                                return <option key={stance.Name} value={stance.Name} title={stance.Desc} className={`stance_${stance.Type}`}>{stance.Name}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-center input_label">Acteur B :</h2>
                                        <select className="input_field" id="actorB_stance_select" onChange={(e) => handleFightStanceChange(displayActorBData?.Id, e.currentTarget.value)} defaultValue={displayActorBData?.FightStyle?.Name || "None"}>
                                            <option value="None">None</option>
                                            {FightStanceArray.map((stance) => {
                                                return <option key={stance.Name} value={stance.Name} title={stance.Desc} className={`stance_${stance.Type}`}>{stance.Name}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
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
                        <select onChange={(e) => handleSetDisplayActorData('B', e.currentTarget.value)} name="actorBSelect" defaultValue={displayActorBData?.Name || 'None'} className="text-lg bg-white p-2 my-2 border border-black rounded">
                            <option value="None">None</option>
                            {
                                (activeData.fightMembers.length > 1) &&
                                    (activeData.fightMembers.map((member, index) => {
                                        return <option key={`${member}_${index}`} value={member}>{member}</option>
                                    }))
                            }
                        </select>
                        {(displayActorBData !== null) && <FightActorStatsDisplay characterData={displayActorBData} handleRemoveEffect={handleRemoveEffect}/>}
                    </div>
                </div>
            </div>
        </div>
    );
};