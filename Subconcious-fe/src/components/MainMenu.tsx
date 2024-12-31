import { useRecoilState } from "recoil";
import { ToggleTabs } from "./ToggleTabs"
import { DarkMode } from "../atoms/DarkMode";
import { Moon } from "./Moon";
import { Sun } from "./Sun";

export function MainMenu(){
     const [isDark, setIsDark] = useRecoilState(DarkMode)
    
        function ToggleDark(){
          setIsDark(c => !c);
        }

    return <div className="md:hidden flex justify-center px-4 rounded-2xl py-1 bg-gray-100 dark:bg-[#131313] border-[1.5px] border-[#75797f61] dark:border-[#242424] sm:w-[60%] w-[100%] mx-auto gap-8 items-center">
        <button onClick={ToggleDark}>{isDark ? <Moon /> : <Sun />}</button>
        <ToggleTabs />
    </div>
}