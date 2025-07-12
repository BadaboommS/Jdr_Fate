import { useState } from 'react';
import { MdSave } from 'react-icons/md';

export function SaveFileControl() {
    const [downloadTimeout, setDownloadTimeout] = useState(false);

    const handleDownload = () => {
        if (downloadTimeout) return;

        if (!window.confirm(`Télécharger La partie ?`)) return;

        const allLocalStorage: Record<string, any> = {};

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                try {
                    allLocalStorage[key] = JSON.parse(localStorage.getItem(key) as string);
                } catch {
                    allLocalStorage[key] = localStorage.getItem(key);
                }
            }
        }

        console.log("allLocalStorage");
        console.log(allLocalStorage);

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allLocalStorage, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "Fate_JDR_GameBackup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        setDownloadTimeout(true);
        const timeout = setTimeout(() => {
            setDownloadTimeout(false);
        }, 5000);

        return () => clearTimeout(timeout);
    };

    return (
        <div className='navbar-icon group' onClick={handleDownload}>
            <MdSave size={32} />
            <span className='navbar-tooltip group-hover:scale-100 scale-0'>
                <p>Download Cache</p>
            </span>
        </div>
    );
}