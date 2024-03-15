  import { createContext, useState } from "react";
  import runChat from "../config/gemini";

  export const Context = createContext();
  const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prePrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const delayPara = (index,nextword)=>{
      setTimeout(()=>{
        setResult(prev=>prev+nextword)
      },75*index)
    }
    const newChat = ()=>{
      setLoading(false)
      setShowResult(false)

    }

    const onSent = async (prompt) => {
      setResult("");
      setLoading(true);
      setShowResult(true)
      let response;
      if(prompt !=undefined){
        response = await runChat(prompt);
        setRecentPrompt(prompt)
      }
      else{
        setPrevPrompts(prev=>[...prev,input])
        setRecentPrompt(input)
        response = await runChat(input);
      }
      
      
      let responseArray = response.split("**");
      let newResponse = " ";
      for (let i=0;i<responseArray.length;i++){
          if(i===0||i%2 !==1){
              newResponse+=responseArray[i];
          }
          else{
              newResponse+="<b>"+responseArray[i]+"</b>";
          }
      }
      let newResponse2 = newResponse.split("*").join("</br>")
      let newResponseArray = newResponse2.split(" ");
      for(let i=0;i<newResponseArray.length;i++){
        const newWord = newResponseArray[i];
        delayPara(i,newWord+" ")
      }
      setLoading(false);
      setInput("")
    };
    const contextValue = {
      prePrompts,
      setPrevPrompts,
      onSent,
      setRecentPrompt,
      recentPrompt,
      showResult,
      loading,
      result,
      input,
      setInput,
      newChat
    };
    return (
      <Context.Provider value={contextValue}>{props.children}</Context.Provider>
    );
  };
  export default ContextProvider;
