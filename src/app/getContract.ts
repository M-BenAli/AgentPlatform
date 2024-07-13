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
  address: "0xd7fdb1dFDBB3B1b52e1Bd53F6683a799ED720f86",
  // OPTIONAL: the contract's abi
  //   abi: [...],
});
