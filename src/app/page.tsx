import Cards from "./components/Cards";
import Politician from "./components/Politician";

export default function App() {
  return (
    <div className="w-full full flex flex-col space-y-8 items-center justify-center mx-auto">
      <h1 className="text-xl sm:text-3xl text-center text-primary pt-4 sm:pt-8">
        Take a look at the politician decision
      </h1>
      <Politician />
      <Cards />
    </div>
  );
}
