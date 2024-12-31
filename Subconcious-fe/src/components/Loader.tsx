import { ReactNode } from "react"

interface loading{
    text: string,
    svg: ReactNode
}


export function Loader(props: loading){
    return <div className={`w-[70%] flex justify-center items-start absolute top-4 overflow-hidden`}>
        <button type="button" className="bg-[#eeeeee] flex items-center gap-2 rounded-lg text-black py-2 px-3 z-50" disabled>
    {props.svg}
    <p className="text-sm">{props.text}</p>
</button>
    </div>
}