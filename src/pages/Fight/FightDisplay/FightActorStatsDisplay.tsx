import { CharStatsInterface } from "../../../types/statsType";
import { RxCross1 } from "react-icons/rx";

interface FightActorStatsDisplayInterface {
    characterData: CharStatsInterface;
    handleDeleteBuff: (charId: number, debuffName: string) => void;
    handleDeleteDebuff: (charId: number, debuffName: string) => void;
}

export function FightActorStatsDisplay({ characterData, handleDeleteDebuff, handleDeleteBuff }: FightActorStatsDisplayInterface){
    return (
        //<div className="flex flex-col">
            <div className="grid grid-cols-2 gap-2 items-start">
                <div className="input_group min-w-[200px]">
                    <h3 className="input_label">Base Info :</h3>
                    <div className="input_entry">
                        <div className="input_label">Name: </div>
                        <div className="input_field">{characterData.Name}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Joueur: </div>
                        <div className="input_field">{characterData.Joueur}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Type: </div>
                        <div className="input_field">{characterData.Type}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Arme: </div>
                        <div className="input_field cursor-help" title={characterData.Weapon.WeaponType}>{characterData.Weapon.WeaponName}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Arme Dmg: </div>
                        <div className="input_field">{characterData.Weapon.WeaponDmg}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Armor: </div>
                        <div className="input_field">{characterData.Armor}</div>
                    </div>
                    {characterData.Variant && (
                        <div className="input_entry">
                            <div className="input_label">Variant: </div>
                            <div className="input_field">{characterData.Variant}</div>
                        </div>
                    )}
                    <div className="input_entry">
                        <div className="input_label">Hp: </div>
                        <div className="input_field">{characterData.Hp}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Mana: </div>
                        <div className="input_field">{characterData.Mana}</div>
                    </div>
                    <h3 className="input_label">Caracteristics :</h3>
                    {Object.entries(characterData.Caracteristics).map(([key, value]) => (
                        <div key={key} className="input_entry">
                            <span className="input_label">{key}: </span>
                            <span className="input_field">{value}</span>
                        </div>
                    ))}
                </div>
                <div className="input_group min-w-[200px]">
                    <h3 className="input_label">Combat Stats :</h3>
                    {Object.entries(characterData.CombatStats).map(([key, value]) => (
                        <div key={key} className="input_entry">
                            <span className="input_label">{key}: </span>
                            <span className="input_field">{value}</span>
                        </div>
                    ))}
                    {
                        (characterData.BuffsList.length > 0)
                            ?   <>
                                    <h3 className="input_label">Buffs List :</h3>
                                    {Object.entries(characterData.BuffsList).map(([key, value]) => (
                                        <div key={key} className="input_entry">
                                            <span className="input_field cursor-help" title={value.Desc}>{value.Name}</span>
                                            <button onClick={() => handleDeleteBuff(characterData.Id, value.Name)} className="bg-red-900 text-white hover:bg-white hover:text-red-900 cursor-pointer p-1 transition-all"><RxCross1 size={20}/></button>
                                        </div>
                                    ))}
                                </>
                            : <></>
                    }
                    {
                        (characterData.DebuffsList.length > 0)
                            ?   <>
                                    <h3 className="input_label">Debuffs List :</h3>
                                    {Object.entries(characterData.DebuffsList).map(([key, value]) => (
                                        <div key={key} className="input_entry">
                                            <span className="input_field cursor-help" title={value.Desc}>{value.Name}</span>
                                            <button onClick={() => handleDeleteDebuff(characterData.Id, value.Name)} className="bg-red-900 text-white hover:bg-white hover:text-red-900 cursor-pointer p-1 transition-all"><RxCross1 size={20}/></button>
                                        </div>
                                    ))}
                                </>
                            : <></>
                    }
                </div>
            </div>
            //{(characterData.Variant) && <div><img src={`./assets/servant_img/${characterData.Variant}.png`} className="w-fit h-fit variant_img"/></div>}
        //</div>
    )
}