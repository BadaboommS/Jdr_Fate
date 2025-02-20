import { useContext, useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaEdit } from "react-icons/fa";
import { BsBookmarkPlusFill } from 'react-icons/bs';
import { DataContext } from '../../../../context/DataContext';
import { Modal } from '../../../../global/Modal';
import { CharBuffInterface, CharCaracteristicsArray, CharCombatStatsArray, CharStatsInterface, EffectFormInputInterface } from '../../../../types/statsType';
import { addEffect, removeEffect } from '../../../../function/FightCalc';
import { EffectPresetArray } from '../../../../data/EffectPreset';

interface AddCustomEffectFormProps {
    toUpdateCharData: CharStatsInterface;
    handleHistoryEventAdd?: (msg: string, type: string, title?: string) => void,
    toEdit?: CharBuffInterface;
    toEditEffectType?: "Buff" | "Debuff";
}

export function CustomEffectFormModal ({ toUpdateCharData, handleHistoryEventAdd, toEdit, toEditEffectType }: AddCustomEffectFormProps) {
    const { charData, setCharData } = useContext(DataContext);
    const [showCustomEffectModal, setShowCustomEffectModal] = useState(false);
    const [effectType, setEffectType] = useState<"Buff" | "Debuff">('Buff');
    const [filteredPresetList, setFilteredPressetList] = useState<string[]>([]);
    const [filterQuery, setFilterQuery] = useState('');
    const { register, handleSubmit, reset, setValue } = useForm<EffectFormInputInterface>({ defaultValues: { Name: '', Desc: '', STR: 0, END: 0, AGI: 0, MANA: 0, MGK: 0, LUK: 0, SPD: 0, Ini: 0, SA: 0, AA: 0, DMG: 0, PA: 0, SD: 0, AD: 0, ReD: 0, CdC: 0, CC: 0, AN: 0, Dot: 0, Hot: 0 } });

    useEffect(() => {
        if(filterQuery !== ''){
            const filteredList = EffectPresetArray.filter((effect) => effect.Name.toLowerCase().includes(filterQuery.toLowerCase())).map((effect) => effect.Name);
            setFilteredPressetList(filteredList)
        }else{
            setFilteredPressetList(EffectPresetArray.map((effect) => effect.Name));
        }
    }, [filterQuery])

    useEffect(() => {
        if (toEdit && showCustomEffectModal) {
            if(toEditEffectType !== undefined) setEffectType(toEditEffectType);
            setValue('Name', toEdit.Name);
            setValue('Desc', toEdit.Desc);
            if (toEdit.Effect) {
                Object.entries(toEdit.Effect.CaracteristicsBuff || {}).forEach(([key, value]) => setValue(key as keyof EffectFormInputInterface, value));
                Object.entries(toEdit.Effect.CombatStats || {}).forEach(([key, value]) => setValue(key as keyof EffectFormInputInterface, value));
                if (toEdit.Effect.TurnEffect?.Dot) setValue('Dot', toEdit.Effect.TurnEffect.Dot);
                if (toEdit.Effect.TurnEffect?.Hot) setValue('Hot', toEdit.Effect.TurnEffect.Hot);
            }
        }
    }, [toEdit, setValue, toEditEffectType, showCustomEffectModal]);

    const onSubmit: SubmitHandler<EffectFormInputInterface> = (data) => {
        if(!window.confirm(`Confirmer l'atout de ${data.Name} ?`)){ return; };
        
        // Remove effect if edit
        let effectRemovedCharData = null;
        if(toEdit && toEditEffectType){ effectRemovedCharData = removeEffect(toUpdateCharData, toEdit, toEditEffectType); };
        const toUpdateData = effectRemovedCharData !== null? effectRemovedCharData : toUpdateCharData;
        
        const effectList = (effectType === "Buff")? toUpdateData.BuffsList : toUpdateData.DebuffsList;
        const newEffect: CharBuffInterface = {
            Id: toEdit ? toEdit.Id : (effectList[0] ? effectList[effectList.length - 1].Id + 1 : 0),
            Name: data.Name,
            Desc: data.Desc
        };

        const { STR, END, AGI, MGK, LUK, SPD, Ini, SA, AA, DMG, PA, SD, AD, ReD, CdC, CC, AN, Dot, Hot } = data;
        const newEffectCharCarac = { STR: Number(STR), END: Number(END), AGI: Number(AGI), MGK: Number(MGK), LUK: Number(LUK), SPD: Number(SPD) };
        const newEffectCombatStats = { Ini: Number(Ini), SA: Number(SA), AA: Number(AA), DMG: Number(DMG), PA: Number(PA), SD: Number(SD), AD: Number(AD), ReD: Number(ReD), CdC: Number(CdC), CC: Number(CC), AN: Number(AN) };
        const charCaracStock = Object.fromEntries(Object.entries(newEffectCharCarac).filter(([, value]) => value !== 0));
        const combatStatsStock = Object.fromEntries(Object.entries(newEffectCombatStats).filter(([, value]) => value !== 0));
        const dotStock = Number(Dot) !== 0 ? Number(Dot) : null;
        const hotStock = Number(Hot) !== 0 ? Number(Hot) : null;

        if (Object.keys(charCaracStock).length > 0 || Object.keys(combatStatsStock).length > 0 || dotStock !== null || hotStock !== null) {
            newEffect.Effect = {
                ...(Object.keys(charCaracStock).length > 0 && { CaracteristicsBuff: charCaracStock }),
                ...(Object.keys(combatStatsStock).length > 0 && { CombatStats: combatStatsStock }),
                ...(dotStock !== null && { Dot: dotStock }),
                ...(hotStock !== null && { Hot: hotStock })
            };
        }
        if(handleHistoryEventAdd) handleHistoryEventAdd(`${toUpdateCharData.Name} a reçu l'effet ${newEffect.Name}.`, 'Text');
        const updatedCharData = addEffect(toUpdateData, newEffect, effectType);
        setCharData(charData.map((char) => char.Id === toUpdateData.Id ? updatedCharData : char));
        handleModalClose();
    }

    function handlePresetSetting(presetName: string){
        const presetData = EffectPresetArray.find((effect) => effect.Name === presetName);
        if (!presetData) {
            reset();
            setEffectType('Buff');
            return;
        }

        setEffectType(presetData.EffectType);
        setValue("Name", presetData.Name);
        setValue("Desc", presetData.Desc);
        ['STR', 'END', 'AGI', 'MANA', 'MGK', 'LUK', 'SPD'].forEach((carac) => setValue(carac as keyof EffectFormInputInterface, presetData.Effect?.CaracteristicsBuff?.[carac as keyof typeof presetData.Effect.CaracteristicsBuff] ?? 0));
        ['Ini', 'SA', 'AA', 'DMG', 'PA', 'SD', 'AD', 'ReD', 'CdC', 'CC', 'AN'].forEach((stat) => setValue(stat as keyof EffectFormInputInterface, presetData.Effect?.CombatStats?.[stat as keyof typeof presetData.Effect.CombatStats] ?? 0));
        setValue("Dot", presetData.Effect?.TurnEffect?.Dot || 0);
        setValue("Hot", presetData.Effect?.TurnEffect?.Hot || 0);
        setFilterQuery('');
    }

    function handleModalClose(){
        reset();
        setShowCustomEffectModal(false);
    }

    return (
        <>
            <button onClick={() => setShowCustomEffectModal(true)} title={toEdit? "Edit effect" : "Add Effect"} className={toEdit? 'text-white bg-green-500 hover:text-green-500 hover:bg-white cursor-pointer transition-all border border-black' : 'text-green-500 hover:bg-green-500 hover:text-white cursor-pointer rounded transition-all'}>
                {(toEdit? <FaEdit size={24} className='m-1'/> : <BsBookmarkPlusFill size={32} />)}
                </button>
            {
                (showCustomEffectModal)
                    ?   <Modal isOpen={showCustomEffectModal} onClose={() => handleModalClose()}>
                            <div className='flex flex-col gap-2 min-w-full>'>
                                <h2 className='text-xl text-center'>{toEdit ? `Edit effect: ${toEdit.Name}` : `Add new effect to: ${toUpdateCharData.Name}`}</h2>
                                <div className='input_entry'>
                                    <label htmlFor="preset_select" className='input_label'>Effect Preset: </label>
                                    <div className='w-full'>
                                        <input id="preset_select" className='input_field' list="filteredPresetList" placeholder="Filtre Preset" value={filterQuery} onChange={(e) => setFilterQuery(e.currentTarget.value)} />
                                        {filteredPresetList.length > 0 && filterQuery !== '' && (
                                            <div className="absolute mt-1 bg-white border shadow-lg rounded-lg">
                                            {filteredPresetList.map((presetName, index) => (
                                                <div
                                                    key={`${presetName}_${index}`}
                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handlePresetSetting(presetName)}
                                                >
                                                {presetName}
                                                </div>
                                            ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
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
                                        <input id='name' {...register("Name", {required: "Enter a Name !"})} placeholder='Enter Effect Name here' className='input_field p-1' autoComplete='false'/>
                                    </div>
                                    <div className='input_entry !flex-col'>
                                        <label className='input_label' htmlFor='desc'>Description</label>
                                        <input id='desc' {...register('Desc', {required: "Enter a Description !"})} placeholder='Enter Effect Description here' className='input_field' autoComplete='false' />
                                    </div>
                                    <h2 className='text-center text-xl'>Effets : </h2>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <div className='input_group'>
                                            {CharCaracteristicsArray.map((prop) => (
                                                <div key={prop} className='input_entry'>
                                                    <label className='input_label' htmlFor={prop.toLowerCase()}>{prop}</label>
                                                    <input id={prop.toLowerCase()} type='number' {...register(prop as keyof EffectFormInputInterface)} defaultValue={0} className='input_field' />
                                                </div>
                                            ))}
                                            <div className='input_group pt-2'>
                                                <div className='input_entry'>
                                                    <label className='input_label' htmlFor='dot'>Dot</label>
                                                    <input id='dot' type='number' {...register('Dot')} defaultValue={0} className='input_field'/>
                                                </div>
                                                <div className='input_entry'>
                                                    <label className='input_label' htmlFor='hot'>Hot</label>
                                                    <input id='hot' type='number' {...register('Hot')} defaultValue={0} className='input_field'/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='input_group'>
                                            {CharCombatStatsArray.map((prop) => (
                                                <div key={prop} className='input_entry'>
                                                    <label className='input_label' htmlFor={prop.toLowerCase()}>{prop}</label>
                                                    <input id={prop.toLowerCase()} type='number' {...register(prop as keyof EffectFormInputInterface)} defaultValue={0} className='input_field' />
                                                </div>
                                            ))}
                                        </div>
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