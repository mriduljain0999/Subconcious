import { ReactNode } from "react"
import { Delete } from "./Delete"
import { Redirect } from "./Redirect"
import axios from "axios"
import { backend_url } from "../config"

import { useSetRecoilState } from "recoil"

import { ContentAtom } from "../atoms/ContentAtom"

interface CardInterface{
    cardLink: string,
    title: string,
    tags: string[],
    icon: ReactNode,
    embed: ReactNode,
    ogLink:string,
    id: string
}

export function Card(props: CardInterface){
    let setContents:any = useSetRecoilState(ContentAtom)
    async function getContent(){
        const response = await axios.get(`${backend_url}/api/v1/content`,{
          headers:{
            token: localStorage.getItem("token")
          }
        })
        setContents(response.data);
      }


    async function handleDelete(){
        try{
            await axios.delete(`${backend_url}/api/v1/content`, {
                headers: {
                  token: localStorage.getItem("token"),
                },
                data: {
                  contentId: props.id,
                },
              });
              getContent();
        }catch(e){
            console.log(e);
        }
          
    }

    const tags = props.tags

    return <div className="flex flex-col gap-5 dark:border-[2px] border-[1.5px] rounded-xl dark:border-[#cacaca21] border-[#E1E6E4] py-2 px-4 h-[350px] lg:max-w-[32%] lg:min-w-[32%]  sm:max-w-[48%] sm:min-w-[48%] max-w-[75%] min-w-[75%]">

        <div className="flex items-center justify-between gap-5">
            <div className="flex gap-2 items-center">
                {props.icon}
                <p className="text-lg text-black dark:font-normal font-medium dark:text-[#eeeeee]">{props.title}</p>
            </div>
            <div className="flex gap-2 items-center">
                <Redirect onTouch={props.ogLink} />
                <Delete onTouch={handleDelete} />
            </div>
        </div>
        <div className="h-[250px] w-[100%] flex items-start justify-center overflow-hidden rounded-lg">{props.embed}</div>
        <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag:any, index): ReactNode => (
                <Tag key={index} title={tag.title} />
            ))}
        </div>

    </div>
}

interface TagInterface{
    title: string
}

function Tag({title}: TagInterface){
    return <div className="bg-[#DEE8FE] rounded-full text-[#4940B9] w-fit px-2 py-1">#{title}</div>
}