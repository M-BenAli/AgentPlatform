import AgentChat from "./components/AgentChat";
import Politician from "./components/Politician";

export default function App() {
  return (
    <div className="w-full full flex flex-col space-y-8 items-center justify-center mx-auto">
      <h1 className="text-xl sm:text-3xl text-center text-primary pt-4 sm:pt-8">
        European Parliament AI Agent
      </h1>
      <Politician />
      <AgentChat />
    </div>
  );
}
