import { useContext, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { DataContext } from '../context/DataContext';
import { BsBookmarkPlusFill } from 'react-icons/bs';
import { Modal } from './Modal';
import { CharBuffInterface, CharStatsInterface, EffectFormInputInterface } from '../types/statsType';
import { addEffect } from '../function/FightCalc';

interface AddCustomEffectFormProps {
    toUpdateCharData: CharStatsInterface;
}

export function AddCustomEffectForm ({ toUpdateCharData }: AddCustomEffectFormProps) {
    const { charData, setCharData } = useContext(DataContext);
    const [showCustomEffectModal, setShowCustomEffectModal] = useState(false);
    const [effectType, setEffectType] = useState<"Buff" | "Debuff">('Buff');
    const { register, handleSubmit, reset } = useForm<EffectFormInputInterface>({ defaultValues: { Name: '', Desc: '', STR: 0, END: 0, AGI: 0, MANA: 0, MGK: 0, LUK: 0, SPD: 0, Ini: 0, SA: 0, AA: 0, DMG: 0, PA: 0, SD: 0, AD: 0, ReD: 0, CdC: 0, CC: 0, AN: 0, Dot: 0, Hot: 0 } })

    const onSubmit: SubmitHandler<EffectFormInputInterface> = (data) => {
        if(!window.confirm(`Confirmer l'atout de ${data.Name} ?`)){ return charData; };
        const effectList = (effectType === "Buff")? toUpdateCharData.BuffsList : toUpdateCharData.DebuffsList;
        const newEffect: CharBuffInterface = {
            Id: effectList[0]? effectList[effectList.length - 1].Id + 1 : 0,
            Name: data.Name,
            Desc: data.Desc,
            Applied: false
        };

        const newEffectCharCarac = { STR: Number(data.STR), END: Number(data.END), AGI: Number(data.AGI), MGK: Number(data.MGK), LUK: Number(data.LUK), SPD: Number(data.SPD) };
        const newEffectCombatStats = { Ini: Number(data.Ini), SA: Number(data.SA), AA: Number(data.AA), DMG: Number(data.DMG), PA: Number(data.PA), SD: Number(data.SD), AD: Number(data.AD), ReD: Number(data.ReD), CdC: Number(data.CdC), CC: Number(data.CC), AN: Number(data.AN) };
        const charCaracStock = Object.fromEntries(Object.entries(newEffectCharCarac).filter(([, value]) => value !== 0));
        const combatStatsStock = Object.fromEntries(Object.entries(newEffectCombatStats).filter(([, value]) => value !== 0));
        const dotStock = Number(data.Dot) !== 0 ? Number(data.Dot) : null;
        const hotStock = Number(data.Hot) !== 0 ? Number(data.Hot) : null;

        if (Object.keys(charCaracStock).length > 0 || Object.keys(combatStatsStock).length > 0 || dotStock !== null || hotStock !== null) {
            newEffect.Effect = {
                ...(Object.keys(charCaracStock).length > 0 && { CharCaracteristics: charCaracStock }),
                ...(Object.keys(combatStatsStock).length > 0 && { CombatStats: combatStatsStock }),
                ...(dotStock !== null && { Dot: dotStock }),
                ...(hotStock !== null && { Hot: hotStock })
            };
        }

        const updatedCharData = addEffect(toUpdateCharData, newEffect, effectType);
        setCharData(charData.map((char) => char.Id === toUpdateCharData.Id ? updatedCharData : char));
        handleModalClose();
    }

    function handleModalClose(){
        reset();
        setShowCustomEffectModal(false);
    }

    return (
        <>
            <button onClick={() => setShowCustomEffectModal(true)} title="Add Effect" className='text-green-500 hover:text-white hover:bg-green-500 rounded cursor-pointer transition-all'><BsBookmarkPlusFill size={32}/></button>
            {
                (showCustomEffectModal)
                    ?   <Modal isOpen={showCustomEffectModal} onClose={() => handleModalClose()}>
                            <div className='flex flex-col gap-2'>
                                <h2 className='text-xl text-center'>Add new effect to : {toUpdateCharData.Name}</h2>
                                <div className='input_entry'>
                                    <h3 className='input_label'>Effect Type :</h3>
                                    <div className='input_field flex justify-center gap-2'>
                                        <label htmlFor='radio_buff'>Buff</label>
                                        <input type='radio' id="radio_buff" name="effect_type" checked={effectType === 'Buff'} onChange={() => setEffectType('Buff')} />
                                    </div>
                                    <div className='input_field flex justify-center gap-2'>
                                        <label htmlFor='radio_debuff'>Debuff</label>
                                        <input type='radio' id="radio_debuff" name="effect_type" checked={effectType === 'Debuff'} onChange={() => setEffectType('Debuff')} />
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                                    <div className='input_entry'>
                                        <label className='input_label' htmlFor='name'>Name</label>
                                        <input id='name' {...register('Name')} placeholder='Enter Effect Name here' className='input_field p-1'/>
                                    </div>
                                    <div className='input_entry !flex-col'>
                                        <label className='input_label' htmlFor='desc'>Description</label>
                                        <input id='desc' {...register('Desc')} placeholder='Enter Effect Description here' className='input_field'/>
                                    </div>
                                    <h2 className='text-center text-xl'>Effets : </h2>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <div className='input_group'>
                                            {['STR', 'END', 'AGI', 'MANA', 'MGK', 'LUK', 'SPD'].map((prop) => (
                                                <div key={prop} className='input_entry'>
                                                    <label className='input_label' htmlFor={prop.toLowerCase()}>{prop}</label>
                                                    <input id={prop.toLowerCase()} type='number' {...register(prop as keyof EffectFormInputInterface)} defaultValue={0} className='input_field' />
                                                </div>
                                            ))}
                                        </div>
                                        <div className='input_group'>
                                            {['Ini', 'SA', 'AA', 'DMG', 'PA', 'SD', 'AD', 'ReD', 'CdC', 'CC', 'AN'].map((prop) => (
                                                <div key={prop} className='input_entry'>
                                                    <label className='input_label' htmlFor={prop.toLowerCase()}>{prop}</label>
                                                    <input id={prop.toLowerCase()} type='number' {...register(prop as keyof EffectFormInputInterface)} defaultValue={0} className='input_field' />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='input_entry'>
                                        <label className='input_label' htmlFor='dot'>Dot</label>
                                        <input id='dot' type='number' {...register('Dot')} defaultValue={0} className='input_field'/>
                                    </div>
                                    <div className='input_entry'>
                                        <label className='input_label' htmlFor='hot'>Hot</label>
                                        <input id='hot' type='number' {...register('Hot')} defaultValue={0} className='input_field'/>
                                    </div>
                                                
                                    <div className='flex justify-around items-center'>
                                        <button type="submit" className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer'>Submit</button>
                                        <button type="button" onClick={() => handleModalClose()} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                    : <></>
            }
        </>
    );
};