import { useEffect, useState } from "react";

export function useDebounce(value:any ,delay: number){
    const [debouncedValue,setDebouncedValue] = useState(value);


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }),[value]

    return debouncedValue;
}