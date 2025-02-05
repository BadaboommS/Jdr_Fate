/* import { useEffect } from "react";
import { fileService } from "./fileService";

export function Login() {

    function handleDownload(){
        console.log(fileService.downloadFile);
    }
    
    useEffect(() => {
        fileService.initClient();
    }, []);

    return (
        <div>
            <button onClick={fileService.login}>Login</button>
            <button onClick={() => handleDownload()}>Download File</button>
        </div>
    );
}; */