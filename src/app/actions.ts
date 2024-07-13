"use server";

import { readContract } from "thirdweb";
import { contract } from "./getContract";

export async function getContractData() {
  const data = await readContract({
    contract,
    method: "function getKnowledgebaseCID() public view returns (string)",
    // params: ["0x123..."],
  });
  console.log(data);
  return data;
}
