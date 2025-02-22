import { useState, useContext } from "react";
import { CharBuffInterface, CharDebuffInterface, CharStatsInterface } from "../../../../types/statsType";
import { CustomEffectFormModal } from "../FightCustomControl/CustomEffectFormModal";
import { CustomCaracOverload } from "../FightCustomControl/CustomCaracOverload";
import { DataContext } from "../../../../context/DataContext";
import { exportAllEffects, removeEffect } from "../../../../function/FightCalc";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import './CharSlidePannel.css';

interface SlidePanelProps {
charStats: CharStatsInterface;
  side: "Left" | "Right";
  handleHistoryEventAdd?: (msg: string, type: string, title?: string) => void,
}

export function CharSlidePannel({ charStats, side, handleHistoryEventAdd }: SlidePanelProps) {
    const { charData, setCharData } = useContext(DataContext);
    const [slideOpen, setSlideOpen] = useState(false);
    const effectLog = exportAllEffects(charStats);

    function handleRemoveEffect(charD: CharStatsInterface, effect: CharBuffInterface | CharDebuffInterface, effectType: "Buff" | "Debuff"){
        setCharData(charData.map((char) => char.Id === charD.Id? removeEffect(charD, effect, effectType) : char));
    }

    return (
        <div
            className={`fixed top-0 ${side === "Right" ? "right-0" : "left-0"} h-screen bg-gray-800 text-white shadow-lg overflow-hidden flex items-center justify-center transition-transform duration-300 ease-in-out w-[40vw]`}
            style={{ transform: slideOpen ? "translateX(0)" : side === "Right" ? "translateX(95%)" : "translateX(-95%)", height: "100vh" }}
        >
            {slideOpen && (
                <div className={`close_button !hover:bg-white ${side === "Right" ? "left-5" : "right-5"}`} onClick={() => setSlideOpen(false)}>
                    <RxCross1 size={16} />
                </div>
            )}
            {!slideOpen && (
                <div className={`slide_arrow p-1 ${side === "Right"? "left-0" : "right-0"}`} onClick={() => setSlideOpen(!slideOpen)}>
                    {side === "Right" ? <FaArrowLeft size={32} /> : <FaArrowRight size={32} /> }
                </div>
            )}
            <div className={`flex flex-col gap-2 justify-center items-start h-screen w-[90%] mx-auto ${side === "Right"? "pl-10" : "pr-10"}`}>
                <h2>Alteration de: {charStats.Name}</h2>
                {effectLog[0] && 
                    <div className="input_group w-full">
                        <div className="flex">
                            <p className="input_label">Name</p>
                            <p className="input_label">Effect</p>
                        </div>
                        <div>
                            {effectLog.map(entry => (
                                <div className="input_entry">
                                    <p className="input_field bg-[#DFDDCF]">{entry.Name}</p>
                                    <p className="input_field bg-[#DFDDCF]">{entry.Effect}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                <div className="grid grid-cols-2 min-w-full">
                    <div className="input_group">
                        <h3 className="input_label">Buffs List :</h3>
                        {charStats.BuffsList[0]?
                            charStats.BuffsList.map((buff, index) => (
                                <div key={index} className="input_entry bg-[#DFDDCF]">
                                    <span className="input_field cursor-help" title={buff.Desc}>{buff.Name}</span>
                                    <CustomEffectFormModal toEditCharData={charStats} toEdit={buff} toEditEffectType='Buff' />
                                    {handleRemoveEffect && <button onClick={() => handleRemoveEffect(charStats, buff, "Buff")} className="bg-red-900 text-white hover:text-red-900 hover:bg-white transition-all p-1 cursor-pointer" title="Supprimer Effet"><RxCross1 size={20} /></button>}
                                </div>
                            ))
                            : <p className="input_field bg-[#DFDDCF]">No buffs.</p>
                        }
                    </div>
                    <div className="input_group">
                        <h3 className="input_label">Debuffs List :</h3>
                        {charStats.DebuffsList[0]?
                            charStats.DebuffsList.map((debuff, index) => (
                                <div key={index} className="input_entry bg-[#DFDDCF]">
                                    <span className="input_field cursor-help" title={debuff.Desc}>{debuff.Name}</span>
                                    <CustomEffectFormModal toEditCharData={charStats} toEdit={debuff} toEditEffectType='Debuff' />
                                    {handleRemoveEffect && <button onClick={() => handleRemoveEffect(charStats, debuff, "Debuff")} className="bg-red-900 text-white hover:text-red-900 hover:bg-white transition-all p-1 cursor-pointer" title="Supprimer Effet"><RxCross1 size={20} /></button>}
                                </div>
                            ))
                            : <p className="input_field bg-[#DFDDCF]">No debuffs.</p>
                        }
                    </div>
                </div>
                <div className="flex justify-center gap-2 w-full">
                    <CustomEffectFormModal toEditCharData={charStats} handleHistoryEventAdd={handleHistoryEventAdd} />
                    <CustomCaracOverload toEditCharData={charStats} handleHistoryEventAdd={handleHistoryEventAdd} />
                </div>
            </div>
        </div>
    );
};