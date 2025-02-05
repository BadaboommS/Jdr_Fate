import React, { useContext, useRef } from 'react';
import { CharDataContext } from '../../context/CharDataContext';
import { CharStatsInterface } from '../../types/statsType';
import { SettingsInterface } from '../../types/settingsType';

interface FileDataInterface {
    settings: SettingsInterface;
    characters_data: CharStatsInterface[];
}

export function FileMenu () {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setCharData, setSettingsData } = useContext(CharDataContext);

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
                        const settings_data = json.settings;

                        setCharData(char_data);
                        setSettingsData(settings_data);
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
            <h1>Import JSON File or Create New File</h1>
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleFileImport}
                style={{ display: 'none' }}
            />
            <button onClick={() => fileInputRef.current?.click()}>Import JSON File</button>
        </div>
    );
};