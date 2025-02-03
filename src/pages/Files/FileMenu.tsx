import React, { useContext, useRef } from 'react';
import { CharDataContext } from '../../context/CharDataContextProvider';

export function FileMenu () {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setCharData } = useContext(CharDataContext);

    function handleFileImport(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                if (content) {
                    try {
                        const json = JSON.parse(content as string);
                        console.log('Imported JSON:', json);
                        setCharData(json);
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