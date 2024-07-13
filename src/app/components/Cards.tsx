import { getContractData } from "../actions";

type Props = {};
const Cards = async (props: Props) => {
  const data = await getContractData();
  return <div>{data}</div>;
};
export default Cards;
