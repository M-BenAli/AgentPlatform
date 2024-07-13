"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type Props = {};
const Politician = (props: Props) => {
  const [selectedPolitician, setSelectedPolitician] = useState<string | null>(
    null
  );
  const [politicianData, setPoliticianData] = useState<any>(null);

  const handleSelect = (value: string) => {
    setSelectedPolitician(value);
    console.log(value);
    // Fetch or set data based on selected politician
    const data = getPoliticianData(value);
    setPoliticianData(data);
  };

  const getPoliticianData = (politician: string) => {
    const data = {};
    return data;
  };

  return (
    <div>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Politician" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="number1">Number 1</SelectItem>
            <SelectItem value="number2">Number 2</SelectItem>
            <SelectItem value="number3">Number 3</SelectItem>
            <SelectItem value="number4">Number 4</SelectItem>
            <SelectItem value="number5">Number 5</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
export default Politician;
