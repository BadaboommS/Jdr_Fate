import { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DataContext } from "../../context/DataContext";
import { CharStatsInterface, CreateCharFormInputInterface, CharTypeArray, ServantVariantArray, WeaponTypeArray, CharCaracteristicsArray, CharCaracteristicsKeyArray, CharStatsCaracteristicsInterface } from "../../types/statsType";
import { caracToStatsCalc } from "../../function/BaseStatsCalc";
import { applyAllEffect } from "../../function/FightCalc";

interface EditCharPropsInterface {
    charStats: CharStatsInterface;
    handleSetEdit?: () => void | undefined;
    handleCloseModal: () => void;
    handleDeleteChar?: (charId: number) => void | undefined;
}

export function EditChar ({ charStats, handleSetEdit = undefined, handleCloseModal, handleDeleteChar = undefined }: EditCharPropsInterface) {
    const { charData, setCharData } = useContext( DataContext );
    const [showVariant, setShowVariant] = useState(charStats.Type === "Servant");

    const { register, handleSubmit, reset, watch, getValues } = useForm<CreateCharFormInputInterface>({
        defaultValues: {
            Name: charStats.Name, Joueur: charStats.Joueur, Type: charStats.Type, Variant: charStats.Variant,
            WeaponName: charStats.Weapon.WeaponName, WeaponDmg: charStats.Weapon.WeaponDmg, WeaponType: charStats.Weapon.WeaponType,
            Hp: charStats.InitHp, Mana: charStats.InitMana, Armor: charStats.Armor, MaxFightStyleAmount: charStats.MaxFightStyleAmount
        }
    });

    const onSubmit: SubmitHandler<CreateCharFormInputInterface> = (data) => {
        if(!window.confirm(`Confirmer l'Edit du character ?`)){ return;} ;

        const { Name, Joueur, Type, Hp, Mana, WeaponName, WeaponDmg, WeaponType, Armor, MaxFightStyleAmount, Variant, STR, END, AGI, MANA, MGK, LUK, SPD, STROverload, ENDOverload, AGIOverload, MANAOverload, MGKOverload, LUKOverload, SPDOverload } = data;
        
        // Update effect if Carac / Armor / WeaponDmg are modified
        const newCaracteristics = { STR, END, AGI, MANA, MGK, LUK, SPD };
        let newCombatStats = charStats.InitCombatStats;
        let newCharSpeed = charStats.CharSpeed;
        if(Object.keys(newCaracteristics).some(key => newCaracteristics[key as keyof typeof charStats.Caracteristics] !== charStats.Caracteristics[key as keyof typeof charStats.Caracteristics] ||
            charStats.Armor !== Armor ||
            charStats.Weapon.WeaponDmg !== WeaponDmg
        )){
            newCombatStats = handleUpdateCombatStats().CombatStats;
            newCharSpeed = handleUpdateCombatStats().CharSpeed;
        }

        // Update Hp / Mana if modified
        const newInitHp = Hp;
        const newInitMana = Mana;
        let newHp = charStats.Hp;
        let newMana = charStats.Mana;
        if(charStats.InitHp !== newInitHp){ newHp = newInitHp - (charStats.InitHp - charStats.Hp); };
        if(charStats.InitMana !== newInitMana){ newMana = newInitMana - (charStats.InitMana - charStats.Mana); };

        const newCharacterData: CharStatsInterface = {
            Id: charStats.Id, Name, Joueur, Type,
            Weapon: { WeaponName, WeaponDmg, WeaponType },
            Hp: newHp, InitHp: newInitHp, Mana: newMana, InitMana: newInitMana,
            Armor, MaxFightStyleAmount: MaxFightStyleAmount,
            Caracteristics: newCaracteristics,
            InitCaracteristics: newCaracteristics,
            CustomCaracteristicsValue: getCustomValues(),
            CaracteristicsBuff: charStats.CaracteristicsBuff,
            CaracteristicsOverload: { capacity: {STR: STROverload, END: ENDOverload, AGI: AGIOverload, MANA: MANAOverload, MGK: MGKOverload, LUK: LUKOverload, SPD: SPDOverload}, active: { STR: 0, END: 0, AGI: 0, MANA: 0, MGK: 0, LUK: 0, SPD: 0 } },
            CombatStats: newCombatStats,
            InitCombatStats: newCombatStats,
            BuffsList: charStats.BuffsList,
            DebuffsList: charStats.DebuffsList,
            FightStyleList: charStats.FightStyleList,
            TurnEffect: charStats.TurnEffect,
            CharSpeed: newCharSpeed,
            ...(showVariant && { Variant })
        };

        const appliedEffectData = applyAllEffect(newCharacterData, true);
        setCharData(charData.map(char => char.Id === charStats.Id ? appliedEffectData : char));
    }

    function handleUpdateCombatStats(){
            const CARACS = { STR: getValues("STR"), END: getValues("END"), AGI: getValues("AGI"), MANA: getValues("MANA"), MGK: getValues("MGK"), LUK: getValues("LUK"), SPD: getValues("SPD") };
            const customValues = getCustomValues();
            const CaracOverload = { STR: getValues("STROverload"), END: getValues("ENDOverload"), AGI: getValues("AGIOverload"), MANA: getValues("MANAOverload"), MGK: getValues("MGKOverload"), LUK: getValues("LUKOverload"), SPD: getValues("SPDOverload") };
            const CARAC_VALUES = caracToStatsCalc(CARACS, customValues, Number(getValues('Armor')), CaracOverload);
            return { CombatStats: { Ini: CARAC_VALUES.Ini, SA: CARAC_VALUES.SA, AA: CARAC_VALUES.AA, DMG: CARAC_VALUES.DMG, PA: CARAC_VALUES.PA, SD: CARAC_VALUES.SD, AD: CARAC_VALUES.AD, ReD: CARAC_VALUES.ReD, CdC: CARAC_VALUES.CdC, CC: CARAC_VALUES.CC, AN: CARAC_VALUES.AN }, CharSpeed: CARAC_VALUES.CharSpeed };
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
                    <div className={`grid ${showVariant? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
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
                                <input type="number" {...register("WeaponDmg", {required: "Enter a Valid WeaponDmg Amount !", valueAsNumber: true })} id="input_weapon_dmg" className="input_field" />
                            </div>
                            <div className="input_entry">
                                <label htmlFor="input_Armor" className="input_label">Armure :</label>
                                <input type="number" {...register("Armor", {required: "Enter a Valid Armor Amount !", valueAsNumber: true})} id="input_Armor" className="input_field" />
                            </div>
                            <div className="input_entry">
                                <label htmlFor="input_stance_number" className="input_label">Nombre de stance :</label>
                                <input type="number" {...register("MaxFightStyleAmount", {required: "Enter a Valid WeaponDmg Amount !", min: 0, max: 3, valueAsNumber: true})} id="input_stance_number" className="input_field" />
                            </div>
                        </div>
                        {
                            (showVariant)
                            ?   <div className="flex justify-center">
                                    <img src={`./assets/servant_img/${watch("Variant") === undefined? "Archer" : watch("Variant")}.png`} className="w-fit h-fit variant_img"/>
                                </div>
                            : <></>
                        }
                        <div className="input_group">
                            <div className="input_entry">
                                <label htmlFor="input_hp" className="input_label">Hp :</label>
                                <input type="number" {...register("Hp", {required: "Enter a Valid Hp Amount !", valueAsNumber: true})} id="input_hp" className="input_field" />
                            </div>
                            <div className="input_entry">
                                <label htmlFor="input_mana2" className="input_label">Mana :</label>
                                <input type="number" {...register("Mana", {required: "Enter a Valid Mana Amount !", valueAsNumber: true})} id="input_mana2" className="input_field" />
                            </div>
                            {CharCaracteristicsArray.map((stat) => (
                                <div className="input_entry" key={stat}>
                                    <label htmlFor={`input_${stat.toLowerCase()}`} className="input_label">{stat} :</label>
                                    <select {...register(stat as keyof CreateCharFormInputInterface, { required: `Enter a Valid ${stat} Amount !`})} id={`input_${stat.toLowerCase()}`} defaultValue={charStats.InitCaracteristics[stat as keyof typeof charStats.InitCaracteristics]} className="input_field">
                                        {CharCaracteristicsKeyArray.map((value) => {
                                            return <option key={`${stat}_${value}`} value={value}>{value}</option>
                                        })}
                                    </select>
                                    {((watch(stat as keyof CreateCharFormInputInterface) === 'EX' || watch(stat as keyof CreateCharFormInputInterface) === 'S') || 
                                    (handleSetEdit && (charStats.Caracteristics[stat as keyof CharStatsCaracteristicsInterface] === 'EX' || charStats.Caracteristics[stat as keyof CharStatsCaracteristicsInterface] === 'S')))
                                        && <input type="number" id={`${stat}_custom_value`} className="input_field cursor-help" placeholder={`Enter ${watch(stat as keyof CreateCharFormInputInterface)} value`} defaultValue={charStats.CustomCaracteristicsValue[stat as keyof typeof charStats.CustomCaracteristicsValue]} title="Valeur du parametre" required />
                                    }
                                    <input type="number" {...register(`${stat}Overload` as keyof CreateCharFormInputInterface, { required: `Enter a Valid ${stat} Amount !`, valueAsNumber: true})} className="input_field cursor-help" defaultValue={charStats.CaracteristicsOverload.capacity[stat as keyof typeof charStats.CaracteristicsOverload.capacity]} title="Nombre de + ou - à la Caracteristique"/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center py-5">
                        <div className="min-w-80 flex justify-around">
                            <button type="submit" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Update</button>
                            {(handleSetEdit !== undefined && <button type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer" onClick={() => handleReset()}>Cancel Edit</button>)}
                            <button type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer" onClick={() => handleCloseModal()}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};