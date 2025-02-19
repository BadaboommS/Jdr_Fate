import { useContext } from "react";
import { DataContext } from "../../../../context/DataContext";
import { Terminal } from "../FightDisplay/Terminal";
import { FightListInterface } from "../../../../types/fightType";
import { CharStatsInterface } from "../../../../types/statsType";
import { applyAllStance, applyTurnEffect, handleFightAtk, handleIniCalc, handleTurn, handleTurnManaCost, unapplyAllStance } from "../../../../function/FightCalc";
import { updateCharData } from "../../../../function/GlobalFunction";
import { FightStanceArray, findStance } from "../../../../data/FightStance";

interface FightControlProps {
    activeData: FightListInterface;
    displayActorAData: CharStatsInterface | null;
    displayActorBData: CharStatsInterface | null;
    handleHistoryEventAdd: (msg: string, type: string, title?: string) => void;
}

export function FightControl({ activeData, displayActorAData, displayActorBData, handleHistoryEventAdd }: FightControlProps) {
    const { charData, setCharData } = useContext(DataContext);

    function handleTurnPrep(actorA: CharStatsInterface | null, actorB: CharStatsInterface | null): void{
        if(actorA === null || actorB === null){ return; };

        handleHistoryEventAdd('Début du tour de combat !', "Info", "");
        const turnRes = handleTurn(actorA, actorB, charData, handleHistoryEventAdd); // Fight Turn
        handleHistoryEventAdd(`-- Fin du tour de combat --`, 'Text');

        if(turnRes) setCharData(turnRes);
    }

    function handleSingleTurn(firstActor: CharStatsInterface | null, secondActor: CharStatsInterface | null, nbAtk?: number){
        if(!firstActor || !secondActor){ return; };
        let currentData = [ ...charData ];

        const singleAtkRes = handleFightAtk(firstActor.Id, secondActor.Id, charData, handleHistoryEventAdd, nbAtk);
        if(singleAtkRes){ currentData = updateCharData(currentData, singleAtkRes.defenderData, singleAtkRes.attackerData); }; // Set Data

        setCharData(currentData);
    }

    function handleSingleManaCost(actorData: CharStatsInterface | null): void{
        if(!actorData){ return; };
        const newData = handleTurnManaCost(actorData, handleHistoryEventAdd);
        setCharData(charData.map(char => char.Id === newData.Id? newData : char));
    }

    function handleSingleInitCalc(actorA: CharStatsInterface | null, actorB: CharStatsInterface | null): void {
        if(!actorA || !actorB){ return; };
        let newData = [ ...charData ];

        const iniCalcRes = handleIniCalc(actorA, actorB, handleHistoryEventAdd);
        if(iniCalcRes){ newData = updateCharData(charData, actorA, actorB); };

        setCharData(newData);
    }

    function handleFightStanceChange(actorId: number | undefined, stanceName: string, stanceNumber: number) {
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

    function handleSingleTurnEffectCalc(actorData: CharStatsInterface | null): void {
        if(!actorData){ return; };
        const newActordata = applyTurnEffect(actorData, handleHistoryEventAdd);
        if(newActordata){ setCharData(charData.map(char => char.Id === newActordata.Id? newActordata : char)); };
    }

    return (
        <div className="flex flex-col items-center justify-around" id="ChatGPT">
            <div className="flex flex-col items-center gap-2">
                <h2 className="input_label">Controles de combat: </h2>
                <div className="flex gap-2 items-center">
                    <h3 className="text-xl font-bold">Tour complet: </h3>
                    <button onClick={() => handleTurnPrep(displayActorAData, displayActorBData)} disabled={!displayActorAData || !displayActorBData} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">Tour de combat</button>
                </div>
                <div className="flex gap-2 items-center">
                    <h3 className="text-xl font-bold">Simple Attaque: </h3>
                    <button onClick={() => handleSingleTurn(displayActorAData, displayActorBData)} disabled={!displayActorAData || !displayActorBData} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">A → B</button>
                    <button onClick={() => handleSingleTurn(displayActorBData, displayActorAData)} disabled={!displayActorAData || !displayActorBData} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">A ← B</button>
                </div>
                <div className="flex gap-2 items-center">
                    <h3 className="text-xl font-bold">Calcul Coût Mana: </h3>
                    <button onClick={() => handleSingleManaCost(displayActorAData)} disabled={!displayActorAData} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">A</button>
                    <button onClick={() => handleSingleManaCost(displayActorBData)} disabled={!displayActorBData} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">B</button>
                </div>
                <div className="flex gap-2 items-center">
                    <h3 className="text-xl font-bold">Calcul Dot & Hot: </h3>
                    <button onClick={() => handleSingleTurnEffectCalc(displayActorAData)} disabled={!displayActorAData} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">A</button>
                    <button onClick={() => handleSingleTurnEffectCalc(displayActorBData)} disabled={!displayActorBData} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">B</button>
                </div>
                <div className="flex gap-2 items-center">
                    <h3 className="text-xl font-bold">Calcul Ini: </h3>
                    <button onClick={() => handleSingleInitCalc(displayActorAData, displayActorBData)} disabled={!displayActorAData} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">Calcul</button>
                </div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <h2 className="input_label">Choix Position de combat :</h2>
                <div className="grid grid-cols-2 gap-2 w-full">
                    <div className="flex flex-col">
                        <h2 className="text-center input_label">Acteur A :</h2>
                        {displayActorAData && Array.from({ length: displayActorAData?.MaxFightStyleAmount }).map((_, index) => {
                            return <select key={index} className="input_field" id={`actorA_stance_select_${index}`} onChange={(e) => handleFightStanceChange(displayActorAData?.Id, e.currentTarget.value, index)} defaultValue={displayActorAData?.FightStyleList[index]?.Name || "None"}>
                                        <option value="None">None</option>
                                        {FightStanceArray.map((stance) => {
                                            return <option key={stance.Name} value={stance.Name} title={stance.Desc} className={`stance_${stance.Type}`}>{stance.Name}</option>
                                        })}
                                    </select>
                        })}
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-center input_label">Acteur B :</h2>
                        {displayActorBData && Array.from({ length: displayActorBData?.MaxFightStyleAmount }).map((_, index) => {
                            return <select key={index} className="input_field" id={`actorB_stance_select_${index}`} onChange={(e) => handleFightStanceChange(displayActorBData?.Id, e.currentTarget.value, index)} defaultValue={displayActorAData?.FightStyleList[index]?.Name || "None"}>
                                        <option value="None">None</option>
                                        {FightStanceArray.map((stance) => {
                                            return <option key={stance.Name} value={stance.Name} title={stance.Desc} className={`stance_${stance.Type}`}>{stance.Name}</option>
                                        })}
                                    </select>
                        })}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <h2>Historique de combat :</h2>
                <Terminal fightHistory={activeData.fightHistory} />
            </div>
        </div>
    );
}
