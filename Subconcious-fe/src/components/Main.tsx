import { Twitter } from "./Twitter";
import { Youtube } from "./Youtube";
import { Notion } from "./Notion";
import notionImg from '../assets/notion.png'
import axios from "axios";
import { useEffect } from "react";
import { backend_url } from '../config';
import { Card } from "./Card";
import { ContentAtom } from "../atoms/ContentAtom";
import { useRecoilState } from "recoil";
import { SkeletonAtom } from "../atoms/SkeletonAtom";
import { SkeletonComp } from "./SkeletonComp";

export function Main(){
  let [contents,setContents]:any = useRecoilState(ContentAtom)
  const [skeleton,setSkeleton] = useRecoilState(SkeletonAtom)

  async function getContent(){
    setSkeleton(true);
    const response = await axios.get(`${backend_url}/api/v1/content`,{
      headers:{
        token: localStorage.getItem("token")
      }
    })
    setSkeleton(false)
    setContents(response.data);
  }

    useEffect(() => {
      getContent();
    },[])  

    return <div className="flex flex-wrap gap-4 items-start sm:justify-start justify-center w-full">
      {skeleton && <SkeletonComp />}

      {contents.map((content:any,index:number) => {
        let link = content.link;
        let ogLink = content.link
        let embed;
        let icon;
        let id = content._id;


        if(link.includes("x.com") || link.includes("twitter.com")){
          link = link?.replace("x.com","twitter.com")
          icon = <Twitter />   
          embed = <blockquote className="twitter-tweet object-cover">
          <p className="text-black dark:text-[#eeeeee]" lang="en" dir="ltr">
            Your tweet content will automatically appear here.
            <a href={`${link}`}></a>
          </p>
        </blockquote>
        }
        else if(link.includes("youtube")){
          link = link?.split("watch?v=")[1]
          link = link?.split("&")[0]
          icon = <Youtube />
          embed = <iframe width="300" height="300" src={`https://www.youtube.com/embed/${link}`} title="" frameBorder="0"   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"  allowFullScreen className="object-contain"></iframe>
        }
        else{
          icon = <Notion />
          embed = <img src={notionImg} className="h-[220px] rounded-lg" alt="Your notion content will appear here" />
        }
    
        return <Card id={id} ogLink={ogLink} key={index} embed={embed} cardLink={link} title={content.title} icon={icon} tags={content.tags} />
      })}
       
    </div>
}