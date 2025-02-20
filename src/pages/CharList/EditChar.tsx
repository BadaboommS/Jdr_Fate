import { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DataContext } from "../../context/DataContext";
import { CharStatsInterface, CreateCharFormInputInterface, CombatStatsTitle, CharTypeArray, ServantVariantArray, WeaponTypeArray, CharCaracteristicsArray, CharCaracteristicsKeyArray, CharCombatStatsArray } from "../../types/statsType";
import { applyCombatStatsEffect } from "../../function/FightCalc";
import { caracToStatsCalc } from "../../function/BaseStatsCalc";

interface EditCharPropsInterface {
    charStats: CharStatsInterface;
    handleSetEdit?: () => void | undefined;
    handleCloseModal: () => void;
    handleDeleteChar?: (charId: number) => void | undefined;
}

export function EditChar ({ charStats, handleSetEdit = undefined, handleCloseModal, handleDeleteChar = undefined }: EditCharPropsInterface) {
    const { charData, setCharData } = useContext( DataContext );
    const [showVariant, setShowVariant] = useState(charStats.Type === "Servant");

    const { register, handleSubmit, reset, watch, setValue, getValues } = useForm<CreateCharFormInputInterface>({
        defaultValues: {
            Name: charStats.Name, Joueur: charStats.Joueur, Type: charStats.Type, Variant: charStats.Variant,
            WeaponName: charStats.Weapon.WeaponName, WeaponDmg: charStats.Weapon.WeaponDmg, WeaponType: charStats.Weapon.WeaponType,
            Hp: charStats.Hp, Mana: charStats.Mana, Armor: charStats.Armor, MaxFightStyleAmount: charStats.MaxFightStyleAmount,
            BuffsList: charStats.BuffsList, DebuffsList: charStats.DebuffsList            
        }
    });

    const onSubmit: SubmitHandler<CreateCharFormInputInterface> = (data) => {
        if(!window.confirm(`Confirmer l'Edit du character ?`)){ return;} ;

        const { Name, Joueur, Type, Hp, Mana, WeaponName, WeaponDmg, WeaponType, Armor, MaxFightStyleAmount, Variant, STR, END, AGI, MANA, MGK, LUK, SPD, STROverload, ENDOverload, AGIOverload, MANAOverload, MGKOverload, LUKOverload, SPDOverload, Ini, SA, AA, DMG, PA, SD, AD, ReD, CdC, CC, AN } = data;
        const newCharacterData: CharStatsInterface = {
            Id: charStats.Id, Name, Joueur, Type,
            Weapon: { WeaponName, WeaponDmg, WeaponType },
            Hp: Number(Hp), InitHp: Number(Hp), Mana: Number(Mana), InitMana: Number(Mana), Armor, MaxFightStyleAmount: MaxFightStyleAmount,
            Caracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD },
            InitCaracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD },
            CustomCaracteristicsValue: getCustomValues(),
            CaracteristicsBuff: charStats.CaracteristicsBuff,
            CaracteristicsOverload: { STR: Number(STROverload), END: Number(ENDOverload), AGI: Number(AGIOverload), MANA: Number(MANAOverload), MGK: Number(MGKOverload), LUK: Number(LUKOverload), SPD: Number(SPDOverload) },
            CombatStats: { Ini: Number(Ini), SA: Number(SA), AA: Number(AA), DMG: Number(DMG), PA: Number(PA), SD: Number(SD), AD: Number(AD), ReD: Number(ReD), CdC: Number(CdC), CC: Number(CC), AN: Number(AN) },
            InitCombatStats: { Ini: Number(Ini), SA: Number(SA), AA: Number(AA), DMG: Number(DMG), PA: Number(PA), SD: Number(SD), AD: Number(AD), ReD: Number(ReD), CdC: Number(CdC), CC: Number(CC), AN: Number(AN) },
            BuffsList: charStats.BuffsList.map(buff => ({ ...buff, Applied: false })), // remove applied from all buffs
            DebuffsList: charStats.DebuffsList.map(debuff => ({ ...debuff, Applied: false })), // remove applied from all debuffs
            FightStyleList: charStats.FightStyleList,
            TurnEffect: charStats.TurnEffect,
            CharSpeed: charStats.CharSpeed,
            ...(showVariant && { Variant })
        };

        const effectUpdatedCharData = applyCombatStatsEffect(newCharacterData);
        setCharData(charData.map(char => char.Id === charStats.Id ? effectUpdatedCharData : char));
    }

    function handleUpdateCombatStats(){
            const CARACS = { STR: getValues("STR"), END: getValues("END"), AGI: getValues("AGI"), MANA: getValues("MANA"), MGK: getValues("MGK"), LUK: getValues("LUK"), SPD: getValues("SPD") };
            const customValues = getCustomValues();
            const CaracOverload = { STR: getValues("STROverload"), END: getValues("ENDOverload"), AGI: getValues("AGIOverload"), MANA: getValues("MANAOverload"), MGK: getValues("MGKOverload"), LUK: getValues("LUKOverload"), SPD: getValues("SPDOverload") };
            const CARAC_VALUES = caracToStatsCalc(CARACS, customValues, Number(getValues('Armor')), CaracOverload);
            Object.entries(CARAC_VALUES).forEach(([key, value]) => {
                if(key !== "Hp" && key !== "Mana") setValue(key as keyof CreateCharFormInputInterface, value);
            });
            setValue("CharSpeed", CARAC_VALUES.CharSpeed);
        }

    function getCustomValues() {
        const customInputs = document.querySelectorAll('input[id$="_custom_value"]');
        const values: Record<string, string> = {};

        customInputs.forEach(input => {
            const inputElement = input as HTMLInputElement;
            if(inputElement.value.trim() !== '') values[inputElement.id.split('_')[0]] = inputElement.value.trim();
        });
        return values;
    }

    function handleReset(){
        setShowVariant(false);
        reset();
        if(handleSetEdit) { handleSetEdit(); };
    }

    return (
        <>
            <div className="flex flex-col gap-2 items-center">
                {(handleDeleteChar !== undefined && <button type="button" className="bg-red-500 hover:bg-white text-white hover:text-red-500 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer transition-all" onClick={() => handleDeleteChar(charStats.Id)}>Delete</button>)}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-[#DFDDCF] text-[#E0E1E4] flex flex-col justify-center p-4 gap-2">
                    <h2 className="font-bold text-xl text-black">Attention: Le mode Edit modifie les valeurs de bases du personnage et non pas les valeurs actuelles.</h2>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="input_group">
                            <div className="flex flex-row input_entry">
                                <label htmlFor="input_name" className="input_label">Name :</label>
                                <input {...register("Name", {required: "Enter a Name !"})} id="input_name" placeholder="Nom" className="input_field" autoComplete="false"/>
                            </div>
                            <div className="flex flex-row input_entry">
                                <label htmlFor="input_joueur" className="input_label">Joueur :</label>
                                <input {...register("Joueur", {required: "Enter a Joueur !"})} id="input_joueur" placeholder="Joueur" className="input_field" />
                            </div>
                            <div className="flex flex-row input_entry">
                                <label htmlFor="input_type" className="input_label">Character Type :</label>
                                <select {...register("Type")} id="input_type" onChange={(e) => e.target.value === "Servant"? setShowVariant(true): setShowVariant(false)} className="input_field">
                                    {CharTypeArray.map((value) => (
                                        <option key={value} value={value}>{value}</option>
                                    ))}
                                </select>
                                {(showVariant) && 
                                <select {...register("Variant")} id="input_variant" className="input_field !indent-1">
                                    {ServantVariantArray.map((variant) => (
                                        <option key={variant} value={variant}>{variant}</option>
                                    ))}
                                </select>
                                }
                            </div>
                            <div className="input_entry">
                                <label htmlFor="input_weapon_name" className="input_label">Arme :</label>
                                <input {...register("WeaponName", {required: "Enter a Valid Arme !"})} placeholder="Nom arme" id="input_weapon_name" className="input_field" autoComplete="false"/>
                            </div>
                            <div className="input_entry">
                                <label htmlFor="input_weapon_type" className="input_label">Type Arme :</label>
                                <select {...register("WeaponType")} id="input_weapon_type" className="input_field">
                                    {WeaponTypeArray.map((weaponType) => (
                                        <option key={weaponType} value={weaponType}>{weaponType}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input_entry">
                                <label htmlFor="input_weapon_dmg" className="input_label">Arme Dmg :</label>
                                <input type="number" {...register("WeaponDmg", {required: "Enter a Valid WeaponDmg Amount !"})} id="input_weapon_dmg" className="input_field" />
                            </div>
                            <div className="input_entry">
                                <label htmlFor="input_Armor" className="input_label">Armure :</label>
                                <input type="number" {...register("Armor", {required: "Enter a Valid ArmeDMG Amount !"})} id="input_Armor" className="input_field" />
                            </div>
                            <div className="input_entry">
                                <label htmlFor="input_stance_number" className="input_label">Nombre de stance :</label>
                                <input type="number" {...register("MaxFightStyleAmount", {required: "Enter a Valid WeaponDmg Amount !", min: 0, max: 3})} id="input_stance_number" className="input_field" />
                            </div>
                            {CharCaracteristicsArray.map((stat) => (
                                <div className="input_entry" key={stat}>
                                    <label htmlFor={`input_${stat.toLowerCase()}`} className="input_label">{stat} :</label>
                                    <select {...register(stat as keyof CreateCharFormInputInterface, { required: `Enter a Valid ${stat} Amount !`})} defaultValue={charStats.Caracteristics[stat as keyof typeof charStats.Caracteristics]} className="input_field">
                                        {CharCaracteristicsKeyArray.map((value) => {
                                            return <option key={`${stat}_${value}`} value={value}>{value}</option>
                                        })}
                                    </select>
                                    {(watch(stat as keyof CreateCharFormInputInterface) === 'EX' || watch(stat as keyof CreateCharFormInputInterface) === 'S') && 
                                        <input type="number" id={`${stat}_custom_value`} className="input_field" placeholder={`Enter ${watch(stat as keyof CreateCharFormInputInterface)} value`} defaultValue={charStats.CustomCaracteristicsValue[stat as keyof typeof charStats.CustomCaracteristicsValue]} required />
                                    }
                                    <input type="number" {...register(`${stat}Overload` as keyof CreateCharFormInputInterface, { required: `Enter a Valid ${stat} Amount !`})} className="input_field cursor-help" defaultValue={charStats.CaracteristicsOverload[stat as keyof typeof charStats.CaracteristicsOverload]} title="Nombre de + ou - à la Caracteristique"/>
                                </div>
                            ))}
                        </div>
                        {
                            (showVariant)
                            ?   <div>
                                    <img src={`./assets/servant_img/${watch("Variant") === undefined? "Archer" : watch("Variant")}.png`} className="w-fit h-fit variant_img"/>
                                </div>
                            : <></>
                        }
                        <div className="input_group">
                            <div className="input_entry">
                                <label htmlFor="input_hp" className="input_label">Hp :</label>
                                <input type="number" {...register("Hp", {required: "Enter a Valid Hp Amount !"})} id="input_hp" className="input_field" />
                            </div>
                            <div className="input_entry">
                                <label htmlFor="input_mana2" className="input_label">Mana :</label>
                                <input type="number" {...register("Mana", {required: "Enter a Valid Mana Amount !"})} id="input_mana2" className="input_field" />
                            </div>
                            {CharCombatStatsArray.map((stat) => {
                                return  <div className="input_entry" key={stat}>
                                            <label htmlFor={`input_${stat.toLowerCase()}`} className="input_label cursor-help" title={CombatStatsTitle[stat as keyof typeof CombatStatsTitle]}>{stat} :</label>
                                            <input type="number" {...register(stat as keyof CreateCharFormInputInterface, { required: `Enter a Valid ${stat} Amount !` })} defaultValue={charStats.CombatStats[stat as keyof typeof charStats.CombatStats]} id={`input_${stat.toLowerCase()}`} className="input_field" />
                                        </div>
                            })}
                        </div>
                    </div>
                    <div className="flex justify-center py-5">
                        <div className="min-w-80 flex justify-around">
                            <button type="submit" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Update</button>
                            <button type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer" onClick={() => handleUpdateCombatStats()}>Update Combat Stats</button>
                            {(handleSetEdit !== undefined && <button type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer" onClick={() => handleReset()}>Cancel Edit</button>)}
                            <button type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer" onClick={() => handleCloseModal()}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};