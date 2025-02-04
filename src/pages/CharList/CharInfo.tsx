import { CharStatsInterface } from "../../types/stats";

interface CharInfoPropsInterface {
    charStats: CharStatsInterface;
    handleSetEdit: () => void;
    handleCloseModal: () => void;
}

export function CharInfo ({ charStats, handleSetEdit, handleCloseModal }: CharInfoPropsInterface) {

    return (
        <>
            <div className="flex gap-2">
                <div className="input_group min-w-[200px]">
                    <div className="input_entry">
                        <div className="input_label">Name: </div>
                        <div className="input_field">{charStats.Name}</div>
                    </div>
                    <div className="input_entry">
                        <div className="input_label">Type: </div>
                        <div className="input_field">{charStats.Type}</div>
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
                    <h3 className="input_label">Caracteristics:</h3>
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
                    <h3 className="input_label">Combat Stats:</h3>
                    {Object.entries(charStats.Combat_Stats).map(([key, value]) => (
                        <div key={key} className="input_entry">
                            <span className="input_label">{key}: </span>
                            <span className="input_field">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center py-5">
                <div className="min-w-80 flex justify-around">
                    <button onClick={handleSetEdit} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Edit</button>
                    <button onClick={handleCloseModal} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Cancel</button>
                </div>
            </div>
        </>
    );
};