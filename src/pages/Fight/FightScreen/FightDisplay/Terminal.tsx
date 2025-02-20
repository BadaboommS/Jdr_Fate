import { useEffect, useState } from "react";
import { fightHistoryType } from "../../../../types/fightType";
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
        <div className="h-[300px] w-full min-w-[30vw] bg-black text-white p-5 flex flex-col rounded-lg cursor-auto">
            <div className="flex-grow border-2 border-white p-2 overflow-y-auto flex flex-col-reverse scrollbar-hide">
            {commandList.map((cmd, index) => (
                <div key={index} className={`terminal_${cmd.msgType}${cmd.msgTitle !== ''? ' cursor-help' : ''}`} title={cmd.msgTitle}>{cmd.historyMsg}</div>
            ))}
            </div>
        </div>
    );
};