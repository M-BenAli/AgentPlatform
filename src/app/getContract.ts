import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "./utils";
import { readContract } from "thirdweb";

const galadrielChain = defineChain({
  id: 696969,
  rpc: "https://devnet.galadriel.com",
});

// get a contract
export const contract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: galadrielChain,
  // the contract's address
  address: "0xb040D6aedc4E77A1f904F415ad6Ca983244818b4",
  // OPTIONAL: the contract's abi
  //   abi: [...],
});
