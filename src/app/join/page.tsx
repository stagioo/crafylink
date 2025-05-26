'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Join() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Guardar el nombre en localStorage
      localStorage.setItem("userLink", username.trim());
      // Redirigir a la página de login
      router.push("/login");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-full h-screen">
        <div className="flex flex-col gap-2 w-[400px]">
          <div>
            <p>Get your link</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input 
                placeholder="Get your link" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Button type="submit" className="cursor-pointer">Send</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
