import { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DataContext } from "../../context/DataContext";
import { CreateCharFormInputInterface } from "../../types/statsType";
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
            Hp: Number(Hp), Mana: Number(Mana), Armor: Number(Armor),
            Caracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD },
            CombatStats: { Ini: Number(Ini), SA: Number(SA), AA: Number(AA), DMG: Number(DMG), PA: Number(PA), SD: Number(SD), AD: Number(AD), ReD: Number(ReD), CdC: Number(CdC), CC: Number(CC), AN: Number(AN) },
            InitCaracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD },
            InitCombatStats: { Ini: Number(Ini), SA: Number(SA), AA: Number(AA), DMG: Number(DMG), PA: Number(PA), SD: Number(SD), AD: Number(AD), ReD: Number(ReD), CdC: Number(CdC), CC: Number(CC), AN: Number(AN) },
            BuffsList: [],
            DebuffsList: [],
            TurnEffect: { Dot: 0, Hot: 0},
            ...(showVariant && { Variant })
        };

        setCharData([...charData, newCharacterData]);
    }
    
    function handleCalculStats(){
        const CARACS = { STR: getValues("STR"), END: getValues("END"), AGI: getValues("AGI"), MANA: getValues("MANA"), MGK: getValues("MGK"), LUK: getValues("LUK"), SPD: getValues("SPD") };
        const CARAC_VALUES = caracToStatsCalc(CARACS, Number(getValues('Armor')));
        Object.entries(CARAC_VALUES).forEach(([key, value]) => {
            setValue(key as keyof CreateCharFormInputInterface, value);
        });
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
                                <option value="Master">Master</option>
                                <option value="Servant">Servant</option>
                                <option value="PNJ">PNJ</option>
                            </select>
                        </div>
                        {
                            (showVariant)
                            ?   <div className="input_entry">
                                    <label htmlFor="input_variant" className="input_label">Servant Variant :</label>
                                    <select {...register("Variant")} defaultValue="Archer" id="input_variant" className="input_field !indent-1">
                                        <option value="Archer">Archer</option>
                                        <option value="Assassin">Assassin</option>
                                        <option value="Berserker">Berserker</option>
                                        <option value="Caster">Caster</option>
                                        <option value="Lancer">Lancer</option>
                                        <option value="Rider">Rider</option>
                                        <option value="Saber">Saber</option>
                                        <option value="Slayer">Slayer</option>
                                        <option value="Shielder">Shielder</option>
                                        <option value="Outsider">Outsider</option>
                                        <option value="Monster">Monster</option>
                                        <option value="Launcher">Launcher</option>
                                        <option value="Avenger">Avenger</option>
                                        <option value="Elder">Elder</option>
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
                                <select {...register(stat as keyof CreateCharFormInputInterface, { required: `Enter a Valid ${stat} Amount !` })} defaultValue={'E'} id={`input_${stat.toLowerCase()}`} className="input_field">
                                    {["E", "D", "C", "B", "A", "EX"].map((value) => (
                                        <option value={value} key={value}>{value}</option>
                                    ))}
                                </select>
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
                                <label htmlFor={`input_${stat.toLowerCase()}`} className="input_label">{stat} :</label>
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