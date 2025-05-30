"use client";
import BP from "./BP";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export default function Template() {
  const [selected, setSelected] = useState([false, false]);
  const [typeSelected, setTypeSelected] = useState("");

  const handleClick = (index: number, type: string) => {
    const update = [false, false];
    update[index] = true;
    setSelected(update);
    setTypeSelected(type);
  };
  return (
    <>
      <div className="w-[100%] h-screen  flex flex-col items-center justify-center gap-5">
        <div className="w-full   flex items-center justify-center gap-5">
          <BP
            onClick={() => handleClick(0, "col")}
            Type="col"
            className={`${
              selected[0] ? "border-green-200" : "border-gray-300"
            }`}
          />
          <BP
            onClick={() => handleClick(1, "row")}
            Type="row"
            className={`${
              selected[1] ? "border-green-200" : "border-gray-300"
            }`}
          />
        </div>
        <div>
          <Button className="cursor-pointer">Next</Button>
        </div>
      </div>
    </>
  );
}
