import { NavBar } from "./NavBar"
import { Main } from "./Main"
import { MainMenu } from "./MainMenu"

export function Content(){
    return <div className="bg-[#F9FBFC] dark:bg-black w-full flex flex-col gap-10 p-6 overflow-x-hidden">
        <MainMenu />
        <NavBar />
        <Main />
    </div>
}