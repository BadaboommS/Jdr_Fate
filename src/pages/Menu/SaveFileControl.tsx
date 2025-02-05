import { useContext, useState } from "react";
import { CharDataContext } from "../../context/CharDataContext";
import { MdSave } from "react-icons/md";

export function SaveFileControl () {
    const { charData } = useContext(CharDataContext);
    const [downloadTimeout, setDownloadTimeout] = useState(false);

    const handleDownload = () => {
        if(downloadTimeout){
            return;
        }

        if(!window.confirm(`Download le fichier des personnages ?`)){
            return;
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(charData));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "Fate_JDR_CharData.json");
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
            <MdSave size="32"/>
            <span className='navbar-tooltip group-hover:scale-100 scale-0'><p>Download File</p></span>
        </div>
    );
};