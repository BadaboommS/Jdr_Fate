import { useState } from "react";
import { FightListInterface } from "../../types/fightType";
import { MdSave } from "react-icons/md";

interface FightScreenPropsInterface {
    activeFightData: FightListInterface;
    handleModalClose: () => void;
    saveFightData: (activeFightData: FightListInterface) => void;
}

export function FightScreen ({ activeFightData, handleModalClose, saveFightData }: FightScreenPropsInterface) {
    const [activeData, setActiveData] = useState(activeFightData);

    return (
        <div className="w-screen h-screen">
            <div className="flex flex-col items-center gap-2 border border-black p-2 bg-[#DFDDCF] text-black rounded">
                <nav className="flex justify-start items-center gap-3 py-4">
                    <button onClick={() => saveFightData(activeData)} className="cursor-pointer"><MdSave size={32} /></button>
                    <p>{activeFightData.fightName}</p>
                    <div className='flex justify-end gap-2 py-2'>
                        <button type="reset" title="Cancel" className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer' onClick={() => handleModalClose()}>Cancel</button>
                    </div>
                </nav>
                <div className="flex justify-around w-screen">
                    <div className="flex flex-col h-screen w-50 border border-black">
                        Acteur 1
                    </div>
                    <div className="flex flex-col h-screen w-50 border border-black">
                        Log
                    </div>
                    <div className="flex flex-col h-screen w-50 border border-black">
                        Acteur 2
                    </div>
                </div>
            </div>
        </div>
    );
};