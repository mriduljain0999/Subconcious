import { useNavigate } from "react-router-dom"
import { DashButton } from "./DashButton"
import { Logout } from "./Logout"
import { Plus } from "./Plus"
import { Share } from "./Share"
import { Search } from "./Search"
import { ShareContentAtom, AddContentAtom } from "../atoms/AddShareContent"
import { useRecoilState, useSetRecoilState } from "recoil"
import axios from "axios"
import { backend_url } from "../config"
import { ContentAtom } from "../atoms/ContentAtom"
import { useEffect, useRef, useState } from "react"
import { CorrectAIAtom, IncorrectAIAtom, LoadingAIAtom } from "../atoms/LoadingAtom"
import { Tick } from "./Tick"
import { Loader } from "./Loader"
import { Cross } from "./Cross"
import { Spinner } from "./Spinner"
import { useDebounce } from "./useDebounce"


export function NavBar(){
    const navigate = useNavigate();
    const setAddContent = useSetRecoilState(AddContentAtom)
    const setShareContent = useSetRecoilState(ShareContentAtom)
    const setContents:any = useSetRecoilState(ContentAtom)
    let ogContents: any = useRef([]);

    async function getContent() {
        const response = await axios.get(`${backend_url}/api/v1/content`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        setContents(response.data);
        ogContents.current = response.data; 
      }

      const [loading, setLoading] = useRecoilState(LoadingAIAtom);
          const [loaderText , setLoaderText] = useState("");
      
          const [correct, setCorrect] = useRecoilState(CorrectAIAtom);
          const [incorrect, setIncorrect] = useRecoilState(IncorrectAIAtom);
          const [inputVal,setInputVal] = useState();
          const debouncedVal = useDebounce(inputVal,500);
      
      
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

    
      useEffect(() => {
        getContent();
      }, []);

      useEffect(() => {
        searchSimilarity();
      },[debouncedVal])
    

      async function searchSimilarity() {
            try {
                setLoading(true);
                let contentSimilarityList: any[] = []; 
                
                for (const content of ogContents.current) {
                    const response = await axios.post(`${backend_url}/api/v1/embed`, {
                        sentence1: debouncedVal,
                        sentence2: content.title,
                    });
                    contentSimilarityList.push({
                        content: content,
                        similarity: response.data.similarity
                    });
                }
                contentSimilarityList.sort((a, b) => b.similarity - a.similarity);
                setContents(contentSimilarityList.map(item => item.content));
                setLoading(false);
                setLoaderText("Filtered using AI")
                correctCreds();
    
            } catch (error) {
                setLoading(false);
                console.log(error)
                setLoaderText("Try again");
                incorrectCreds();
            }
        
    }

    function changeValue(e:any){
        setInputVal(e.target.value)
    }
    
    


    function add(){
        setAddContent(true);
    }

    function share(){
        setShareContent(true);
    }

    function logout(){
        localStorage.removeItem("token");
        navigate("/signin");
    }

    return <div className="flex w-full gap-4 lg:justify-between md:justify-end justify-center md:relative fixed bottom-3 left-[0%]">

         { correct &&  <Loader svg={<Tick />} text={loaderText} /> }
                { incorrect &&  <Loader svg={<Cross />} text={loaderText} /> }
        
                { loading && <Loader svg={<Spinner />} text="Please wait" /> }

        <div className="relative items-center lg:flex hidden">
        <Search />
        <input onChange={(e) => changeValue(e)} className="outline-none border-[1px] px-10 py-2 rounded-lg dark:bg-[#131313] bg-[#F9FBFC] border-[#BDC0C6] dark:border-[#232323] dark:text-gray-300 text-black" type="text" placeholder="Search content using AI"/>
        </div>


        <div className="flex gap-4 px-4 rounded-2xl py-3 dark:bg-[#131313] bg-gray-100 border-[1.5px] dark:border-[#242424] border-[#75797f61] md:border-0 dark:md:bg-black md:bg-[#F9FBFC]">
            <DashButton color="primary" textCol="primary" text="Add content" svg={<Plus />} onClick={add} />
            <DashButton color="secondary" textCol="secondary" text="Share" svg={<Share />} onClick={share} />
            <DashButton color="secondary" textCol="secondary" text="Logout" svg={<Logout />} onClick={logout} />
        </div>
    </div>
}