import React, { useContext, useRef } from 'react';
import { DataContext } from '../../context/DataContext';
import { CharStatsInterface } from '../../types/statsType';
import { FilterSettingsInterface } from '../../types/filterType';
import { FightListInterface } from '../../types/fightType';
import { BsFiles } from "react-icons/bs";

interface FileDataInterface {
    filterData: FilterSettingsInterface[];
    charData: CharStatsInterface[];
    fightData: FightListInterface[];
    playerData: string[];
}

export function FileMenu () {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setCharData, setFilterData, setFightData, setPlayerData } = useContext(DataContext);

    function handleFileImport(event: React.ChangeEvent<HTMLInputElement>) {

        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                if (content) {
                    try {
                        const json: FileDataInterface = JSON.parse(content as string);

                        const char_data = json.charData;
                        const filter_data = json.filterData;
                        const fight_data = json.fightData;
                        const player_data = json.playerData;

                        console.log("FION");
                        console.log(player_data);
                        console.log(char_data);
                        console.log(fight_data);
                        console.log(filter_data);

                        setCharData(char_data);
                        setFilterData(filter_data);
                        setFightData(fight_data);
                        setPlayerData(player_data);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                }
            };
            reader.readAsText(file);
        }
    }

    return (
        <div style={{margin: 'auto', marginTop: '4em'}}>
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleFileImport}
                style={{ display: 'none' }}
            />
            <button className="font-semibold py-2 px-4 shadow cursor-pointer" style={{color: '#f2e7e3', display: 'flex', backgroundColor: '#fd4a4a', padding: '1em', borderRadius: '1em'}} onClick={() => fileInputRef.current?.click()}><BsFiles size={32}/><p style={{marginLeft: '0.6em', fontSize: '1.4em'}}>Importer une partie</p></button>
        </div>
    );
};