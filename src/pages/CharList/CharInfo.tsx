import { useContext } from "react";
import { CharStatsInterface } from "../../types/statsType";
import { DataContext } from "../../context/DataContext";
import { removeEffect } from "../Fight/FightScreen/FightHandlers/fightCalc";
import { CharBuffInterface, CharDebuffInterface } from "../../types/statsType";
import { RxCross1 } from "react-icons/rx";
import { AddCustomEffectForm } from "../../global/AddCustomEffectForm";

interface CharInfoPropsInterface {
    charStats: CharStatsInterface;
    handleSetEdit: () => void;
    handleCloseModal: () => void;
}

export function CharInfo ({ charStats, handleSetEdit, handleCloseModal }: CharInfoPropsInterface) {
    const { charData, setCharData } = useContext(DataContext);

    function handleRemoveEffect(charD: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface, effectType: "Buff" | "Debuff"){
        setCharData(charData.map((char) => char.Id === charD.Id? removeEffect(charD, effect, effectType) : char));
    }

    return (
        <>
            <div className="flex gap-2">
                <div className="input_group min-w-[200px]">
                    <h3 className="input_label">Base Info :</h3>
                    <div className="input_entry">
                        <div className="input_label">Name: </div>
                        <div className="input_field">{charStats.Name}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Joueur: </div>
                        <div className="input_field">{charStats.Joueur}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Type: </div>
                        <div className="input_field">{charStats.Type}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Arme: </div>
                        <div className="input_field cursor-help" title={charStats.Weapon.WeaponType}>{charStats.Weapon.WeaponName}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Arme Dmg: </div>
                        <div className="input_field">{charStats.Weapon.WeaponDmg}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Armor: </div>
                        <div className="input_field">{charStats.Armor}</div>
                    </div>
                    {charStats.Variant && (
                        <div className="input_entry">
                            <div className="input_label">Variant: </div>
                            <div className="input_field">{charStats.Variant}</div>
                        </div>
                    )}
                    <div className="input_entry">
                        <div className="input_label">Hp: </div>
                        <div className="input_field">{charStats.Hp}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Mana: </div>
                        <div className="input_field">{charStats.Mana}</div>
                    </div>
                    <h3 className="input_label">Caracteristics :</h3>
                    {Object.entries(charStats.Caracteristics).map(([key, value]) => (
                        <div key={key} className="input_entry">
                            <span className="input_label">{key}: </span>
                            <span className="input_field">{value}</span>
                        </div>
                    ))}
                </div>
                {(charStats.Variant)
                    ?   <div>
                            <img src={`./assets/servant_img/${charStats.Variant}.png`} className="w-fit h-fit variant_img"/>
                        </div>
                    : <></>}
                <div className="input_group min-w-[200px]">
                    <h3 className="input_label">Combat Stats :</h3>
                    {Object.entries(charStats.CombatStats).map(([key, value]) => (
                        <div key={key} className="input_entry">
                            <span className="input_label">{key}: </span>
                            <span className={`input_field ${value < charStats.InitCombatStats[key as keyof typeof charStats.CombatStats] ? '!text-red-500' : ''}${value > charStats.InitCombatStats[key as keyof typeof charStats.CombatStats] ? '!text-blue-500' : ''}`}>{value}</span>
                        </div>
                    ))}
                    {
                        (charStats.BuffsList.length > 0)
                            ?   <div className="input_group">
                                    <h3 className="input_label">Buffs List :</h3>
                                    {Object.entries(charStats.BuffsList).map(([key, value]) => (
                                        <div key={key} className="input_entry">
                                            <span className="input_field cursor-help" title={value.Desc}>{value.Name}</span>
                                            <button onClick={() => handleRemoveEffect(charStats, value, "Buff")} className="bg-red-900 text-white hover:bg-white hover:text-red-900 cursor-pointer p-1 transition-all"><RxCross1 size={20}/></button>
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
                                            <button onClick={() => handleRemoveEffect(charStats, value, "Debuff")} className="bg-red-900 text-white hover:bg-white hover:text-red-900 cursor-pointer p-1 transition-all"><RxCross1 size={20}/></button>
                                        </div>
                                    ))}
                                </div>
                            : <></>
                    }
                </div>
            </div>
            <div className="flex justify-center py-5">
                <div className="min-w-80 flex justify-around">
                    <AddCustomEffectForm toUpdateCharData={charStats} />
                    <button onClick={handleSetEdit} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Edit</button>
                    <button onClick={handleCloseModal} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Cancel</button>
                </div>
            </div>
        </>
    );
};