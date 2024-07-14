import { readContract } from "thirdweb";
import { contract } from "./getContract";
import Message from "./interfaces/IOracle"

// export async function getContractData() {
//   const data = await readContract({
//     contract,
//     method: "function getKnowledgebaseCID() public view returns (string)",
//     // params: ["0x123..."],
//   });
//   console.log(data);
//   return data;
// }

export async function runAgentFromContract(userQuery: string, maxIterations: number) {
  const data = await readContract({
    contract,
    params: [userQuery, maxIterations],
    method: "function runAgent(string memory query, uint8 max_iterations) public returns (uint)",
  });

  console.log(data);
  return data;
}
//  { role: string, content: { contentType: string, value: string }[]}[]
export async function getMessageHistory(agentId: bigint) {
  const data: any[] = await readContract({
    contract,
    params: [agentId],
    method: "function getMessageHistory(uint agentId) public view",
  });
  console.log(data);
  return data;
}


// const contractABI = [
//   "function setOracleAddress(address newOracleAddress) public",
//   "function setKnowledgebaseCID(string memory newKnowledgeBaseCID) public",
//   "function startChat(string memory message) public returns (uint)",
//   "function getKnowledgebaseCID() public view returns (string)",
//   "function setStoredData(string memory newStoredData) public",
//   "function getStoredData() public view returns (string)",
//   "function runAgent(string memory query, uint8 max_iterations) public returns (uint)",
//   "function getMessageHistory(uint agentId) public view returns (tuple(string role, tuple(string contentType, string value)[])[])",
//   "function knowledgeBase() public view returns (string)",
//   "function agentRunCount() public view returns (uint)",
// ];