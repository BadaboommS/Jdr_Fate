import { CharStatsInterface } from "../../types/stats";

interface CharItemPropsInterface {
    charStats: CharStatsInterface;
}

export function CharItem ({ charStats }: CharItemPropsInterface) {
    return (
        <div>
            <h2>{charStats.Name}</h2>
            <p>Type: {charStats.Type}</p>
            {charStats.Variant && <p>Variant: {charStats.Variant}</p>}
            <p>Hp: {charStats.Hp}</p>
            <p>Mana: {charStats.Mana}</p>
            <div className="flex gap-2">
                <h3>Stats:</h3>
                <p>Ini: {charStats.Combat_Stats.Ini}</p>
                <p>SA: {charStats.Combat_Stats.SA}</p>
                <p>AA: {charStats.Combat_Stats.AA}</p>
                <p>DMG: {charStats.Combat_Stats.DMG}</p>
                <p>PA: {charStats.Combat_Stats.PA}</p>
                <p>SD: {charStats.Combat_Stats.SD}</p>
                <p>AD: {charStats.Combat_Stats.AD}</p>
                <p>ReD: {charStats.Combat_Stats.ReD}</p>
                <p>CdC: {charStats.Combat_Stats.CdC}</p>
                <p>CC: {charStats.Combat_Stats.CC}</p>
                <p>AN: {charStats.Combat_Stats.AN}</p>
            </div>
        </div>
    );
};