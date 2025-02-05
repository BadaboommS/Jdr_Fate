import React, { useContext, useRef } from 'react';
import { DataContext } from '../../context/DataContext';
import { CharStatsInterface } from '../../types/statsType';
import { FilterSettingsInterface } from '../../types/filterType';
import { FightListInterface } from '../../types/fightType';

interface FileDataInterface {
    filter_data: FilterSettingsInterface[];
    characters_data: CharStatsInterface[];
    fight_data: FightListInterface[];
    player_data: string[];
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

                        const char_data = json.characters_data;
                        const filter_data = json.filter_data;
                        const fight_data = json.fight_data;
                        const player_data = json.player_data;

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
        <div>
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleFileImport}
                style={{ display: 'none' }}
            />
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer" onClick={() => fileInputRef.current?.click()}>Import JSON File</button>
        </div>
    );
};