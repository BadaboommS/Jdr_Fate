import { useContext, useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";
import { DataContext } from "../../../context/DataContext";
import { FightActorStatsDisplay } from "./FightDisplay/FightActorStatsDisplay";
import { CharBuffInterface, CharDebuffInterface, CharStatsInterface } from "../../../types/statsType";
import { FightListInterface } from "../../../types/fightType";
import { Terminal } from "./FightDisplay/Terminal";
import { Modal } from "../../../global/Modal";
import { handleFightAtk, removeEffect } from "../../../function/FightCalc";
import { FightSettingsModal } from "./FightSettingsModal";
import { rollDice } from "../../../function/GlobalFunction";

interface FightScreenPropsInterface {
    activeFightData: FightListInterface;
    handleModalClose: () => void;
    saveFightData: (activeFightData: FightListInterface) => void;
}

interface IniBuffInterface {
    SA: number;
    SD: number;
    CdC: number;
}

export function FightScreen ({ activeFightData, handleModalClose, saveFightData }: FightScreenPropsInterface) {
    const { charData, setCharData } = useContext(DataContext);
    const [activeData, setActiveData] = useState<FightListInterface>(activeFightData);
    const [displayActorAData, setDisplayActorAData] = useState<CharStatsInterface | null>(charData.find((char) => char.Name === activeFightData.activeActorA) || null);
    const [displayActorBData, setDisplayActorBData] = useState<CharStatsInterface | null>(charData.find((char) => char.Name === activeFightData.activeActorB) || null);
    const [fightSettingsModal, setFightSettingsModal] = useState<boolean>(false);

    function handleTurnPrep(actorA: CharStatsInterface | null, actorB: CharStatsInterface | null): void{
        if(actorA === null || actorB === null){ return; };

        // Stance

        // Dot & Hot
        let afterTurnEffectActorAData = null;
        let afterTurnEffectActorBData = null
        if(actorA.TurnEffect.Dot !== 0 || actorA.TurnEffect.Hot !== 0) afterTurnEffectActorAData = applyTurnEffect(actorA);
        if(actorB.TurnEffect.Dot !== 0 || actorB.TurnEffect.Hot !== 0) afterTurnEffectActorBData = applyTurnEffect(actorB);
        if (afterTurnEffectActorAData !== null || afterTurnEffectActorBData !== null) {
            setCharData(charData.map((char: CharStatsInterface) => {
                switch(true){
                    case (char.Id === afterTurnEffectActorAData?.Id && afterTurnEffectActorAData !== null): return afterTurnEffectActorAData;
                    case (char.Id === afterTurnEffectActorBData?.Id && afterTurnEffectActorBData !== null): return afterTurnEffectActorBData;
                    default: return char;
                }
            }));
        }

        // Initiative
        const actorAIni = actorA.CombatStats.Ini + rollDice(10);
        const actorBIni = actorB.CombatStats.Ini + rollDice(10);

        const initiativeDifference = Math.abs(actorAIni - actorBIni);
        let bonus: IniBuffInterface = { SA: 0, SD: 0, CdC: 0 };

        if (initiativeDifference >= 2 && initiativeDifference <= 3) {
            bonus = { SA: 15, SD: 15, CdC: 0 };
        } else if (initiativeDifference >= 4) {
            bonus = { SA: 30, SD: 30, CdC: 2 };
        }

        if (actorAIni > actorBIni) {
            handleHistoryEventAdd(`${actorA.Name} a l'initiative sur ${actorB.Name}.`, 'Info', `Ini A : ${actorAIni} |  Ini B : ${actorBIni}`);
            handleTurn(actorA, actorB, bonus, initiativeDifference);
        } else if (actorBIni > actorAIni) {
            handleHistoryEventAdd(`${actorB.Name} a l'initiative sur ${actorA.Name}.`, 'Info', `Ini A : ${actorAIni} |  Ini B : ${actorBIni}`);
            handleTurn(actorB, actorA, bonus, initiativeDifference);
        }
    }

    function handleTurn(firstActor: CharStatsInterface, secondActor: CharStatsInterface, bonus: IniBuffInterface, iniDiff: number){
        handleHistoryEventAdd(`
            La différence d'Ini est de ${iniDiff}.
            ${bonus.SA === 0 ? `La différence est minime.` : ''}
            ${bonus.SA !== 0 ? `${firstActor.Name} gagne SA: ${bonus.SA}` : ''}
            ${bonus.SD !== 0 ? `, SD: ${bonus.SD}` : ''}
            ${bonus.CdC !== 0 ? `, CdC: ${bonus.CdC}` : ''}
            `, "Info");

        // Add Ini bonus
        const initCharData = charData.map((char) => char.Id === firstActor.Id ? { 
            ...char, CombatStats: { 
                ...char.CombatStats, SA: char.CombatStats.SA + bonus.SA, SD: char.CombatStats.SD + bonus.SD, CdC: char.CombatStats.CdC + bonus.CdC
            }
        } : char);

        // First ATK
        const firstAtkRes = handleFightAtk(firstActor.Id, secondActor.Id, initCharData, handleHistoryEventAdd);

        // Update character data
        const updatedCharData = charData.map((char) => char.Id === firstAtkRes?.defenderData.Id ? firstAtkRes.defenderData : char);

        // Second ATK
        const secondAtkRes = handleFightAtk(secondActor.Id, firstActor.Id, updatedCharData, handleHistoryEventAdd);

        // Update character data
        const finalCharData = updatedCharData.map((char) => char.Id === secondAtkRes?.defenderData.Id ? secondAtkRes.defenderData : char);

        // Remove Ini bonus
        finalCharData.map((char) => char.Id === firstActor.Id ? { 
            ...char, CombatStats: { 
                ...char.CombatStats, SA: char.CombatStats.SA - bonus.SA, SD: char.CombatStats.SD - bonus.SD, CdC: char.CombatStats.CdC - bonus.CdC
            }
        } : char);

        setCharData(finalCharData);
    }

    function applyTurnEffect(actorData: CharStatsInterface){
        if(actorData.TurnEffect.Dot !== 0){
            handleHistoryEventAdd(`${actorData.Name} prend des dégâts sur la durée ! ( ${actorData.TurnEffect.Dot} )`, 'Atk');
            actorData.Hp -= actorData.TurnEffect.Dot;
        }
        if(actorData.TurnEffect.Hot !== 0){
            handleHistoryEventAdd(`${actorData.Name} reçoit un heal sur la durée ! ( ${actorData.TurnEffect.Hot} )`, 'Heal');
            actorData.Hp += actorData.TurnEffect.Hot;
        }
        
        return actorData;
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
                        {/* <p className="text-lg">Participants: {
                            (activeData.fightMembers.length > 0)
                                ?   activeData.fightMembers.map((member: string) => <span key={member}>- {member} -</span>)
                                :   <span>Pas de participants.</span>
                        }</p> */}
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
                            <div className="flex flex-row gap-2">
                                <button onClick={() => handleTurnPrep(displayActorAData, displayActorBData)} disabled={(displayActorAData === null || displayActorBData === null)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">Tour de combat</button>
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