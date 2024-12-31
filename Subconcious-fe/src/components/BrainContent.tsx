import {  useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { backend_url } from "../config";
import { Card } from "./Card";
import { Notion } from "./Notion";
import { Youtube } from "./Youtube";
import { Twitter } from "./Twitter";
import notionImg from '../assets/notion.png'

export function BrainContent() {
    const navigate = useNavigate()
  const { shareLink } = useParams(); 
  const [brainContent, setBrainContent]:any = useState([]);

  useEffect(() => {
    if (shareLink) {
    
      axios
        .get(`${backend_url}/api/v1/brain/${shareLink}`)
        .then((response) => {
          if(response.data == "error"){
            navigate('/error')
          }
          setBrainContent(response.data); 
        })
        .catch(() => {
          navigate('/error')
        });
    }
  }, [shareLink]); 

  return <div className="flex p-6 flex-wrap gap-4 items-start sm:justify-start justify-center w-full">

  {brainContent.map((content:any,index:number) => {
    let link = content.link;
    let ogLink = content.link
    let embed;
    let icon;
    let id = content._id;


    if(link.includes("x.com") || link.includes("twitter.com")){
      link = link.replace("x.com","twitter.com")
      icon = <Twitter />   
      embed = <blockquote className="twitter-tweet object-cover">
      <p lang="en" dir="ltr">
        Your tweet content will automatically appear here.
        <a href={`${link}`}></a>
      </p>
    </blockquote>
    }
    else if(link.includes("youtube")){
      link = link.split("watch?v=")[1]
      link = link.split("&")[0]
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

export default BrainContent;
