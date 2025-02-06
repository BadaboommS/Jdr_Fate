import { CharStatsInterface } from "../../types/statsType";

interface FightActorStatsDisplayInterface {
    characterData: CharStatsInterface
}

export function FightActorStatsDisplay({ characterData }: FightActorStatsDisplayInterface){
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
                        <div className="input_field">{characterData.Arme}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">ArmeDMG: </div>
                        <div className="input_field">{characterData.ArmeDMG}</div>
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
                    {Object.entries(characterData.Combat_Stats).map(([key, value]) => (
                        <div key={key} className="input_entry">
                            <span className="input_label">{key}: </span>
                            <span className="input_field">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
            //{(characterData.Variant) && <div><img src={`./assets/servant_img/${characterData.Variant}.png`} className="w-fit h-fit variant_img"/></div>}
        //</div>
    )
}