import { useEffect, useState } from "react";

interface TerminalPropsInterface{
    fightHistory: string[];
}

export function Terminal ({ fightHistory }: TerminalPropsInterface) {
    const [commandList, setCommandList] = useState<string[]>(fightHistory);

    useEffect(() => {
        setCommandList(fightHistory);
    }, [fightHistory]);

    return (
        <div className="h-100 w-100 bg-black text-lime-400 p-5 flex flex-col rounded-lg">
            <div className="flex-grow border-2 border-lime-400 p-2 overflow-y-auto flex flex-col-reverse scrollbar-hide">
                {commandList.map((cmd, index) => (
                    <div key={index}>{cmd}</div>
                ))}
            </div>
        </div>
    );
};