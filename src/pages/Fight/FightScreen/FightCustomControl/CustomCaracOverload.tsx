import { useContext, useState } from 'react';
import { Modal } from '../../../../global/Modal';
import { CharCaracteristicsArray, CharStatsCaracteristicsInterface, CharStatsCaracteristicsValueInterface, CharStatsInterface } from '../../../../types/statsType';
import { useForm, SubmitHandler } from 'react-hook-form';
import { DataContext } from '../../../../context/DataContext';
import { updateCombatStatsCalc } from '../../../../function/BaseStatsCalc';

interface CustomCaracOverloadProps {
    toEditCharData: CharStatsInterface;
    handleHistoryEventAdd?: (msg: string, type: string, title?: string) => void,
}

export function CustomCaracOverload ({ toEditCharData, handleHistoryEventAdd }: CustomCaracOverloadProps) {
    const { charData, setCharData } = useContext(DataContext);
    const [showCustomEffectModal, setShowCustomEffectModal] = useState(false);
    const charCarOverloadCapacity = toEditCharData.CaracteristicsOverload.capacity;
    const charCarOverloadActive = toEditCharData.CaracteristicsOverload.active;

    const { register, handleSubmit, setValue } = useForm<CharStatsCaracteristicsValueInterface>();
    
    const onSubmit: SubmitHandler<CharStatsCaracteristicsValueInterface> = (data) => {
        if(!window.confirm(`Confirmer l'overload de Mana ?`)){ return; };

        let newCharData = { ...toEditCharData };
        const manaCost = Object.values(data).reduce((acc, num) => acc + num, 0) * 5;
        if(manaCost > 0){ 
            newCharData.Mana -= manaCost;
            if(handleHistoryEventAdd) handleHistoryEventAdd(`${toEditCharData.Name} a overload ses caractéristiques pour ${manaCost} Mana.`, 'Text');
        };
        newCharData.CaracteristicsOverload.active = data;
        newCharData = updateCombatStatsCalc(newCharData);
        
        setCharData(charData.map(char => char.Id === newCharData.Id? newCharData : char));
        handleModalClose();
    }

    function handleOverloadReset(){
        CharCaracteristicsArray.map(stat => setValue(stat as keyof CharStatsCaracteristicsInterface, 0));
    }

    function handleModalClose(){
        setShowCustomEffectModal(false);
    }

    return (
        <>
            <button onClick={() => setShowCustomEffectModal(true)} title="Activer Mana Overload" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Overload</button>
            {
                (showCustomEffectModal)
                    ?   <Modal isOpen={showCustomEffectModal} onClose={() => handleModalClose()}>
                            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center gap-2'>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-center text-xl'>Caracteristics Overload : </h2>
                                    <div className='input_group'>
                                        {Object.values(toEditCharData.CaracteristicsOverload.capacity).some(value => value !== 0)
                                            ?   (Object.keys(toEditCharData.CaracteristicsOverload.capacity) as (keyof CharStatsCaracteristicsValueInterface)[])
                                                    .filter(stat => toEditCharData.CaracteristicsOverload.capacity[stat] !== 0)
                                                    .map(stat => (
                                                        <div key={stat} className='input_entry'>
                                                            <label className='input_label' htmlFor={stat.toLowerCase()}>
                                                            <span> {stat} : </span>
                                                            <span className={`${charCarOverloadActive[stat as keyof typeof charCarOverloadActive] > 0? "text-blue-500 font-bold": ""}`}>
                                                                {toEditCharData.Caracteristics[stat as keyof typeof toEditCharData.Caracteristics]}
                                                            </span>
                                                            {charCarOverloadCapacity[stat as keyof typeof charCarOverloadCapacity] !== 0 &&
                                                                [...Array(Math.abs(charCarOverloadCapacity[stat as keyof typeof charCarOverloadCapacity]))].map((_, index) => (
                                                                    <span key={index} className={index < (charCarOverloadActive[stat as keyof typeof charCarOverloadActive] || 0)
                                                                        ? "text-blue-500 font-bold"
                                                                        : ""
                                                                    }>{charCarOverloadCapacity[stat as keyof typeof charCarOverloadCapacity] > 0 ? "+" : "-"}</span>
                                                                ))
                                                            }
                                                            </label>
                                                            <input type='number' {...register(stat as keyof CharStatsCaracteristicsValueInterface, { min: 0, valueAsNumber: true })} className='input_field' defaultValue={toEditCharData.CaracteristicsOverload.active[stat as keyof CharStatsCaracteristicsValueInterface]} id={stat.toLowerCase()} />
                                                        </div>
                                                    ))
                                            : <p>Pas de caracteristiques a Overload.</p>
                                        }
                                    </div>
                                </div>
                                <div className='flex justify-around items-center'>
                                    <button type="submit" className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer'>Update</button>
                                    <button type='button' onClick={() => handleOverloadReset()} className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer'>Reset</button>
                                    <button type="button" onClick={() => handleModalClose()} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Cancel</button>
                                </div>
                            </form>
                        </Modal>
                    : <></>
            }
        </>
    );
};