import { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DataContext } from "../../context/DataContext";
import { CreateCharFormInputInterface, StatKey } from "../../types/statsType";
import { calcFunctionService } from "../../function/BaseStatsCalc";
import './createChar.css';


export function CreateChar() {
    const { charData, setCharData, playerData } = useContext( DataContext );
    const [showVariant, setShowVariant] = useState(false);

    const { register, handleSubmit, reset, watch, setValue, getValues} = useForm<CreateCharFormInputInterface>({ defaultValues: { Name: '', Joueur: '', WeaponName: '', WeaponType: '', WeaponDmg: 0, Armor: 0, Hp: 0, Mana: 0, STR: 'E', END: 'E', AGI: 'E', MANA: 'E', MGK: 'E', LUK: 'E', SPD: 'E', Ini: 0, SA: 0, AA: 0, DMG: 0, PA: 0, SD: 0, AD: 0, ReD: 0, CdC: 0, CC: 0, AN: 0 } });

    const onSubmit: SubmitHandler<CreateCharFormInputInterface> = (data) => {
        if(!window.confirm(`Valider l'ajout du personnage ?`)){
            return;
        }

        const { Name, Joueur, Type, WeaponName, WeaponDmg, WeaponType, Armor, Variant, Hp, Mana, STR, END, AGI, MANA, MGK, LUK, SPD, Ini, SA, AA, DMG, PA, SD, AD, ReD, CdC, CC, AN } = data;
        const newCharacterData = {
            Id: charData[0]? charData[charData.length - 1].Id + 1 : 0,
            Name,
            Joueur,
            Type,
            Weapon: { WeaponName, WeaponDmg, WeaponType },
            Armor,
            Hp,
            Mana,
            Caracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD},
            CombatStats: {Ini, SA, AA, DMG, PA, SD, AD, ReD, CdC, CC, AN},
            InitCaracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD},
            InitCombatStats: {Ini, SA, AA, DMG, PA, SD, AD, ReD, CdC, CC, AN},
            BuffsList: [],
            DebuffsList: [],
            ...(showVariant && { Variant })
        };

        setCharData([...charData, newCharacterData]);
    }
    
    function handleCalculStats(){
        const CARACS = { STR: getValues("STR"), END: getValues("END"), AGI: getValues("AGI"), MANA: getValues("MANA"), MGK: getValues("MGK"), LUK: getValues("LUK"), SPD: getValues("SPD") };
        const CARAC_VALUES = calcFunctionService.convertLetterToValue(CARACS);
        
        //set les values des stats de combats avec les retour des calc function
        setValue('Hp', calcFunctionService.calcPVMax(CARACS.END as StatKey)); // END
        setValue('Mana', CARAC_VALUES.MANA);
        setValue("Ini", calcFunctionService.calcIni(CARAC_VALUES.SPD));
        setValue("SA", calcFunctionService.calcSA(CARAC_VALUES.STR, CARAC_VALUES.AGI, CARAC_VALUES.SPD));
        setValue("AA", calcFunctionService.calcAA(CARAC_VALUES.STR, CARAC_VALUES.AGI, CARAC_VALUES.SPD));
        setValue("DMG", calcFunctionService.calcDMG(CARAC_VALUES.STR));
        setValue("PA", 0);
        setValue("SD", calcFunctionService.calcSD(CARAC_VALUES.END, CARAC_VALUES.AGI, CARAC_VALUES.SPD));
        setValue("AD", calcFunctionService.calcAD(CARAC_VALUES.END, CARAC_VALUES.AGI, CARAC_VALUES.SPD));
        setValue("ReD", calcFunctionService.calcReD(CARAC_VALUES.END, parseInt(getValues("Armor").toString())));
        setValue("CdC", calcFunctionService.calcCC(CARAC_VALUES.LUK));
        setValue("CC", 2);
        setValue("AN", 0);
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
                            <select {...register("Joueur")} defaultValue="" id="input_joueur" className="input_field !indent-1">
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
                        <div className="input_entry">
                            <label htmlFor="input_str" className="input_label">STR :</label>
                            <select {...register("STR")} id="input_str" className="input_field">
                                <option value="E">E</option>
                                <option value="D">D</option>
                                <option value="C">C</option>
                                <option value="B">B</option>
                                <option value="A">A</option>
                                <option value="EX">EX</option>
                            </select>
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_end" className="input_label">END :</label>
                            <select {...register("END")} id="input_end" className="input_field">
                                <option value="E">E</option>
                                <option value="D">D</option>
                                <option value="C">C</option>
                                <option value="B">B</option>
                                <option value="A">A</option>
                                <option value="EX">EX</option>
                            </select>
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_agi" className="input_label">AGI :</label>
                            <select {...register("AGI")} id="input_agi" className="input_field">
                                <option value="E">E</option>
                                <option value="D">D</option>
                                <option value="C">C</option>
                                <option value="B">B</option>
                                <option value="A">A</option>
                                <option value="EX">EX</option>
                            </select>
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_mana1" className="input_label">MANA :</label>
                            <select {...register("MANA")} id="input_mana1" className="input_field">
                                <option value="E">E</option>
                                <option value="D">D</option>
                                <option value="C">C</option>
                                <option value="B">B</option>
                                <option value="A">A</option>
                                <option value="EX">EX</option>
                            </select>
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_mgk" className="input_label">MGK :</label>
                            <select {...register("MGK")} id="input_mgk" className="input_field">
                                <option value="E">E</option>
                                <option value="D">D</option>
                                <option value="C">C</option>
                                <option value="B">B</option>
                                <option value="A">A</option>
                                <option value="EX">EX</option>
                            </select>
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_luk" className="input_label">LUK :</label>
                            <select {...register("LUK")} id="input_luk" className="input_field">
                                <option value="E">E</option>
                                <option value="D">D</option>
                                <option value="C">C</option>
                                <option value="B">B</option>
                                <option value="A">A</option>
                                <option value="EX">EX</option>
                            </select>
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_spd" className="input_label">SPD :</label>
                            <select {...register("SPD")} id="input_spd" className="input_field">
                                <option value="E">E</option>
                                <option value="D">D</option>
                                <option value="C">C</option>
                                <option value="B">B</option>
                                <option value="A">A</option>
                                <option value="EX">EX</option>
                            </select>
                        </div>
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
                        <div className="input_entry">
                            <label htmlFor="input_ini" className="input_label">Ini :</label>
                            <input type="number" {...register("Ini", { required: "Enter a Valid Ini Amount !" })} id="input_ini" className="input_field" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_sa" className="input_label">SA :</label>
                            <input type="number" {...register("SA", { required: "Enter a Valid SA Amount !" })} id="input_sa" className="input_field" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_aa" className="input_label">AA :</label>
                            <input type="number" {...register("AA", { required: "Enter a Valid AA Amount !" })} id="input_aa" className="input_field" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_dmg" className="input_label">DMG :</label>
                            <input type="number" {...register("DMG", { required: "Enter a Valid DMG Amount !" })} id="input_dmg" className="input_field" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_pa" className="input_label">PA :</label>
                            <input type="number" {...register("PA", { required: "Enter a Valid PA Amount !" })} id="input_pa" className="input_field" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_sd" className="input_label">SD :</label>
                            <input type="number" {...register("SD", { required: "Enter a Valid SD Amount !" })} id="input_sd" className="input_field" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_ad" className="input_label">AD :</label>
                            <input type="number" {...register("AD", { required: "Enter a Valid AD Amount !" })} id="input_ad" className="input_field" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_red" className="input_label">ReD :</label>
                            <input type="number" {...register("ReD", { required: "Enter a Valid ReD Amount !" })} id="input_red" className="input_field" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_cdc" className="input_label">CdC :</label>
                            <input type="number" {...register("CdC", { required: "Enter a Valid CdC Amount !" })} id="input_cdc" className="input_field" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_cc" className="input_label">CC :</label>
                            <input type="number" {...register("CC", { required: "Enter a Valid CC Amount !" })} id="input_cc" className="input_field" />
                        </div>
                        <div className="input_entry">
                            <label htmlFor="input_an" className="input_label">AN :</label>
                            <input type="number" {...register("AN", { required: "Enter a Valid AN Amount !" })} id="input_an" className="input_field" />
                        </div>
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