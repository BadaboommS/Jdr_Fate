import { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CharDataContext } from "../../context/CharDataContextProvider";
import { CharStatsInterface } from "../../types/stats";
import './CreateChar.css';

type OmitedCharStats = Omit<CharStatsInterface, 'Combat_Stats'>;

interface CreateCharFormInputInterface extends OmitedCharStats{
    Ini: number,
    SA: number,
    AA: number,
    DMG: number,
    PA: number,
    SD: number,
    AD: number,
    ReD: number,
    CdC: number,
    CC: number,
    AN: number 
}

export function CreateChar() {
    const { charData, setCharData } = useContext( CharDataContext );
    const [showVariant, setShowVariant] = useState(false);

    const { register, handleSubmit, reset, watch} = useForm<CreateCharFormInputInterface>({
        defaultValues: {
            Name: '',
            Hp: 0,
            Mana: 0,
            Ini: 0,
            SA: 0,
            AA: 0,
            DMG: 0,
            PA: 0,
            SD: 0,
            AD: 0,
            ReD: 0,
            CdC: 0,
            CC: 0,
            AN: 0
        }
    });

    const onSubmit: SubmitHandler<CreateCharFormInputInterface> = (data) => {
        if(!window.confirm(`Valider l'ajout du personnage ?`)){
            return;
        }

        const { Name, Type, Variant, Hp, Mana, ...combatStats } = data;
        const newCharacterData = {
            Name,
            Type,
            Hp,
            Mana,
            Combat_Stats: combatStats,
            ...(showVariant && { Variant })
        };

        setCharData([...charData, newCharacterData]);
    }

    return (
        <div>
            <h1 className="text-2xl text-center">Create Character</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-[#DFDDCF] text-[#E0E1E4] flex flex-col justify-center p-4">
                <div className="flex justify-evenly">
                    <div className="input_group">
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_name" className="input_label">Name :</label>
                            <input {...register("Name", {required: "Enter a Name !"})} id="input_name" placeholder="Nom" className="input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_type" className="input_label">Character Type :</label>
                            <select {...register("Type")} id="input_type" defaultValue="Master" onChange={(e) => e.target.value === "Servant"? setShowVariant(true): setShowVariant(false)} className="input_field">
                                <option value="Master">Master</option>
                                <option value="Servant">Servant</option>
                                <option value="PNJ">PNJ</option>
                            </select>
                        </div>
                        {
                            (showVariant)
                            ?   <div className="flex flex-row input_entry">
                                    <label htmlFor="input_variant" className="input_label">Servant Variant :</label>
                                    <select {...register("Variant")} defaultValue="Archer" id="input_variant" className="input_field">
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
                    </div>
                    {(showVariant)
                    ?   <div>
                            <img src={`./assets/servant_img/${watch("Variant") === undefined? 'Archer' : watch("Variant")}.png`} className="w-fit h-fit variant_img"/>
                        </div>
                    : <></>}
                    <div className="input_group">
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_hp" className="input_label">Hp :</label>
                            <input type="number" {...register("Hp", {required: "Enter a Valid Hp Amount !"})} id="input_hp" className="indent-2 input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_mana" className="input_label">Mana :</label>
                            <input type="number" {...register("Mana", {required: "Enter a Valid Mana Amount !"})} id="input_mana" className="indent-2 input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_ini" className="input_label">Ini :</label>
                            <input type="number" {...register("Ini", { required: "Enter a Valid Ini Amount !" })} id="input_ini" className="indent-2 input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_sa" className="input_label">SA :</label>
                            <input type="number" {...register("SA", { required: "Enter a Valid SA Amount !" })} id="input_sa" className="indent-2 input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_aa" className="input_label">AA :</label>
                            <input type="number" {...register("AA", { required: "Enter a Valid AA Amount !" })} id="input_aa" className="indent-2 input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_dmg" className="input_label">DMG :</label>
                            <input type="number" {...register("DMG", { required: "Enter a Valid DMG Amount !" })} id="input_dmg" className="indent-2 input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_pa" className="input_label">PA :</label>
                            <input type="number" {...register("PA", { required: "Enter a Valid PA Amount !" })} id="input_pa" className="indent-2 input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_sd" className="input_label">SD :</label>
                            <input type="number" {...register("SD", { required: "Enter a Valid SD Amount !" })} id="input_sd" className="indent-2 input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_ad" className="input_label">AD :</label>
                            <input type="number" {...register("AD", { required: "Enter a Valid AD Amount !" })} id="input_ad" className="indent-2 input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_red" className="input_label">ReD :</label>
                            <input type="number" {...register("ReD", { required: "Enter a Valid ReD Amount !" })} id="input_red" className="indent-2 input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_cdc" className="input_label">CdC :</label>
                            <input type="number" {...register("CdC", { required: "Enter a Valid CdC Amount !" })} id="input_cdc" className="indent-2 input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_cc" className="input_label">CC :</label>
                            <input type="number" {...register("CC", { required: "Enter a Valid CC Amount !" })} id="input_cc" className="indent-2 input_field" />
                        </div>
                        <div className="flex flex-row input_entry">
                            <label htmlFor="input_an" className="input_label">AN :</label>
                            <input type="number" {...register("AN", { required: "Enter a Valid AN Amount !" })} id="input_an" className="indent-2 input_field" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center py-5">
                    <div className="min-w-50 flex justify-around">
                        <button type="submit" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Créer</button>
                        <button type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer" onClick={() => reset()}>Reset</button>
                    </div>
                </div>
            </form>
        </div>
    );
}