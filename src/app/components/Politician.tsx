"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";
import gerolf from "@/public/gerolf.jpg";
import pascal from "@/public/pascal.jpg";
import marc from "@/public/marc.jpg";
import geert from "@/public/geert.jpg";
import saskia from "@/public/saskia.jpg";

const imageMapping = {
  gerolfAnnemans: gerolf,
  pascalArimont: pascal,
  marcBotenga: marc,
  geertBourgeois: geert,
  saskiaBricmont: saskia,
};

type PoliticianKey = keyof typeof imageMapping;

type Props = {};
const Politician = (props: Props) => {
  const [selectedPolitician, setSelectedPolitician] = useState<string | null>(
    null
  );
  const [politicianData, setPoliticianData] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<any>(null);

  const handleSelect = (value: string) => {
    const politicianKey = value as PoliticianKey; // Type assertion
    setSelectedPolitician(politicianKey);
    setImageSrc(imageMapping[politicianKey]);

    // Fetch or set data based on selected politician
    const data = getPoliticianData(politicianKey);
    setPoliticianData(data);
  };

  const getPoliticianData = (politician: string) => {
    const data = {};
    return data;
  };

  return (
    <div className="wfull flex flex-col justify-center items-center space-y-4">
      <div>
        <Select onValueChange={handleSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Politician" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="gerolfAnnemans">Gerolf ANNEMANS</SelectItem>
              <SelectItem value="pascalArimont">Pascal ARIMONT</SelectItem>
              <SelectItem value="marcBotenga">Marc BOTENGA</SelectItem>
              <SelectItem value="geertBourgeois">Geert BOURGEOIS</SelectItem>
              <SelectItem value="saskiaBricmont">Saskia BRICMONT</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {politicianData && (
        <div>
          <Image
            className="rounded-xl"
            src={imageSrc}
            alt=""
            width={200}
            height={200}
          />
        </div>
      )}
    </div>
  );
};
export default Politician;
