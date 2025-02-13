import { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DataContext } from "../../context/DataContext";
import { CreateCharFormInputInterface, CombatStatsTitle, StatKeyArray, StatKey } from "../../types/statsType";
import { caracToStatsCalc } from "../../function/BaseStatsCalc";
import './createChar.css';


export function CreateChar() {
    const { charData, setCharData, playerData } = useContext( DataContext );
    const [showVariant, setShowVariant] = useState(false);

    const { register, handleSubmit, reset, watch, setValue, getValues} = useForm<CreateCharFormInputInterface>({ defaultValues: { Name: '', Joueur: '', WeaponName: '', WeaponType: '', WeaponDmg: 0, Armor: 0, Hp: 0, Mana: 0 }});

    const onSubmit: SubmitHandler<CreateCharFormInputInterface> = (data) => {
        if(!window.confirm(`Valider l'ajout du personnage ?`)){
            return;
        }

        const { Name, Joueur, Type, WeaponName, WeaponDmg, WeaponType, Armor, Variant, Hp, Mana, STR, END, AGI, MANA, MGK, LUK, SPD, Ini, SA, AA, DMG, PA, SD, AD, ReD, CdC, CC, AN } = data;
        const newCharacterData = {
            Id: charData[0] ? charData[charData.length - 1].Id + 1 : 0,
            Name, Joueur, Type,
            Weapon: { WeaponName, WeaponDmg: Number(WeaponDmg), WeaponType },
            Hp: Number(Hp), InitHp: Number(Hp), Mana: Number(Mana), InitMana: Number(Mana), Armor: Number(Armor),
            Caracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD },
            CombatStats: { Ini: Number(Ini), SA: Number(SA), AA: Number(AA), DMG: Number(DMG), PA: Number(PA), SD: Number(SD), AD: Number(AD), ReD: Number(ReD), CdC: Number(CdC), CC: Number(CC), AN: Number(AN) },
            InitCaracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD },
            InitCombatStats: { Ini: Number(Ini), SA: Number(SA), AA: Number(AA), DMG: Number(DMG), PA: Number(PA), SD: Number(SD), AD: Number(AD), ReD: Number(ReD), CdC: Number(CdC), CC: Number(CC), AN: Number(AN) },
            BuffsList: [],
            DebuffsList: [],
            TurnEffect: { Dot: 0, Hot: 0 },
            FightStyle: null,
            CaracteristicsBuff: { STR: 0, END: 0, AGI: 0, MANA: 0, MGK: 0, LUK: 0, SPD: 0 },
            CustomCaracteristicsValue: getCustomValues(),
            ...(showVariant && { Variant })
        };

        setCharData([...charData, newCharacterData]);
    }
    
    function handleCalculStats(){
        const CARACS = { STR: getValues("STR"), END: getValues("END"), AGI: getValues("AGI"), MANA: getValues("MANA"), MGK: getValues("MGK"), LUK: getValues("LUK"), SPD: getValues("SPD") };
        const customValues = getCustomValues();
        const CARAC_VALUES = caracToStatsCalc(CARACS, customValues, Number(getValues('Armor')));
        Object.entries(CARAC_VALUES).forEach(([key, value]) => {
            setValue(key as keyof CreateCharFormInputInterface, value);
        });
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
    }

    return (
        <div>
            <h1 className="text-2xl text-center">Create Character</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-[#DFDDCF] text-[#E0E1E4] flex flex-col justify-center p-4">
                <div className="flex justify-evenly">
                    <div className="input_group">
                        <h3 className="input_label">Base Info :</h3>
                        <div className="input_entry">
                            <label htmlFor="input_name" className="input_label">Name :</label>
                            <input {...register("Name", {required: "Enter a Name !"})} id="input_name" placeholder="Nom" className="input_field" autoComplete="false" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_joueur" className="input_label">Joueur :</label>
                            <select {...register("Joueur")} id="input_joueur" className="input_field !indent-1">
                                {(playerData.map((player: string) => {
                                    return <option value={player} key={player}>{player}</option>
                                }))}
                            </select>
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_type" className="input_label">Character Type :</label>
                            <select {...register("Type")} id="input_type" defaultValue="Master" onChange={(e) => e.target.value === "Servant"? setShowVariant(true): setShowVariant(false)} className="input_field !indent-1">
                                {["Master", "Servant", "PNJ"].map((value) => (
                                    <option value={value}>{value}</option>
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
                            <label htmlFor="input_weapon_dmg" className="input_label">Dégâts arme :</label>
                            <input type="number" {...register("WeaponDmg", {required: "Enter a Valid WeaponDmg Amount !"})} id="input_weapon_dmg" className="input_field" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_Armor" className="input_label">Armure :</label>
                            <input type="number" {...register("Armor", {required: "Enter a Valid Armor Amount !"})} id="input_Armor" className="input_field" />
                        </div>
                        <h3 className="input_label">Caracteristics :</h3>
                        {["STR", "END", "AGI", "MANA", "MGK", "LUK", "SPD"].map((stat) => (
                            <div className="input_entry" key={stat}>
                                <label htmlFor={`input_${stat.toLowerCase()}`} className="input_label">{stat} :</label>
                                <input {...register(stat as keyof CreateCharFormInputInterface, { required: `Enter a Valid ${stat} Amount !`, validate: (value) =>  StatKeyArray.includes(value as StatKey) || `Invalid ${stat} value! Must be: ${StatKeyArray.join(", ")}`})} defaultValue={'E'} id={`input_${stat.toLowerCase()}`} className="input_field" />
                                {(watch(stat as keyof CreateCharFormInputInterface) === 'EX' || watch(stat as keyof CreateCharFormInputInterface) === 'S') && 
                                    <input type="number" id={`${stat}_custom_value`} className="input_field" placeholder={`Enter ${watch(stat as keyof CreateCharFormInputInterface)} value`} required />
                                }
                            </div>
                        ))}
                    </div>
                    {(showVariant)
                    ?   <div>
                            <img src={`./assets/servant_img/${watch("Variant") === undefined? 'Archer' : watch("Variant")}.png`} className="w-fit h-fit variant_img"/>
                        </div>
                    : <></>}
                    <div className="input_group">
                        <h3 className="input_label">Combat Stats :</h3>
                        <div className="input_entry">
                            <label htmlFor="input_hp" className="input_label">Hp :</label>
                            <input type="number" {...register("Hp", {required: "Enter a Valid Hp Amount !"})} id="input_hp" className="input_field" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_mana2" className="input_label">Mana :</label>
                            <input type="number" {...register("Mana", {required: "Enter a Valid Mana Amount !"})} id="input_mana2" className="input_field" />
                        </div>
                        {["Ini", "SA", "AA", "DMG", "PA", "SD", "AD", "ReD", "CdC", "CC", "AN"].map((stat) => (
                            <div className="input_entry" key={stat}>
                                <label htmlFor={`input_${stat.toLowerCase()}`} className="input_label cursor-help" title={CombatStatsTitle[stat as keyof typeof CombatStatsTitle]}>{stat} :</label>
                                <input type="number" {...register(stat as keyof CreateCharFormInputInterface, { required: `Enter a Valid ${stat} Amount !` })} defaultValue={0} id={`input_${stat.toLowerCase()}`} className="input_field" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center py-5">
                    <div className="min-w-80 flex justify-around">
                        <button type="submit" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Créer</button>
                        <button type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer" onClick={() => handleReset()}>Reset</button>
                        <button type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer" onClick={() => handleCalculStats()}>Init Stats</button>
                        <button type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer" onClick={() => getCustomValues()}>Test</button>
                    </div>
                </div>
            </form>
        </div>
    );
}