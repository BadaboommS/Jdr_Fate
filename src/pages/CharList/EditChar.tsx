import { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DataContext } from "../../context/DataContext";
import { CharStatsInterface, CreateCharFormInputInterface, CombatStatsTitle, StatKey, StatKeyArray } from "../../types/statsType";
import { applyCombatStatsEffect } from "../../function/FightCalc";

interface EditCharPropsInterface {
    charStats: CharStatsInterface;
    handleSetEdit?: () => void | undefined;
    handleCloseModal: () => void;
    handleDeleteChar?: (charId: number) => void | undefined;
}

export function EditChar ({ charStats, handleSetEdit = undefined, handleCloseModal, handleDeleteChar = undefined }: EditCharPropsInterface) {
    const { charData, setCharData } = useContext( DataContext );
    const [showVariant, setShowVariant] = useState(charStats.Type === "Servant");

    const { register, handleSubmit, reset, watch } = useForm<CreateCharFormInputInterface>({
        defaultValues: {
            Name: charStats.Name, Joueur: charStats.Joueur, Type: charStats.Type, Variant: charStats.Variant,
            WeaponName: charStats.Weapon.WeaponName, WeaponDmg: charStats.Weapon.WeaponDmg, WeaponType: charStats.Weapon.WeaponType,
            Armor: charStats.Armor, Hp: charStats.Hp, Mana: charStats.Mana,
            STR: charStats.Caracteristics.STR, END: charStats.Caracteristics.END, AGI: charStats.Caracteristics.AGI, MANA: charStats.Caracteristics.MANA, MGK: charStats.Caracteristics.MGK, LUK: charStats.Caracteristics.LUK, SPD: charStats.Caracteristics.SPD,
            BuffsList: charStats.BuffsList, DebuffsList: charStats.DebuffsList            
        }
    });

    const onSubmit: SubmitHandler<CreateCharFormInputInterface> = (data) => {
        if(!window.confirm(`Confirmer l'Edit du character ?`)){ return;} ;

        const { Name, Joueur, Type, Hp, Mana, WeaponName, WeaponDmg, WeaponType, Armor, Variant, STR, END, AGI, MANA, MGK, LUK, SPD, Ini, SA, AA, DMG, PA, SD, AD, ReD, CdC, CC, AN } = data;
        const newCharacterData: CharStatsInterface = {
            Id: charStats.Id, Name, Joueur, Type,
            Weapon: { WeaponName, WeaponDmg, WeaponType },
            Armor, Hp: Number(Hp), InitHp: Number(Hp), Mana: Number(Mana), InitMana: Number(Mana),
            InitCaracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD },
            InitCombatStats: { Ini: Number(Ini), SA: Number(SA), AA: Number(AA), DMG: Number(DMG), PA: Number(PA), SD: Number(SD), AD: Number(AD), ReD: Number(ReD), CdC: Number(CdC), CC: Number(CC), AN: Number(AN) },
            Caracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD },
            CombatStats: { Ini: Number(Ini), SA: Number(SA), AA: Number(AA), DMG: Number(DMG), PA: Number(PA), SD: Number(SD), AD: Number(AD), ReD: Number(ReD), CdC: Number(CdC), CC: Number(CC), AN: Number(AN) },
            BuffsList: charStats.BuffsList.map(buff => ({ ...buff, Applied: false })), // remove applied from all buffs
            DebuffsList: charStats.DebuffsList.map(debuff => ({ ...debuff, Applied: false })), // remove applied from all debuffs
            TurnEffect: charStats.TurnEffect,
            FightStyle: null,
            CaracteristicsBuff: charStats.CaracteristicsBuff,
            CustomCaracteristicsValue: getCustomValues(),
            ...(showVariant && { Variant })
        };

        const effectUpdatedCharData = applyCombatStatsEffect(newCharacterData);
        setCharData(charData.map(char => char.Id === charStats.Id ? effectUpdatedCharData : char));
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
                                    {["Master", "Servant", "PNJ"].map((value) => (
                                        <option key={value} value={value}>{value}</option>
                                    ))}
                                </select>
                                {(showVariant) && 
                                <select {...register("Variant")} defaultValue="Archer" id="input_variant" className="input_field !indent-1">
                                    {["Archer", "Assassin", "Berserker", 'Caster', "Lancer", "Rider", "Saber", "Slayer", "Shielder", "Outsider", "Monster", "Launcher", "Avenger", "Elder"].map((variant) => (
                                        <option value={variant}>{variant}</option>
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
                                <select {...register("WeaponType")} id="input_weapon_type" defaultValue='Contondant' className="input_field">
                                    {["Contondant", "Perçant", "Tranchant"].map((weaponType) => (
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
                            {["STR", "END", "AGI", "MANA", "MGK", "LUK", "SPD"].map((stat) => (
                                <div key={stat} className="input_entry">
                                    <label htmlFor={`input_${stat.toLowerCase()}`} className="input_label">{stat} :</label>
                                    <input {...register(stat as keyof CreateCharFormInputInterface, { required: `Enter a Valid ${stat} Amount !`, validate: (value) =>  StatKeyArray.includes(value as StatKey) || `Invalid ${stat} value! Must be: ${StatKeyArray.join(", ")}`})} defaultValue={'E'} id={`input_${stat.toLowerCase()}`} className="input_field" />
                                    {(watch(stat as keyof CreateCharFormInputInterface) === 'EX' || watch(stat as keyof CreateCharFormInputInterface) === 'S') && 
                                        <input type="number" id={`${stat}_custom_value`} className="input_field" placeholder={`Enter ${watch(stat as keyof CreateCharFormInputInterface)} value`} required />
                                    }
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
                            {Object.entries(charStats.InitCombatStats).map(([key, value]) => (
                                <div key={key} className="input_entry">
                                    <label htmlFor={`input_${key.toLowerCase()}`} className="input_label cursor-help" title={CombatStatsTitle[key as keyof typeof CombatStatsTitle]}>{key} :</label>
                                    <input type="number" {...register(key as keyof CreateCharFormInputInterface, { required: `Enter a Valid ${key} Amount !` })} defaultValue={value} id={`input_${key.toLowerCase()}`} className="input_field" />
                                </div>
                            ))}
                        </div>
                        {
                            (charStats.BuffsList.length > 0)
                                ?   <div className="input_group">
                                        <h3 className="input_label">Buffs List :</h3>
                                        {Object.entries(charStats.BuffsList).map(([key, value]) => (
                                            <div key={key} className="input_entry">
                                                <span className="input_field cursor-help" title={value.Desc}>{value.Name}</span>
                                            </div>
                                        ))}
                                    </div>
                                : <></>
                        }
                        {
                            (charStats.DebuffsList.length > 0)
                                ?   <div className="input_group">
                                        <h3 className="input_label">Debuffs List :</h3>
                                        {Object.entries(charStats.DebuffsList).map(([key, value]) => (
                                            <div key={key} className="input_entry">
                                                <span className="input_field cursor-help" title={value.Desc}>{value.Name}</span>
                                            </div>
                                        ))}
                                    </div>
                                : <></>
                        }
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