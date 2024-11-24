import React from "react";
import F1 from "@/Images/Formula_1.png";
import Image from "next/image";
const Info = () => {
  return (
    <div className="border flex flex-col">
      <Image alt="Formula 1 Image" src={F1} width={1000} height={1000} />
      <p className="justify-center w-full mx-auto text-center">Ask me anything about Formula1</p>
    </div>
  );
};

export default Info;
