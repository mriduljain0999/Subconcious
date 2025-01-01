import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { ContentAtom } from "../atoms/ContentAtom";
import axios from "axios";
import { backend_url } from "../config";

export function ToggleTabs() {
  const [activeTab, setActiveTab] = useState("All");
  let setContents = useSetRecoilState(ContentAtom);
  let ogContents: any = useRef([]);

  const tabs = ["All", "Youtube", "Twitter", "Notion"];

  function handleTab(tab: any) {
    // Always start filtering from the original content
    if (tab === "All") {
      setContents(ogContents.current);
    } else if (tab === "Youtube") {
      const newContents = ogContents.current.filter((content: any) =>
        content.link.includes("youtube")
      );
      setContents(newContents);
    } else if (tab === "Twitter") {
      const newContents = ogContents.current.filter(
        (content: any) =>
          content.link.includes("x.com") || content.link.includes("twitter.com")
      );
      setContents(newContents);
    } else if (tab === "Notion") {
      const newContents = ogContents.current.filter(
        (content: any) =>
          !content.link.includes("youtube") &&
          !content.link.includes("x.com") &&
          !content.link.includes("twitter.com")
      );
      setContents(newContents);
    }
    setActiveTab(tab);
  }

  async function getContent() {
    const response = await axios.get(`${backend_url}/api/v1/content`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    setContents(response.data);
    ogContents.current = response.data; // Correctly initialize `ogContents`
  }

  useEffect(() => {
    getContent();
  }, []);

  return (
    <div className="text-sm bg-black-700 px-1 flex md:flex-col flex-row items-start p-1 rounded-lg text-black-300 w-full gap-2">
      {tabs.map((tab) => (
        <span
          key={tab}
          onClick={() => handleTab(tab)}
          className={`cursor-pointer dark:text-[#eeeeee] text-black hover:text-[#6B72FF] md:text-start text-center md:px-3 px-0 py-2 rounded-lg w-full ${
            activeTab === tab ? "dark:bg-[#0F1831] bg-[#6B72FF] hover:text-white text-[white]" : ""
          }`}
        >
          {tab}
        </span>
      ))}
    </div>
  );
}
