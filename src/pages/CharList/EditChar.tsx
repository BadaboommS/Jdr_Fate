import { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DataContext } from "../../context/DataContext";
import { CharStatsInterface, CreateCharFormInputInterface } from "../../types/statsType";
import { applyEffect } from "../../function/FightCalc";

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

        const { Name, Joueur, Type, WeaponName, WeaponDmg, WeaponType, Armor, Variant, STR, END, AGI, MANA, MGK, LUK, SPD } = data;
        const newCharacterData: CharStatsInterface = {
            Id: charStats.Id, Name, Joueur, Type,
            Weapon: { WeaponName, WeaponDmg, WeaponType },
            Armor, Hp: Number(data.Hp), Mana: Number(data.Mana),
            InitCaracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD },
            InitCombatStats: { Ini: Number(data.Ini), SA: Number(data.SA), AA: Number(data.AA), DMG: Number(data.DMG), PA: Number(data.PA), SD: Number(data.SD), AD: Number(data.AD), ReD: Number(data.ReD), CdC: Number(data.CdC), CC: Number(data.CC), AN: Number(data.AN) },
            Caracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD },
            CombatStats: { Ini: Number(data.Ini), SA: Number(data.SA), AA: Number(data.AA), DMG: Number(data.DMG), PA: Number(data.PA), SD: Number(data.SD), AD: Number(data.AD), ReD: Number(data.ReD), CdC: Number(data.CdC),
            CC: Number(data.CC), AN: Number(data.AN) },
            BuffsList: charStats.BuffsList.map(buff => ({ ...buff, Applied: false })), // remove applied from all buffs
            DebuffsList: charStats.DebuffsList.map(debuff => ({ ...debuff, Applied: false })), // remove applied from all debuffs
            TurnEffect: charStats.TurnEffect,
            ...(showVariant && { Variant })
        };

        const effectUpdatedCharData = applyEffect(newCharacterData);
        setCharData(charData.map(char => char.Id === charStats.Id ? effectUpdatedCharData : char));
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
                <form onSubmit={handleSubmit(onSubmit)} className="bg-[#DFDDCF] text-[#E0E1E4] flex flex-col justify-center p-4">
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
                                    <option value="Master">Master</option>
                                    <option value="Servant">Servant</option>
                                    <option value="PNJ">PNJ</option>
                                </select>
                            </div>
                            {
                                (showVariant)
                                ?   <div className="flex flex-row input_entry">
                                        <label htmlFor="input_variant" className="input_label">Servant Variant :</label>
                                        <select {...register("Variant")} id="input_variant" defaultValue="Archer" className="input_field">
                                            {["Archer", "Assassin", "Berserker", "Caster", "Lancer", "Rider", "Saber", "Slayer", "Shielder", "Outsider", "Monster", "Launcher", "Avenger", "Elder"].map(variant => (
                                                <option key={variant} value={variant}>{variant}</option>
                                            ))}
                                        </select>
                                    </div>
                                :   <></>
                            }
                            <div className="input_entry">
                                <label htmlFor="input_weapon_name" className="input_label">Arme :</label>
                                <input {...register("WeaponName", {required: "Enter a Valid Arme !"})} placeholder="Nom arme" id="input_weapon_name" className="input_field" autoComplete="false"/>
                            </div>
                            <div className="input_entry">
                                <label htmlFor="input_weapon_type" className="input_label">Type Arme :</label>
                                <select {...register("WeaponType")} id="input_weapon_type" defaultValue='Contondant' className="input_field">
                                    <option value="Contondant">Contondant</option>
                                    <option value="Perçant">Perçant</option>
                                    <option value="Tranchant">Tranchant</option>
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
                                    <select {...register(stat as keyof CreateCharFormInputInterface)} id={`input_${stat.toLowerCase()}`} className="input_field">
                                        {["E", "D", "C", "B", "A", "EX"].map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
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
                                    <label htmlFor={`input_${key.toLowerCase()}`} className="input_label">{key} :</label>
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