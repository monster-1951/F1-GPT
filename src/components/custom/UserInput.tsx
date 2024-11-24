"use client";
import React, {  useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { LuSendHorizonal } from "react-icons/lu";
import { Button } from "../ui/button";
import axios from "axios";
import Info from "./Info";

const UserInput = () => {
  const [messages, setmessages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // console.log(inputRef.current)
  const handleClick = async () => {
    const UserInput = inputRef.current?.value;
    if (UserInput) setmessages((prevMessages) => [...prevMessages, UserInput]);
    // console.log(inputRef.current?.value);
    await axios
      .post("/api/ask", { User_Input: UserInput })
      .then((res) => {
        setmessages((prevMessages) => [...prevMessages, res.data]);
        if (inputRef.current) {
          inputRef.current.value = ""; // Safe to access here
        }
        console.log(res.data);
      })
      .catch(() => {
        return { data: { success: false } };
      });



    // console.log(response?.data);
  };

  return (
    <div className="mx-auto  sm:w-[60%] rounded-xl p-4 border" >
      <div className="flex justify-center p-2 sticky top-0">
        <Input className="bg-[#FEEFE5] " ref={inputRef}  />
        <Button onClick={handleClick} className="bg-[#1D3461]">
          <LuSendHorizonal className="h-10" />
        </Button>
      </div>
      {!messages.length&&
      <Info/>
      }
      
      <div >
        {messages.map((message, i) => {
          if (i % 2 == 0) {
            return (
              <div key={i} className="flex justify-end p-2 pt-4 ">
                <span className=" p-3 border rounded-3xl w-fit bg-[#861388] text-white ">
                  {message}
                </span>
              </div>
            );
          } else {
            return (
              <div key={i} className="flex justify-start p-2 pt-4 w-[75%]">
                <span className=" p-3 border rounded-3xl bg-[#1D3461] text-white">{message}</span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default UserInput;
