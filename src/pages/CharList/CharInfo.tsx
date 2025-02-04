import { CharStatsInterface } from "../../types/stats";

interface CharInfoPropsInterface {
    charStats: CharStatsInterface;
    handleSetEdit: () => void;
    handleCloseModal: () => void;
}

export function CharInfo ({ charStats, handleSetEdit, handleCloseModal }: CharInfoPropsInterface) {

    return (
        <>
            <div>
                <h2>{charStats.Name}</h2>
                <p>Type: {charStats.Type}</p>
                {charStats.Variant && <p>Variant: {charStats.Variant}</p>}
                <p>Hp: {charStats.Hp}</p>
                <p>Mana: {charStats.Mana}</p>
                <h3>Caracteristics:</h3>
                <ul>
                    {Object.entries(charStats.Caracteristics).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                    ))}
                </ul>
                <h3>Combat Stats:</h3>
                <ul>
                    {Object.entries(charStats.Combat_Stats).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                    ))}
                </ul>
                <div className="flex justify-center py-5">
                    <div className="min-w-80 flex justify-around">
                        <button onClick={handleSetEdit} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Edit</button>
                        <button onClick={handleCloseModal} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">Cancel</button>
                    </div>
                </div>
            </div>
        </>
    );
};