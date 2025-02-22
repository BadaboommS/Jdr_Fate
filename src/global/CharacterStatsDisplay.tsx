import { RxCross1 } from "react-icons/rx";
import { CustomEffectFormModal } from "../pages/Fight/FightScreen/FightCustomControl/CustomEffectFormModal";
import { CharStatsInterface, CharBuffInterface, CharDebuffInterface, CombatStatsTitle } from "../types/statsType";

interface CharacterStatsDisplayProps {
    charStats: CharStatsInterface;
    handleHistoryEventAdd?: (msg: string, type: string, title?: string) => void,
    handleRemoveEffect?: (charD: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface, effectType: "Buff" | "Debuff") => void;
    showVariant?: boolean;
}

export function CharacterStatsDisplay({ charStats, handleRemoveEffect, showVariant }: CharacterStatsDisplayProps) {
    const charCarOverloadCapacity = charStats.CaracteristicsOverload.capacity;
    const charCarOverloadActive = charStats.CaracteristicsOverload.active;
    const charCarBuff = charStats.CaracteristicsBuff;

    return (
        <div className="flex flex-col gap-1">
            <div className={`grid ${showVariant? 'grid-cols-3' : 'grid-cols-2'} gap-2 items-start`}>
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
                                <span className={`input_field`}>
                                    <span className={`${charCarOverloadActive[key as keyof typeof charCarOverloadActive] > 0? "text-blue-500 font-bold": ""}`}>
                                        {value}
                                    </span>
                                    {charCarOverloadCapacity[key as keyof typeof charCarOverloadCapacity] !== 0 &&
                                        [...Array(Math.abs(charCarOverloadCapacity[key as keyof typeof charCarOverloadCapacity]))].map((_, index) => (
                                            <span key={index} className={index < (charCarOverloadActive[key as keyof typeof charCarOverloadActive] || 0)
                                                ? "text-blue-500 font-bold"
                                                : ""
                                                }
                                            >{charCarOverloadCapacity[key as keyof typeof charCarOverloadCapacity] > 0 ? "+" : "-"}</span>
                                        ))
                                    }
                                    <span className={`${charCarBuff[key as keyof typeof charStats.Caracteristics]? charCarBuff[key as keyof typeof charStats.Caracteristics] < 0? "!text-red-500 font-bold" : "!text-blue-500 font-bold" : ""}`}>
                                        {charCarBuff[key as keyof typeof charStats.Caracteristics] !== 0 && ` ${charCarBuff[key as keyof typeof charStats.Caracteristics] > 0
                                            ? `+${charCarBuff[key as keyof typeof charStats.Caracteristics]}`
                                            : charCarBuff[key as keyof typeof charStats.Caracteristics]}`
                                        }
                                    </span>
                                </span>
                            </div>
                        ))}
                </div>
                {(showVariant && charStats.Variant)
                    ?   <div className="flex justify-center">
                            <img src={`./assets/servant_img/${charStats.Variant}.png`} className="w-fit h-fit variant_img"/>
                        </div>
                    : <></>
                }
                <div className="input_group min-w-[200px]">
                    <h3 className="input_label">Combat Stats :</h3>
                    {Object.entries(charStats.CombatStats).map(([key, value]) => (
                        <div key={key} className="input_entry">
                            <span className="input_label" title={CombatStatsTitle[key as keyof typeof charStats.CombatStats]}>{key} :</span>
                            <span className={`input_field ${value < charStats.InitCombatStats[key as keyof typeof charStats.CombatStats] ? '!text-red-500' : ''} ${value > charStats.InitCombatStats[key as keyof typeof charStats.CombatStats] ? '!text-blue-500' : ''}`}>{value}</span>
                        </div>
                    ))}
                    {handleRemoveEffect &&
                        <>
                            {charStats.BuffsList.length > 0 && <h3 className="input_label">Buffs List :</h3>}
                            {charStats.BuffsList.map((buff, index) => (
                                <div key={index} className="input_entry">
                                    <span className="input_field cursor-help" title={buff.Desc}>{buff.Name}</span>
                                    <CustomEffectFormModal toEditCharData={charStats} toEdit={buff} toEditEffectType='Buff' />
                                    {handleRemoveEffect && <button onClick={() => handleRemoveEffect(charStats, buff, "Buff")} className="bg-red-900 text-white hover:text-red-900 hover:bg-white transition-all p-1 cursor-pointer" title="Supprimer Effet"><RxCross1 size={20} /></button>}
                                </div>
                            ))}
                            {charStats.DebuffsList.length > 0 && <h3 className="input_label">Debuffs List :</h3>}
                            {charStats.DebuffsList.map((debuff, index) => (
                                <div key={index} className="input_entry">
                                    <span className="input_field cursor-help" title={debuff.Desc}>{debuff.Name}</span>
                                    <CustomEffectFormModal toEditCharData={charStats} toEdit={debuff} toEditEffectType='Debuff' />
                                    {handleRemoveEffect && <button onClick={() => handleRemoveEffect(charStats, debuff, "Debuff")} className="bg-red-900 text-white hover:text-red-900 hover:bg-white transition-all p-1 cursor-pointer" title="Supprimer Effet"><RxCross1 size={20} /></button>}
                                </div>
                            ))}
                        </>
                    }
                </div>
            </div>
        </div>
    );
}
