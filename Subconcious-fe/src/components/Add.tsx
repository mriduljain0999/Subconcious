import { ReactNode, useEffect, useRef, useState } from "react"
import { DashButton } from "./DashButton";
import { AddContentAtom } from "../atoms/AddShareContent";
import { useRecoilState, useSetRecoilState } from "recoil";
import axios from "axios";
import { backend_url } from "../config";
import { CorrectAddAtom, IncorrectAddAtom, LoadingAddAtom } from "../atoms/LoadingAtom";
import { Loader } from './Loader';
import { Spinner } from './Spinner';
import { Tick } from './Tick';
import { Cross } from './Cross';
import { ContentAtom } from "../atoms/ContentAtom";



export function Add(){
    let setContents:any = useSetRecoilState(ContentAtom)
    const setAddContent = useSetRecoilState(AddContentAtom)
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const tagRef = useRef<HTMLInputElement>(null);
    let [selectedTags,setSelectedTags] = useState([]);
    let [selectedTagsId,setSelectedTagsId] = useState([]);
    let [tags,setTags] = useState([]);


    const [loading, setLoading] = useRecoilState(LoadingAddAtom);
    const [loaderText , setLoaderText] = useState("");

    const [correct, setCorrect] = useRecoilState(CorrectAddAtom);
    const [incorrect, setIncorrect] = useRecoilState(IncorrectAddAtom);


    function incorrectCreds(){
        setIncorrect(true)
        setTimeout(() => {
            setIncorrect(false);
        }, 1000);
    }

    function correctCreds(){
        setCorrect(true)
        setTimeout(() => {
            getContent();
            setCorrect(false);
            setAddContent(false)
        }, 1000);
    }

    async function getContent(){
        const response = await axios.get(`${backend_url}/api/v1/content`,{
          headers:{
            token: localStorage.getItem("token")
          }
        })
        setContents(response.data);
      }


    async function submit(){
        try{
            setLoading(true);
            const response = await axios.post(`${backend_url}/api/v1/content`,
                {
                  title: titleRef.current?.value,link: linkRef.current?.value,tags: selectedTagsId,
                },{headers: {token: localStorage.getItem("token"),},}
              );  
              setLoaderText(response.data.message)
              setLoading(false)
              correctCreds();
             
        }catch(e:any){
            setLoaderText("Error creating content")
            setLoading(false);
            incorrectCreds();
        }
    }

    async function getTags(){
        const response = await axios.get(`${backend_url}/api/v1/tags`);
        setTags(response.data)
    }

    async function showTag(e:any){
        if(e.key == "Enter"){
            try{
                const response = await axios.post(`${backend_url}/api/v1/tags`,{
                    title:e.target.value
                })
                if(response.data.status){
                    const newArr:any = [...selectedTags]
                    const newArrId:any = [...selectedTagsId];
                    newArr.push(e.target.value)
                    newArrId.push(response.data.tagId)
                    setSelectedTags(newArr)
                    setSelectedTagsId(newArrId)
                    e.target.value = ""
                }
            }catch(e:any){
                const newArr:any = [...selectedTags]
                newArr.push(e.response.data.title)
                setSelectedTags(newArr)
                const newArrId:any = [...selectedTagsId];
                newArrId.push(e.response.data.tagId)
                setSelectedTagsId(newArrId)
                e.target.value = ""
            }
        }
   }


    useEffect(() => {
        getTags();
    },[]);


    return <div className="flex flex-col gap-4 border-[2px] rounded-xl border-[#1313131f] dark:border-[#cacaca21] p-6 z-20 w-[30%] bg-gray-100 dark:bg-black items-center">

        { correct &&  <Loader svg={<Tick />} text={loaderText} /> }
        { incorrect &&  <Loader svg={<Cross />} text={loaderText} /> }

        { loading && <Loader svg={<Spinner />} text="Please wait" /> }


        <p className="text-xl text-black dark:text-[#eeeeee]">New Content</p>
        <div className='flex flex-col items-start justify-start w-full gap-2'>
            <label className='text-[#000000b9] dark:text-[#9CA3AF] text-sm' htmlFor="title">Title</label>
            <input ref={titleRef} id='title' className='outline-none w-[100%] border-[1px] dark:bg-[#131313] bg-[#F9FBFC] border-[#BDC0C6] dark:border-[#232323] dark:text-gray-300 text-black px-4 p-2 rounded-lg' type="text" placeholder='Title of content' autoFocus />
        </div>

        <div className='flex flex-col items-start justify-start w-full gap-2'>
            <label className='text-[#000000b9] dark:text-[#9CA3AF] text-sm' htmlFor="link">Link</label>
            <input ref={linkRef} id='link' className='outline-none w-[100%] border-[1px]  px-4 p-2 rounded-lg dark:bg-[#131313] bg-[#F9FBFC] border-[#BDC0C6] dark:border-[#232323] dark:text-gray-300 text-black' type="text" placeholder='Link of content' />
        </div>


        <div className="flex items-center gap-1 flex-wrap">
        {selectedTags.map((tag:any): ReactNode => (
            <div className="bg-[#DEE8FE] rounded-full text-[#4940B9] w-fit px-2 py-1">#{tag}</div>
        ))}
        </div>
        
        <input onKeyDown={(e) => showTag(e)} ref={tagRef}  className='flex items-center outline-none w-[100%] border-[1px] px-4 p-2 rounded-lg dark:bg-[#131313] bg-[#F9FBFC] border-[#BDC0C6] dark:border-[#232323] dark:text-gray-300 text-black' list="tags" name="tags" id="tagInput" placeholder="Select tags" />
        <datalist className="appearance-none" id="tags">
        {tags.map((tag: any) => (
            <option key={tag._id} value={tag.title} />
        ))}
        </datalist>

        <div className="flex w-full justify-between items-center mt-5">
            <DashButton onClick={() => setAddContent(false)} text="Close" color="secondary" textCol="secondary" />

            <DashButton onClick={submit} text="Submit" color="primary" textCol="primary" />
        </div>
    </div>
}