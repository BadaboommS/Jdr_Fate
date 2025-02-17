import { useContext, useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";
import { DataContext } from "../../../context/DataContext";
import { FightActorStatsDisplay } from "./FightDisplay/FightActorStatsDisplay";
import { BuffInterface, CharBuffInterface, CharDebuffInterface, CharStatsInterface } from "../../../types/statsType";
import { FightListInterface } from "../../../types/fightType";
import { Terminal } from "./FightDisplay/Terminal";
import { Modal } from "../../../global/Modal";
import { addEffect, applyStance, handleFightAtk, handleTurnManaCost, removeEffect, unapplyStance } from "../../../function/FightCalc";
import { FightSettingsModal } from "./FightSettingsModal";
import { rollDice } from "../../../function/GlobalFunction";
import { FightStanceArray, findStance } from "../../../data/FightStance";
import './fightScreen.css';
import { findPreset } from "../../../data/EffectPreset";

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

        handleHistoryEventAdd('Début du tour de combat !', "Info", "");

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

        // Coup en Mana
        let actorAManaUsed = handleTurnManaCost(actorA, handleHistoryEventAdd);
        let actorBManaUsed = handleTurnManaCost(actorB, handleHistoryEventAdd);

        // Initiative
        const actorAIni = actorA.CombatStats.Ini + rollDice(10);
        const actorBIni = actorB.CombatStats.Ini + rollDice(10);
        const initiativeDifference = Math.abs(actorAIni - actorBIni);

        let iniBonus: BuffInterface | null | undefined = null;
        if (initiativeDifference >= 2 && initiativeDifference <= 3) { iniBonus = findPreset("Bonus Initiative 1"); } else if (initiativeDifference >= 4) { iniBonus = findPreset("Bonus Initiative 2"); };
        
        handleHistoryEventAdd(`
            La différence d'Ini est de ${initiativeDifference}.
            ${initiativeDifference < 2 ? `La différence est minime.` : ''}
                ${iniBonus?.Effect?.CombatStats?.SA !== 0 ? `${actorAIni > actorBIni? actorA.Name : actorB.Name} gagne SA: ${iniBonus?.Effect?.CombatStats?.SA}` : ''}
                ${iniBonus?.Effect?.CombatStats?.SD !== 0 ? `, SD: ${iniBonus?.Effect?.CombatStats?.SD}` : ''}
                ${iniBonus?.Effect?.CombatStats?.CdC !== 0 ? `, CdC: ${iniBonus?.Effect?.CombatStats?.CdC}` : ''}
            `, "Info");

        if (actorAIni > actorBIni) {
            handleHistoryEventAdd(`${actorA.Name} a l'initiative sur ${actorB.Name}.`, 'Info', `Ini A : ${actorAIni} |  Ini B : ${actorBIni}`);
            if(iniBonus) actorAManaUsed = addEffect(actorAManaUsed, iniBonus, "Buff");
            handleTurn(actorAManaUsed, actorB);
        } else if (actorBIni > actorAIni) {
            handleHistoryEventAdd(`${actorB.Name} a l'initiative sur ${actorA.Name}.`, 'Info', `Ini A : ${actorAIni} |  Ini B : ${actorBIni}`);
            if(iniBonus) actorBManaUsed = addEffect(actorBManaUsed, iniBonus, "Buff");
            handleTurn(actorBManaUsed, actorA);
        }
    }

    function handleTurn(firstActor: CharStatsInterface | null, secondActor: CharStatsInterface | null, nbAtk?: number){
        if(!firstActor || !secondActor){ return; };
        let currentData = charData;
       
        // First ATK
        const firstAtkRes = handleFightAtk(firstActor.Id, secondActor.Id, charData, handleHistoryEventAdd, nbAtk);

        if(firstAtkRes){
            currentData = currentData.map((char) => {
                switch(true){
                    case char.Id === firstAtkRes?.defenderData.Id: return firstAtkRes.defenderData;
                    case char.Id === firstAtkRes?.attackerData.Id: return firstAtkRes.attackerData;
                    default: return char;
                }
            })

            // Second ATK
            const secondAtkRes = handleFightAtk(secondActor.Id, firstActor.Id, currentData, handleHistoryEventAdd, nbAtk);

            // Update character data
            if(secondAtkRes){
                let iniRemovedFirstActor = secondAtkRes.defenderData;
                let iniRemovedSecondActor = secondAtkRes.attackerData;

                // Remove Ini bonus
                if(iniRemovedFirstActor.BuffsList.find((effect) => effect.Name === "Bonus Initiative 1" || effect.Name === "Bonus Initiative 2" )){ const iniBuff = iniRemovedFirstActor.BuffsList.find((effect) => effect.Name === "Bonus Initiative 1" || effect.Name === "Bonus Initiative 2"); if(iniBuff) iniRemovedFirstActor = removeEffect(iniRemovedFirstActor, iniBuff, "Buff"); };
                if(iniRemovedSecondActor.BuffsList.find((effect) => effect.Name === "Bonus Initiative 1" || effect.Name === "Bonus Initiative 2")){ const iniBuff = iniRemovedSecondActor.BuffsList.find((effect) => effect.Name === "Bonus Initiative 1"  || effect.Name === "Bonus Initiative 2"); if(iniBuff) iniRemovedSecondActor = removeEffect(iniRemovedSecondActor, iniBuff, "Buff"); };

                let manaRemovedFirstActor = iniRemovedFirstActor;
                let manaRemovedSecondActor = iniRemovedSecondActor;
                // Remove Mana debuff
                if(manaRemovedFirstActor.DebuffsList.find((effect) => effect.Name === "Mal de mana")){ const manaDebuff = manaRemovedFirstActor.DebuffsList.find((effect) => effect.Name === "Mal de mana"); if(manaDebuff) manaRemovedFirstActor = removeEffect(manaRemovedFirstActor, manaDebuff, "Debuff"); };
                if(manaRemovedSecondActor.DebuffsList.find((effect) => effect.Name === "Mal de mana")){ const manaDebuff = manaRemovedSecondActor.DebuffsList.find((effect) => effect.Name === "Mal de mana"); if(manaDebuff) manaRemovedSecondActor = removeEffect(manaRemovedSecondActor, manaDebuff, "Debuff"); };

                // Dragon Stance
                if(manaRemovedFirstActor.FightStyle?.Name === "Position du Dragon" && !manaRemovedFirstActor.BuffsList.some(buff => buff.Name === "Déchainement du Dragon")){
                    const dragonBuff = findPreset("Déchainement du Dragon");
                    if(dragonBuff){
                        manaRemovedFirstActor = addEffect(manaRemovedFirstActor, dragonBuff, "Buff");
                        handleHistoryEventAdd(`${manaRemovedFirstActor.Name} est prêt à se déchainer !`, 'Atk', dragonBuff.Desc);
                    }
                }
                if(manaRemovedSecondActor.FightStyle?.Name === "Position du Dragon" && !manaRemovedSecondActor.BuffsList.some(buff => buff.Name === "Déchainement du Dragon")){
                    const dragonBuff = findPreset("Déchainement du Dragon");
                    if(dragonBuff){
                        manaRemovedSecondActor = addEffect(manaRemovedSecondActor, dragonBuff, "Buff");
                        handleHistoryEventAdd(`${manaRemovedSecondActor.Name} est prêt à se déchainer !`, 'Atk', dragonBuff.Desc);
                    }
                }

                // Set Data
                currentData = currentData.map((char) => {
                    switch(true){
                        case char.Id === manaRemovedFirstActor.Id: return manaRemovedFirstActor;
                        case char.Id === manaRemovedSecondActor.Id: return manaRemovedSecondActor;
                        default: return char;
                    }
                });
            }
        }

        setCharData(currentData);
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

    function applyTurnEffect(actorData: CharStatsInterface): CharStatsInterface {
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

    function handleFightStanceChange(actorId: number | undefined, stanceName: string) {
        const actorData = charData.find((char) => char.Id === actorId);
        if(!actorData){ return; }

        const removedOldStanceBuffData = unapplyStance(actorData);
        const stanceData = findStance(stanceName);
        if(stanceData){
            removedOldStanceBuffData.FightStyle = stanceData;

            if(stanceData.Name === "Position du Golem" && stanceData.Effect.CombatStats){ stanceData.Effect.CombatStats.AA = -(Math.floor(actorData.CombatStats.AA / 2)); };

            const addedNewStanceBuffData = applyStance(removedOldStanceBuffData);
            setCharData(charData.map((char) => char.Id === actorId ? addedNewStanceBuffData : char));
        }else{
            removedOldStanceBuffData.FightStyle = null;
            setCharData(charData.map((char) => char.Id === actorId ? removedOldStanceBuffData : char));
        }   
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
                            <div className="flex flex-row gap-2">
                                <button onClick={() => handleSingleTurn(displayActorAData, displayActorBData)} disabled={(displayActorAData === null || displayActorBData === null)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">A &#8594; B</button>
                                <button onClick={() => handleTurnPrep(displayActorAData, displayActorBData)} disabled={(displayActorAData === null || displayActorBData === null)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">Tour de combat</button>
                                <button onClick={() => handleSingleTurn(displayActorBData, displayActorAData)} disabled={(displayActorAData === null || displayActorBData === null)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">A &#8592; B</button>
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