import { useRecoilState, useSetRecoilState } from "recoil";
import { DashButton } from "./DashButton";
import { ShareContentAtom } from "../atoms/AddShareContent";
import { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from "../config";
import { CorrectShareAtom, IncorrectShareAtom } from "../atoms/LoadingAtom";
import { Loader } from "./Loader";
import { Tick } from "./Tick";
import { Cross } from "./Cross";

export function ShareComp(){
        const [loaderText , setLoaderText] = useState("");
    
        const [correct, setCorrect] = useRecoilState(CorrectShareAtom);
        const [incorrect, setIncorrect] = useRecoilState(IncorrectShareAtom);
    

    const setShareContent = useSetRecoilState(ShareContentAtom)
    const [link,setLink] = useState("");
    let [input,setInput] = useState(false);

    function incorrectCreds(){
        setIncorrect(true)
        setTimeout(() => {
            setIncorrect(false);
        }, 1000);
    }

    function correctCreds(){
        setCorrect(true)
        setTimeout(() => {
            setCorrect(false);
        }, 1000);
    }

    function copy(){
        navigator.clipboard.writeText(link).then(function() {
            if(input){
                setLoaderText("Link Copied")
                correctCreds();
            }else {
                setLoaderText("No link to copy")
                incorrectCreds();
            }
          }, function() {
            setLoaderText("Error copying link")
            incorrectCreds();
          });
    }


    async function getShareLink(input:boolean){
        try{
            const response = await axios.post(`${backend_url}/api/v1/brain/share`, {share: input},{headers: {token: localStorage.getItem("token")}});
            
            setLink(`http://localhost:5173/api/v1/brain/${response.data.hash}`)
        }catch(e){
            console.log(e);
        }
    }

    useEffect(() => {
        getShareLink(input);
    },[input]);


    return <div className="flex flex-col gap-4 border-[2px] rounded-xl border-[#13131318] dark:border-[#cacaca21] p-6 z-20 w-[45%] dark:bg-black bg-gray-100 items-center">

        { correct &&  <Loader svg={<Tick />} text={loaderText} /> }
                { incorrect &&  <Loader svg={<Cross />} text={loaderText} /> }
        



        <div className="flex w-full justify-between items-center">
            <p className={`text-black dark:text-[#eeeeee] ${input ? "opacity-100" : "opacity-0"}`}>{link}</p>
            <label onClick={() => setInput(c => !c)} className=" cursor-pointer bg-black-300 relative w-12 h-7 rounded-full bg-[#DEE8FE]">
                <span className={`w-[20px] h-[20px] bg-[#4940B9] absolute rounded-full top-1 ${input ? "left-6" : "left-1"} transition-all duration-300`}></span>
            </label>

        </div>

        <div className="flex w-full justify-between items-center mt-5">
            <DashButton onClick={() => setShareContent(false)} text="Close" color="secondary" textCol="secondary" />
            <DashButton onClick={copy} text="Copy" color="primary" textCol="primary" />
        </div>
    </div>    

}