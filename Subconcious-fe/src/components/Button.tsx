interface ButtonInterface {
    onClick: () => void
    text: string
}

export function Button(props: ButtonInterface){
    return <button onClick={props.onClick} className="text-black font-medium px-4 py-1 rounded-lg bg-[#EEEEEE] border-2 border-white hover:bg-black hover:text-[#eeeeee] transition-all duration-300">{props.text}</button>
}