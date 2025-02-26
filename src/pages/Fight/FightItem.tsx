import { RxCross1 } from "react-icons/rx";
import { FightListInterface } from "../../types/fightType";

interface FilterItemPropsInterface {
    fightData: FightListInterface;
    handleDeleteFight: (fightId: number) => void;
    setActiveFight: (fightData: FightListInterface) => void;
}

export function FightItem ({ fightData, setActiveFight, handleDeleteFight }: FilterItemPropsInterface) {
    return (
        <div className={`flex items-center gap-2 border border-black p-2 text-black text-xl rounded cursor-pointer ${fightData.fightState ? 'bg-[#DFDDCF] text-black' : 'bg-gray-500 text-white'}`}>
            <button className="cursor-pointer" onClick={() => setActiveFight(fightData)}>{fightData.fightName}</button>
            <button onClick={() => handleDeleteFight(fightData.fightId)} className="bg-red-900 text-white hover:bg-white hover:text-red-900 cursor-pointer m-1 rounded transition-all"><RxCross1 size={20}/></button>
        </div>
    );
};