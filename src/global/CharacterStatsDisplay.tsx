import { CharStatsInterface, CharBuffInterface, CharDebuffInterface, CombatStatsTitle } from "../types/statsType";
import { RxCross1 } from "react-icons/rx";
import { CustomEffectFormModal } from "./CustomEffectFormModal";

interface CharacterStatsDisplayProps {
    charStats: CharStatsInterface;
    handleRemoveEffect?: (charD: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface, effectType: "Buff" | "Debuff") => void;
    showEditButtons?: boolean;
    extraButtons?: React.ReactNode;
}

export function CharacterStatsDisplay({ charStats, handleRemoveEffect, showEditButtons = false, extraButtons }: CharacterStatsDisplayProps) {
    return (
        <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-2 items-start">
                <div className="input_group min-w-[200px]">
                    <h3 className="input_label">Base Info :</h3>
                    <div className="input_entry"><div className="input_label">Name :</div><div className="input_field">{charStats.Name}</div></div>
                    <div className="input_entry"><div className="input_label">Joueur :</div><div className="input_field">{charStats.Joueur}</div></div>
                    <div className="input_entry"><div className="input_label">Type :</div><div className="input_field">{charStats.Type}</div></div>
                    <div className="input_entry"><div className="input_label">Arme :</div><div className="input_field cursor-help" title={charStats.Weapon.WeaponType}>{charStats.Weapon.WeaponName}</div></div>
                    <div className="input_entry"><div className="input_label">Arme Dmg :</div><div className="input_field">{charStats.Weapon.WeaponDmg}</div></div>
                    <div className="input_entry"><div className="input_label">Armor :</div><div className="input_field">{charStats.Armor}</div></div>
                    {charStats.Variant && (<div className="input_entry"><div className="input_label">Variant :</div><div className="input_field">{charStats.Variant}</div></div>)}
                    <div className="input_entry"><div className="input_label">Hp :</div><div className="input_field">{charStats.Hp}</div></div>
                    <div className="input_entry"><div className="input_label">Mana :</div><div className="input_field">{charStats.Mana}</div></div>
                    <h3 className="input_label">Caracteristics :</h3>
                        {Object.entries(charStats.Caracteristics).map(([key, value]) => (
                            <div key={key} className={`${(key === "SPD")?'cursor-help ' : ''}input_entry`} title={(key === "SPD")? `Vitesse: ${charStats.CharSpeed} Km/h` : ''}>
                                <span className="input_label">{key} :</span>
                                <span className={`input_field ${charStats.CaracteristicsBuff[key as keyof typeof charStats.Caracteristics]? charStats.CaracteristicsBuff[key as keyof typeof charStats.Caracteristics] < 0? "!text-red-500" : "!text-blue-500" : ""}`}>
                                    {value}{charStats.CaracteristicsBuff[key as keyof typeof charStats.Caracteristics]? `+ ${charStats.CaracteristicsBuff[key as keyof typeof charStats.Caracteristics]}` : ""}
                                </span>
                            </div>
                        ))}
                </div>
                <div className="input_group min-w-[200px]">
                    <h3 className="input_label">Combat Stats :</h3>
                    {Object.entries(charStats.CombatStats).map(([key, value]) => (
                        <div key={key} className="input_entry">
                            <span className="input_label" title={CombatStatsTitle[key as keyof typeof charStats.CombatStats]}>{key} :</span>
                            <span className={`input_field ${value < charStats.InitCombatStats[key as keyof typeof charStats.CombatStats] ? '!text-red-500' : ''} ${value > charStats.InitCombatStats[key as keyof typeof charStats.CombatStats] ? '!text-blue-500' : ''}`}>{value}</span>
                        </div>
                    ))}
                    {charStats.BuffsList.length > 0 && <h3 className="input_label">Buffs List :</h3>}
                    {charStats.BuffsList.map((buff, index) => (
                        <div key={index} className="input_entry">
                            <span className="input_field cursor-help" title={buff.Desc}>{buff.Name}</span>
                            {handleRemoveEffect && <button onClick={() => handleRemoveEffect(charStats, buff, "Buff")} className="bg-red-900 text-white p-1"><RxCross1 size={20} /></button>}
                        </div>
                    ))}
                    {charStats.DebuffsList.length > 0 && <h3 className="input_label">Debuffs List :</h3>}
                    {charStats.DebuffsList.map((debuff, index) => (
                        <div key={index} className="input_entry">
                            <span className="input_field cursor-help" title={debuff.Desc}>{debuff.Name}</span>
                            {handleRemoveEffect && <button onClick={() => handleRemoveEffect(charStats, debuff, "Debuff")} className="bg-red-900 text-white p-1"><RxCross1 size={20} /></button>}
                        </div>
                    ))}
                </div>
            </div>
            {showEditButtons && (
                <div className="flex justify-center py-5">
                    <div className="min-w-80 flex justify-around">
                        <CustomEffectFormModal toUpdateCharData={charStats} />
                        {extraButtons}
                    </div>
                </div>
            )}
        </div>
    );
}
