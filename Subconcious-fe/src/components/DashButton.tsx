import { ReactNode } from "react";

interface ButtonInterface {
    onClick: () => void;
    text: string;
    svg?: ReactNode;
    color: "primary" | "secondary";
    textCol: "primary" | "secondary";
}

export function DashButton(props: ButtonInterface) {
    return (
        <button
            onClick={props.onClick}
            className={`font-medium md:px-4 px-1 py-1 rounded-lg transition-all duration-300 flex gap-2 items-center border-2 
            ${props.color === "primary" ? "bg-[#6B72FF] border-[#6B72FF]" : "bg-[#DEE8FE] border-[#DEE8FE]"} 
            ${props.textCol === "primary" ? "text-white" : "text-[#4940B9]"}
            dark:hover:bg-black hover:bg-[#F9FBFC] dark:hover:text-white hover:text-[#6B72FF]`}
        >
            {props.svg}
            <p>{props.text}</p>
        </button>
    );
}
