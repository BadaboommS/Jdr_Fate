import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { CharacterStatsDisplay } from "../../global/CharacterStatsDisplay";
import { CharStatsInterface } from "../../types/statsType";
import { CharBuffInterface, CharDebuffInterface } from "../../types/statsType";
import { removeEffect } from "../../function/FightCalc";
import { CustomEffectFormModal } from "../Fight/FightScreen/FightCustomControl/CustomEffectFormModal";
import { CustomCaracOverload } from "../Fight/FightScreen/FightCustomControl/CustomCaracOverload";
import { FightANModal } from "../Fight/FightScreen/FightCustomControl/FightANModal";
import { FightStatsEdit } from "../Fight/FightScreen/FightCustomControl/FightStatsEdit";

interface CharInfoPropsInterface {
    charStats: CharStatsInterface;
    handleSetEdit: () => void;
    handleCloseModal: () => void;
}

export function CharInfo ({ charStats, handleSetEdit, handleCloseModal }: CharInfoPropsInterface) {
    const { charData, setCharData } = useContext(DataContext);

    function handleRemoveEffect(charD: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface, effectType: "Buff" | "Debuff"){
        if(!window.confirm(`Confirmer la suppression de ${effect.Name} ?`)){ return charData; };
        setCharData(charData.map((char) => char.Id === charD.Id? removeEffect(charD, effect, effectType) : char));
    }

    return (
        <CharacterStatsDisplay
            charStats={charStats}
            handleRemoveEffect={handleRemoveEffect} 
            showEditButtons={true}
            showVariant={true}
            extraButtons={
                <>
                    <CustomEffectFormModal toEditCharData={charStats} />
                    <CustomCaracOverload toEditCharData={charStats} />
                    <FightStatsEdit toEditCharData={charStats} />
                    <FightANModal toEditCharData={charStats} />
                    <button onClick={handleSetEdit} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Edit</button>
                    <button onClick={handleCloseModal} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Cancel</button>
                </>
            }
        />
    );
};