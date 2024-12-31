import { Menu } from "./Menu"
import { Content } from "./Content"
import { ShareContentAtom, AddContentAtom } from "../atoms/AddShareContent"
import { useRecoilState } from "recoil"
import { Add } from "./Add"
import { ShareComp } from "./ShareComp"

export function Dashboard(){
    
    const [ addContent , setAddContent ] = useRecoilState(AddContentAtom)
    const [shareContent, setShareContent] = useRecoilState(ShareContentAtom);
 
    return <div className="flex min-h-screen max-w-screen text-[#eeeeee] overflow-x-hidden">
        {addContent && <div onClick={() => setAddContent(false)} className="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm z-10"></div>}
        {addContent && <div className="absolute flex items-center justify-center w-full h-screen"><Add /></div> }


        {shareContent && <div onClick={() => setShareContent(false)} className="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm z-10"></div>}
        {shareContent && <div className="absolute flex items-center justify-center w-full h-screen"><ShareComp /></div> }

        <Menu />
        <Content />
    </div>
}