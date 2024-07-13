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
  address: "0xfc42fA684a675C6e4F9933f2Ed3DdBC0D06a458c",
  // OPTIONAL: the contract's abi
  //   abi: [...],
});
