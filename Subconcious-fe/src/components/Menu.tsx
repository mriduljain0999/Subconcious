import { useEffect } from "react";
import { ToggleTabs } from "./ToggleTabs"
import { useRecoilState } from "recoil";
import { DarkMode } from "../atoms/DarkMode";
import { Sun } from "./Sun";
import { Moon } from "./Moon";

export function Menu(){

    const [isDark, setIsDark] = useRecoilState(DarkMode)

    function ToggleDark(){
      setIsDark(c => !c);
    }
  
    useEffect(() => {
      const rootElement = document.documentElement;
      if(isDark){
        rootElement.classList.add('dark');
        localStorage.setItem('theme','dark');
      }
      else{
        rootElement.classList.remove('dark');
        localStorage.setItem('theme','light');
      }
    },[isDark])

    return <div className="min-h-full border-r-[1px] dark:border-r-[2px] dark:border-r-[#131313] border-r-[#cacacaaf] bg-white dark:bg-black lg:w-[18%] md:w-[24%] md:flex hidden flex-col items-start gap-5 lg:p-5 px-2 py-5 overflow-x-hidden">
        <div className="flex w-full gap-3 items-start">
            <p className="text-xl font-mono text-black dark:text-[#6B72FF]">Dashboard</p>
            <button onClick={ToggleDark}>{isDark ? <Moon /> : <Sun />}</button>
        </div>
        <ToggleTabs />
    </div>
}