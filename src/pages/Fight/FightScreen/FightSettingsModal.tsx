import { FightListInterface } from "../../../types/fightType";
import { CharStatsInterface } from "../../../types/statsType";

interface FightScreenPropsInterface {
    charData: CharStatsInterface[];
    activeData: FightListInterface;
    handleFightStateChange: () => void;
    handleMemberListChange: (newMember: string) => void;
    handleSettingsModalClose: () => void;
}

export function FightSettingsModal ({ charData, activeData, handleFightStateChange, handleMemberListChange, handleSettingsModalClose }: FightScreenPropsInterface) {
    return (
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
                <button onClick={() => handleSettingsModalClose()} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Retour</button>
            </div>
        </div>
    );
};