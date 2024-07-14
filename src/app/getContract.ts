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
  address: "0xa79c83924eafc4032588318E0899Fbb341C25696",
  // OPTIONAL: the contract's abi
  //   abi: [...],
});
