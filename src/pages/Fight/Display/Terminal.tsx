import { useEffect, useState } from "react";
import { fightHistoryType } from "../../../types/fightType";
import "./terminal.css";

interface TerminalPropsInterface{
    fightHistory: fightHistoryType[];
}



export function Terminal ({ fightHistory }: TerminalPropsInterface) {
    const [commandList, setCommandList] = useState<fightHistoryType[]>(fightHistory);

    useEffect(() => {
        setCommandList(fightHistory);
    }, [fightHistory]);

    return (
        <div className="h-[300px] w-full bg-black text-white p-5 flex flex-col rounded-lg">
            <div className="flex-grow border-2 border-white p-2 overflow-y-auto flex flex-col-reverse scrollbar-hide">
            {commandList.map((cmd, index) => (
                <div key={index} className={`terminal_${cmd.msgType}`}>{cmd.historyMsg}</div>
            ))}
            </div>
        </div>
    );
};