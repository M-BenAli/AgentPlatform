import { ConnectButton } from "thirdweb/react";
import { client } from "../utils";
import { ModeToggle } from "./DarkModeToggle";

type Props = {};
const Navbar = (props: Props) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div>EU Agent Platform</div>
      <div className="flex items-center space-x-4">
        <div>
          <ModeToggle />
        </div>
        <div>
          <ConnectButton client={client} />
        </div>
      </div>
    </div>
  );
};
export default Navbar;
