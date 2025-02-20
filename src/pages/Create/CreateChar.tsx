import { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DataContext } from "../../context/DataContext";
import { CreateCharFormInputInterface, CombatStatsTitle, CharCaracteristicsKeyArray, CharCaracteristicsArray, CharCombatStatsArray, CharTypeArray, ServantVariantArray, WeaponTypeArray } from "../../types/statsType";
import { caracToStatsCalc } from "../../function/BaseStatsCalc";
import './createChar.css';


export function CreateChar() {
    const { charData, setCharData, playerData } = useContext( DataContext );
    const [showVariant, setShowVariant] = useState(false);

    const { register, handleSubmit, reset, watch, setValue, getValues} = useForm<CreateCharFormInputInterface>({ defaultValues: { Name: '', Joueur: '', WeaponName: '', WeaponType: '', WeaponDmg: 0, Armor: 0, Hp: 0, Mana: 0, MaxFightStyleAmount: 1, CharSpeed: 0 }});

    const onSubmit: SubmitHandler<CreateCharFormInputInterface> = (data) => {
        if(!window.confirm(`Valider l'ajout du personnage ?`)){
            return;
        }
        
        const { Name, Joueur, Type, WeaponName, WeaponDmg, WeaponType, Armor, MaxFightStyleAmount, Variant, Hp, Mana, STR, END, AGI, MANA, MGK, LUK, SPD, STROverload, ENDOverload, AGIOverload, MANAOverload, MGKOverload, LUKOverload, SPDOverload, CharSpeed, Ini, SA, AA, DMG, PA, SD, AD, ReD, CdC, CC, AN } = data;
        const newCharacterData = {
            Id: charData[0] ? charData[charData.length - 1].Id + 1 : 0,
            Name, Joueur, Type,
            Weapon: { WeaponName, WeaponDmg: Number(WeaponDmg), WeaponType },
            Hp: Number(Hp), InitHp: Number(Hp), Mana: Number(Mana), InitMana: Number(Mana), Armor: Number(Armor), MaxFightStyleAmount: Number(MaxFightStyleAmount),
            Caracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD },
            InitCaracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD },
            CustomCaracteristicsValue: getCustomValues(),
            CaracteristicsBuff: { STR: 0, END: 0, AGI: 0, MANA: 0, MGK: 0, LUK: 0, SPD: 0 },
            CaracteristicsOverload: { STR: Number(STROverload), END: Number(ENDOverload), AGI: Number(AGIOverload), MANA: Number(MANAOverload), MGK: Number(MGKOverload), LUK: Number(LUKOverload), SPD: Number(SPDOverload) },
            CombatStats: { Ini: Number(Ini), SA: Number(SA), AA: Number(AA), DMG: Number(DMG), PA: Number(PA), SD: Number(SD), AD: Number(AD), ReD: Number(ReD), CdC: Number(CdC), CC: Number(CC), AN: Number(AN) },
            InitCombatStats: { Ini: Number(Ini), SA: Number(SA), AA: Number(AA), DMG: Number(DMG), PA: Number(PA), SD: Number(SD), AD: Number(AD), ReD: Number(ReD), CdC: Number(CdC), CC: Number(CC), AN: Number(AN) },
            BuffsList: [], DebuffsList: [], FightStyleList: [],
            TurnEffect: { Dot: 0, Hot: 0 },
            CharSpeed: CharSpeed,
            ...(showVariant && { Variant })
        };

        setCharData([...charData, newCharacterData]);
    }
    
    function handleCalculStats(){
        const CARACS = { STR: getValues("STR"), END: getValues("END"), AGI: getValues("AGI"), MANA: getValues("MANA"), MGK: getValues("MGK"), LUK: getValues("LUK"), SPD: getValues("SPD") };
        const CaracOverload = { STR: getValues("STROverload"), END: getValues("ENDOverload"), AGI: getValues("AGIOverload"), MANA: getValues("MANAOverload"), MGK: getValues("MGKOverload"), LUK: getValues("LUKOverload"), SPD: getValues("SPDOverload") };
        const customValues = getCustomValues();
        const CARAC_VALUES = caracToStatsCalc(CARACS, customValues, Number(getValues('Armor')), CaracOverload);
        Object.entries(CARAC_VALUES).forEach(([key, value]) => {
            setValue(key as keyof CreateCharFormInputInterface, value);
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
                                {CharTypeArray.map((value) => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                            {(showVariant) && 
                                <select {...register("Variant")} defaultValue="Archer" id="input_variant" className="input_field !indent-1">
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
                            <select {...register("WeaponType")} id="input_weapon_type" defaultValue='Contondant' className="input_field">
                                {WeaponTypeArray.map((weaponType) => (
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
                        <div className="input_entry">
                            <label htmlFor="input_stance_number" className="input_label">Nombre de stance :</label>
                            <input type="number" {...register("MaxFightStyleAmount", {required: "Enter a Valid WeaponDmg Amount !", min: 0})} id="input_stance_number" className="input_field" />
                        </div>
                        <h3 className="input_label">Caracteristics :</h3>
                        {CharCaracteristicsArray.map((stat) => (
                            <div className="input_entry" key={stat}>
                                <label htmlFor={`input_${stat.toLowerCase()}`} className="input_label">{stat} :</label>
                                <select {...register(stat as keyof CreateCharFormInputInterface, { required: `Enter a Valid ${stat} Amount !`})} id={`input_${stat.toLowerCase()}`} defaultValue={"E"} className="input_field">
                                    {CharCaracteristicsKeyArray.map((value) => {
                                        return <option key={`${stat}_${value}`} value={value}>{value}</option>
                                    })}
                                </select>
                                {(watch(stat as keyof CreateCharFormInputInterface) === 'EX' || watch(stat as keyof CreateCharFormInputInterface) === 'S') && 
                                    <input type="number" id={`${stat}_custom_value`} className="input_field" placeholder={`Enter ${watch(stat as keyof CreateCharFormInputInterface)} value`} defaultValue={0} required />
                                }
                                <input type="number" {...register(`${stat}Overload` as keyof CreateCharFormInputInterface, { required: `Enter a Valid ${stat} Amount !`})} className="input_field cursor-help" defaultValue={0} title="Nombre de + ou - à la Caracteristique"/>
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
                        {CharCombatStatsArray.map((stat) => ( 
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
                    </div>
                </div>
            </form>
        </div>
    );
}