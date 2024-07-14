"use client"

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Lq0avA1TIAS
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { getMessageHistory, runAgentFromContract } from "../actions";
import Message from "../interfaces/IOracle";

export default function AgentChat() {

  const [agentRunning, setAgentRunning] = useState<boolean>(false);
  const [agentId, setAgentId] = useState<any>()

  const prompts = [
    "Give me the votesFor from the data",
    "Provide me with the topic or title of the Vote",
    "Provide me with the Vote of the Member of Parliament ",
    "You are an expert in EU politics. You must provide a summary of the vote history of a MEP (Member of the European Parliament), on a specific topic. The topic is " + "Gigabit Infrastructure Act" + ". The MEP is " + "6394" + "."
  ]

  const initializeAgent = async () => {
    setAgentRunning(true);
    const agentIdResult = await runAgentFromContract(prompts[4], 10);
    setAgentId(agentIdResult);
    console.log(agentId);

    let agentMessageHistory: Message[] = await getMessageHistory(agentId);
    let newResponse = agentMessageHistory[agentMessageHistory.length - 1];
    if (newResponse !== undefined) {
      let newResponseContent = newResponse.content[0]
      let lastResponse = agentMessageHistory[agentMessageHistory.length - 2];
      let lastResponseContent = lastResponse.content[0]
      console.log(newResponse, newResponseContent)

      while (newResponseContent === lastResponseContent) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        agentMessageHistory = await getMessageHistory(agentId);
        newResponse = agentMessageHistory[agentMessageHistory.length - 1];
        console.log(newResponse)
        lastResponse = agentMessageHistory[agentMessageHistory.length - 2];
        console.log(lastResponse)
        console.log(".");
      }
    }

    while (newResponse === undefined) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      agentMessageHistory = await getMessageHistory(agentId);
      newResponse = agentMessageHistory[agentMessageHistory.length - 1];
      console.log(newResponse)
      // lastResponse = agentMessageHistory[agentMessageHistory.length-2];
      console.log(".");
    }

    console.log(agentMessageHistory)
  }

  return (
    <div className="flex flex-col h-screen">
      {!agentRunning && <Button className={"h-5 mb-5 "} onClick={() => initializeAgent()}>Run agent</Button>}
      {agentRunning && <Button className={"bg-red-600 hover:bg-red-600 h-5 mb-5"} onClick={() => setAgentRunning(false)}>Stop running agent</Button>}
      {agentRunning &&
        <div className="bg-secondary">
          <p>2. Interact with it via the AI agent</p>
          <header className="bg-primary text-primary-foreground py-4 px-6 shadow">
            <h1 className="text-2xl font-bold">Run Agent</h1>
          </header>
          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-muted w-8 h-8 flex items-center justify-center text-muted-foreground">
                  You
                </div>
                <div className="bg-card p-4 rounded-lg max-w-[80%]">
                  <p>Hello, how can I assist you today?</p>
                </div>
              </div>
              <div className="flex items-start gap-4 justify-end">
                <div className="bg-primary text-primary-foreground p-4 rounded-lg max-w-[80%]">
                  <p>Hello! I'm an AI assistant created by Vercel. How can I help you today?</p>
                </div>
                <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center text-primary-foreground">
                  AI
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-muted w-8 h-8 flex items-center justify-center text-muted-foreground">
                  You
                </div>
                <div className="bg-card p-4 rounded-lg max-w-[80%]">
                  <p>I'd like to learn more about your capabilities. What kinds of tasks can you assist with?</p>
                </div>
              </div>
              <div className="flex items-start gap-4 justify-end">
                <div className="bg-primary text-primary-foreground p-4 rounded-lg max-w-[80%]">
                  <p>
                    As an AI assistant, I'm capable of assisting with a wide variety of tasks. I can help with research,
                    analysis, writing, coding, and much more. Please feel free to ask me about any topic or task, and I'll
                    do my best to provide helpful information or guidance.
                  </p>
                </div>
                <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center text-primary-foreground">
                  AI
                </div>
              </div>
            </div>
          </div>
          <div className="bg-secondary border-t px-6 py-4">
            <div className="relative">
              <Textarea placeholder="Type your message..." className="pr-16 w-full" rows={1} />
              <Button type="submit" size="icon" className="absolute top-1/2 -translate-y-1/2 right-4">
                <SendIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      }
    </div>

  )
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
  )
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
  )
}