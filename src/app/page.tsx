import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider, ConnectButton } from "thirdweb/react";


const client = createThirdwebClient({
  clientId: `${process.env.NEXT_THIRDWEB_API_CLIENT_KEY}`
});


export default function App() {
  return (
    <ThirdwebProvider>
      <ConnectButton client={client} />
    </ThirdwebProvider>
  );
}
