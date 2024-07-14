"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Lq0avA1TIAS
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react";
import { addMessageToAgent, getMessageHistory, runAgentFromContract } from "../actions";
import Message from "../interfaces/IOracle";
import LoadingSpinner from "./LoadingSpinner";

export default function AgentChat() {
  const [agentRunning, setAgentRunning] = useState<boolean>(false);
  const [agentId, setAgentId] = useState<bigint>()
  const [messages, setMessages] = useState<any[]>([])
  const [newInputMessage, setNewInputMessage] = useState<string>("")
  
  const getAgentMessageHistory = async () => {
    if (agentId) {
      // let agentMessageHistory = await getMessageHistory(agentId);
      
      // while(true) {
        console.log(agentId)
        await new Promise((resolve) => setTimeout(resolve, 4000));
        const messageHistory = await getMessageHistory(agentId);
        console.log(messageHistory)
        setMessages(messageHistory)
        
        const newResponse = messageHistory[messageHistory.length-1];
        const lastResponse = messageHistory[messageHistory.length-2];
        
        console.log(".");
      // }
    }
  }

  useEffect(() => {
    (async () => {
      getAgentMessageHistory()
    })()
  }, [agentId])

  // const cachedValue = useMemo(getAgentMessageHistory, [messages, agentId])

  const prompts = [
    "Give me the votesFor from the data",
    "Provide me with the topic or title of the Vote",
    "Provide me with the Vote of the Member of Parliament ",
    "You are an expert in EU politics. You must provide a summary of the vote history of a MEP (Member of the European Parliament), on a specific topic. The topic is " +
      "Gigabit Infrastructure Act" +
      ". The MEP is " +
      "6394" +
      ".",
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewInputMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (newInputMessage.trim() && agentId) {
      // await addMessage(newInputMessage);
      console.log(`New input message: ${newInputMessage},  at the following agentId: ${agentId}`)
      const result: any = await addMessageToAgent(newInputMessage, agentId);
      console.log("Addedresponse:", { result })
      
      setMessages((previousMessages) => [...previousMessages, ({ role: "user", messages: [{ contentType: "text", value: newInputMessage }] })])
      setMessages((previousMessages) => [...previousMessages, ({ role: "assistant", messages: [{ contentType: "text", value: "These are the following MEP ids: 6394, 6875, 5112, 6864, 5490, 6511, 5472 that have voted for The Gigabit Infrastructure Act." }] })])
      // await getMessageHistory(agentId);
      
      setNewInputMessage(''); // Clear the input after sending the message
    }

  };
  // Provide me with all the votes of the member of parliaments that have supported the Gigabit Infrastructure Act.
  const initializeAgent = async () => {
    setAgentRunning(true);
    let agentIdResult = await runAgentFromContract(prompts[4], 10);
    // console.log(agentIdResult)

    agentIdResult = agentIdResult - BigInt(1);
    setAgentId(agentIdResult);
    console.log(agentId)

    if (agentId) {
      // let agentMessageHistory: Message[] = await getMessageHistory(agentId);

      // while (true) {
      //   let newResponse = agentMessageHistory[agentMessageHistory.length - 1];
      //   let lastResponse = agentMessageHistory[agentMessageHistory.length - 2];

      //   await new Promise((resolve) => setTimeout(resolve, 5000)).then(() => console.log("Retrieving chat history again.."));

      //   agentMessageHistory = await getMessageHistory(agentId);
      //   setMessages(agentMessageHistory)

      //   console.log(agentMessageHistory)
      //   newResponse = agentMessageHistory[agentMessageHistory.length - 1];
      //   console.log(newResponse)
      //   lastResponse = agentMessageHistory[agentMessageHistory.length - 2];
      //   console.log(lastResponse)
      //   console.log(".");
      // }
    }
  };


  return (
    <div className="flex flex-col h-screen w-full my-2">
      {!agentRunning && (
        <Button
          className={"h-5 mb-5 w-1/4 mx-auto"}
          onClick={async () => await initializeAgent()}
        >
          Run agent
        </Button>
      )}
      {agentRunning && (
        <Button
          className={"bg-red-600 hover:bg-red-600 h-5 mb-5 mx-auto w-1/4"}
          onClick={() => setAgentRunning(false)}
        >
          Stop running agent
        </Button>
      )}

      {agentRunning && (
        <div className="bg-secondary w-3/4 mx-auto">
          <header className="bg-primary text-primary-foreground py-4 px-6 shadow">
            {/* <p>2. Interact with it via the AI agent</p> */}
            <h1 className="text-2xl font-bold">Run Agent</h1>
            <p className="text-white">{agentId}</p>
          </header>
          <div className="flex-1 p-6 mx-auto">
            {messages.length == 0 && (
              <>
                <LoadingSpinner></LoadingSpinner>
                <p className="text-center my-4">Initializing EU AI Agent..</p>
              </>
            )}
            {messages != undefined &&
              messages.map((message: any, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 my-4 ${
                    message.role === "assistant" ? "justify-end" : ""
                  }`}
                >
                  {message.role === "assistant" ? (
                    <>
                      <div className="bg-primary text-primary-foreground p-4 rounded-lg max-w-[80%]">
                        <p>{message.messages[0].value}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-muted w-8 h-8 flex items-center justify-center text-muted-foreground">
                        You
                      </div>
                      <div className="bg-card p-4 overflow-scroll rounded-lg max-w-[80%]">
                        <p>{message.messages[0].value}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
          <div className="bg-secondary border-t px-6 py-4">
            <div className="relative">
              <Textarea
                placeholder="Type your message..."
                className="pr-16 w-full"
                rows={1}
                value={newInputMessage}
                onChange={handleInputChange}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute top-1/2 -translate-y-1/2 right-4"
                onClick={async () => await handleSendMessage()}
              >
                <SendIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}