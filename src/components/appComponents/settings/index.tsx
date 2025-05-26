'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function Settings() {
  const [userLink, setUserLink] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Recuperar el nombre guardado en localStorage
    const savedLink = localStorage.getItem("userLink") || "";
    setUserLink(savedLink);
    setInputValue(savedLink);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Actualizar el link si el usuario lo cambia
    if (inputValue.trim()) {
      localStorage.setItem("userLink", inputValue.trim());
      setUserLink(inputValue.trim());
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-full h-screen">
        <div className="flex flex-col gap-2 w-[400px]">
          <div>
            <p>Claim your link: {userLink}</p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input 
              placeholder="your link" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button type="submit" className="cursor-pointer">Send</Button>
          </form>
        </div>
      </div>
    </>
  );
}
