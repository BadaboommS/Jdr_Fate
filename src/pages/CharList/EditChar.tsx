import { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CharDataContext } from "../../context/CharDataContext";
import { CharStatsInterface, CreateCharFormInputInterface } from "../../types/statsType";

interface EditCharPropsInterface {
    charStats: CharStatsInterface;
    handleSetEdit: () => void;
    handleCloseModal: () => void;
    handleDeleteChar: (charId: number) => void;
}

export function EditChar ({ charStats, handleSetEdit, handleCloseModal, handleDeleteChar }: EditCharPropsInterface) {
    const { charData, setCharData } = useContext( CharDataContext );
    const [showVariant, setShowVariant] = useState(charStats.Type === "Servant");

    const { register, handleSubmit, reset, watch} = useForm<CreateCharFormInputInterface>({
        defaultValues: {
            Name: charStats.Name,
            Joueur: charStats.Joueur,
            Type: charStats.Type,
            Variant: charStats.Variant,
            Arme: charStats.Arme,
            ArmeDMG: charStats.ArmeDMG,
            Armor: charStats.Armor,
            Hp: charStats.Hp,
            Mana: charStats.Mana,
            STR: charStats.Caracteristics.STR,
            END: charStats.Caracteristics.END,
            AGI: charStats.Caracteristics.AGI,
            MANA: charStats.Caracteristics.MANA,
            MGK: charStats.Caracteristics.MGK,
            LUK: charStats.Caracteristics.LUK,
            SPD: charStats.Caracteristics.SPD,
            Ini: charStats.Combat_Stats.Ini,
            SA: charStats.Combat_Stats.SA,
            AA: charStats.Combat_Stats.AA,
            DMG: charStats.Combat_Stats.DMG,
            PA: charStats.Combat_Stats.PA,
            SD: charStats.Combat_Stats.SD,
            AD: charStats.Combat_Stats.AD,
            ReD: charStats.Combat_Stats.ReD,
            CdC: charStats.Combat_Stats.CdC,
            CC: charStats.Combat_Stats.CC,
            AN: charStats.Combat_Stats.AN
        }
    });

    const onSubmit: SubmitHandler<CreateCharFormInputInterface> = (data) => {
        if(!window.confirm(`Confirmer l'Edit du character ?`)){
            return;
        }

        const { Name, Joueur, Type, Arme, ArmeDMG, Armor, Variant, Hp, Mana, STR, END, AGI, MANA, MGK, LUK, SPD, Ini, SA, AA, DMG, PA, SD, AD, ReD, CdC, CC, AN } = data;
        const newCharacterData = {
            Id: charStats.Id,
            Name,
            Joueur,
            Type,
            Arme,
            ArmeDMG,
            Armor,
            Hp,
            Mana,
            Caracteristics: { STR, END, AGI, MANA, MGK, LUK, SPD},
            Combat_Stats: {Ini, SA, AA, DMG, PA, SD, AD, ReD, CdC, CC, AN},
            ...(showVariant && { Variant })
        };

        setCharData(charData.map(char => char.Id === charStats.Id ? newCharacterData : char));
    }
    
    function handleReset(){
        setShowVariant(false);
        reset();
        handleSetEdit();
    }

    return (
        <>
            <div className="flex flex-col gap-2 items-center">
                <button type="button" className="bg-red-500 hover:bg-white text-white hover:text-red-500 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer transition-all" onClick={() => handleDeleteChar(charStats.Id)}>Delete</button>
                <form onSubmit={handleSubmit(onSubmit)} className="bg-[#DFDDCF] text-[#E0E1E4] flex flex-col justify-center p-4">
                    <div className="flex gap-2 justify-evenly">
                        <div className="input_group">
                            <div className="flex flex-row input_entry">
                                <label htmlFor="input_name" className="input_label">Name :</label>
                                <input {...register("Name", {required: "Enter a Name !"})} id="input_name" placeholder="Nom" className="input_field" />
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
                                <label htmlFor="input_arme" className="input_label">Arme :</label>
                                <input {...register("Arme", {required: "Enter a Valid Arme !"})} placeholder="Arme" id="input_arme" className="input_field" />
                            </div>
                            <div className="input_entry">
                                <label htmlFor="input_ArmeDMG" className="input_label">Dégâts arme :</label>
                                <input type="number" {...register("ArmeDMG", {required: "Enter a Valid ArmeDMG Amount !"})} id="input_ArmeDMG" className="input_field" />
                            </div>
                            <div className="input_entry">
                                <label htmlFor="input_Armor" className="input_label">Armure :</label>
                                <input type="number" {...register("Armor", {required: "Enter a Valid ArmeDMG Amount !"})} id="input_Armor" className="input_field" />
                            </div>
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
                            <button type="submit" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Update</button>
                            <button type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer" onClick={() => handleReset()}>Cancel Edit</button>
                            <button type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer" onClick={() => handleCloseModal()}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};