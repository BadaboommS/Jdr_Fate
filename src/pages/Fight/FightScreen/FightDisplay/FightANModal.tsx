import { useContext, useState } from "react";
import { Modal } from "../../../../global/Modal";
import { BuffInterface, CharStatsInterface } from "../../../../types/statsType";
import { DataContext } from "../../../../context/DataContext";
import { addEffect } from "../../../../function/FightCalc";

interface CharItemPropsInterface {
    toEditCharData: CharStatsInterface;
}

export function FightANModal ({ toEditCharData }: CharItemPropsInterface) {
    const { charData, setCharData } = useContext(DataContext);
    const [showModal, setShowModal] = useState(false);

    function handleANGet(){
        const AAUse = Number((document.getElementById('AA_input_use') as HTMLInputElement).value);
        const ADUse = Number((document.getElementById('AD_input_use') as HTMLInputElement).value);
        const ANGet = AAUse + ADUse;
        if(!window.confirm(`Sacrifier ${AAUse} AA et ${ADUse} AD pour gagner ${ANGet} AN ?`)){ return; };
        if(toEditCharData.CombatStats.AA < AAUse || toEditCharData.CombatStats.AD < ADUse){ 
            window.alert(`${toEditCharData.Name} n'a pas assez d'AA ou AD ! ( AA: ${toEditCharData.CombatStats.AA} | AD: ${toEditCharData.CombatStats.AD})`);
            return; 
        };
        const addedANCharData = { ...toEditCharData, CombatStats: { ...toEditCharData.CombatStats, AN: (toEditCharData.CombatStats.AN + ANGet) }}
        const debuff: BuffInterface = { Name: "Sacrifice de AN", Desc: `Vous avez sacrifié ${AAUse} AA et ${ADUse} AD pour gagner ${ANGet} AN ce tour.
# Effet a enlever manuellement par le MJ.`, Effect: { CombatStats: { AA: -AAUse, AD: -ADUse }}}
        const addedBuffCharData = addEffect(addedANCharData, debuff, "Debuff");
        setCharData(charData.map((char) => char.Id === addedBuffCharData.Id? addedBuffCharData: char));
    }

    function handleANUse(){
        const AAGet = (Math.floor(Number((document.getElementById('AA_input_get') as HTMLInputElement).value) / 2)) * 2;
        const ADGet = (Math.floor(Number((document.getElementById('AD_input_get') as HTMLInputElement).value) / 2)) * 2;
        const ANUse = AAGet + ADGet;
        if(!window.confirm(`Sacrifier ${ANUse} AN pour gagner ${AAGet} AA et ${ADGet} AD ?`)){ return; };
        if(toEditCharData.CombatStats.AN < ANUse){ 
            window.alert(`${toEditCharData.Name} n'a pas assez de AN ! (${toEditCharData.CombatStats.AN})`);
            return; 
        };
        const removedANCharData = { ...toEditCharData, CombatStats: { ...toEditCharData.CombatStats, AN: (toEditCharData.CombatStats.AN - ANUse) }}
        const buff: BuffInterface = { Name: "Sacrifice de AA | AD", Desc: `Vous avez utilisé ${ANUse} AN pour gagner ${AAGet} AA et ${ADGet} AD ce tour.
# Effet a enlever manuellement par le MJ.` };
        const addedDebuffCharData = addEffect(removedANCharData, buff, "Buff");
        setCharData(charData.map((char) => char.Id === addedDebuffCharData.Id? addedDebuffCharData: char));
    }

    function handleModalClose(){
        (document.getElementById('AA_input_use') as HTMLInputElement).value = '';
        (document.getElementById('AD_input_use') as HTMLInputElement).value = '';
        (document.getElementById('AA_input_get') as HTMLInputElement).value = '';
        (document.getElementById('AD_input_get') as HTMLInputElement).value = '';
        setShowModal(false);
    }

    return (
        <>
            <button onClick={() => setShowModal(true)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">AN</button>
            {
                (showModal)
                ?   <Modal isOpen={showModal} onClose={() => handleModalClose()}>
                        <div className="flex flex-col gap-2 max-w-80">
                            <div className="flex flex-col gap-2 text-center">
                                <h2 className="text-xl">Convertir des AN</h2>
                                <div>
                                    <p>Il est possible de convertir 1 AA ou 1AD en 1 AN mais il faut convertir 2AN pour obtenir 1AA ou 1AD.</p>
                                    <p>Les AA et AD se récupèrent le prochain tour.</p>
                                </div>
                            </div>
                            <div className="input_group gap-2">
                                <h2 className="input_label">Convertir AA / AD en AN.</h2>
                                <div className="input_entry">
                                    <label htmlFor="AA_input_use" className="input_label">AA: </label>
                                    <input type="number" id="AA_input_use" className="input_field" defaultValue={0} />
                                </div>
                                <div className="input_entry">
                                    <label htmlFor="AD_input_use" className="input_label">AD: </label>
                                    <input type="number" id="AD_input_use" className="input_field" defaultValue={0} />
                                </div>
                                <div className='flex justify-around items-center'>
                                    <button type="button" onClick={() => handleANGet()} className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer'>Sacrifier AA / AD</button>
                                </div>
                            </div>
                            <div className="input_group gap-2">
                                <h2 className="input_label">Convertir AN en AA / AD.</h2>
                                <div className="input_entry">
                                    <label htmlFor="AA_input_get" className="input_label">AA: </label>
                                    <input type="number" id="AA_input_get" className="input_field" defaultValue={0} />
                                </div>
                                <div className="input_entry">
                                    <label htmlFor="AD_input_get" className="input_label">AD: </label>
                                    <input type="number" id="AD_input_get" className="input_field" defaultValue={0} />
                                </div>
                                <div className='flex justify-around items-center'>
                                    <button type="button" onClick={() => handleANUse()} className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer'>Sacrifier AN</button>
                                </div>
                            </div>
                            <div className='flex justify-end items-center'>
                                <button type="button" onClick={() => handleModalClose()} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Cancel</button>
                            </div>
                        </div>
                    </Modal>
                :   <></>
            }
        </>
    );
};