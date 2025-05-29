"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Ajusta la ruta según tu estructura
import { useRouter } from "next/navigation";

export default function GetURL() {
  const router = useRouter();
  const [userLink, setUserLink] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Obtener el enlace del usuario desde localStorage y Supabase
    const fetchUserLink = async () => {
      // Primero, intentar recuperar desde localStorage
      const savedLink = localStorage.getItem("userLink") || "";
      if (savedLink) {
        setUserLink(savedLink);
        setInputValue(savedLink);
      }

      // Luego, verificar en Supabase
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        const { data, error } = await supabase
          .from("user_links")
          .select("user_link")
          .eq("user_id", user.user.id)
          .single();
        if (data && !error) {
          setUserLink(data.user_link);
          setInputValue(data.user_link);
          localStorage.setItem("userLink", data.user_link); // Actualizar localStorage
        }
      }
    };
    fetchUserLink();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setStatus("El enlace no puede estar vacío");
      return;
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      setStatus("Debes estar autenticado");
      return;
    }

    try {
      // Iniciar una transacción para asegurar la integridad de los datos
      const { error: userLinkError } = await supabase
        .from("user_links")
        .upsert({
          user_id: user.user.id,
          user_link: inputValue.trim(),
        });

      if (userLinkError) {
        if (userLinkError.code === "23505") {
          setStatus("Este enlace ya está en uso");
        } else {
          setStatus("Error al guardar el enlace");
        }
        return;
      }

      // Crear o actualizar la entrada en editable_page
      const { error: editablePageError } = await supabase
        .from("editable_page")
        .upsert({
          user_id: user.user.id,
          link: inputValue.trim(),
          content: "This text is by default. You should edit it.",
          updated_at: new Date().toISOString(),
        });

      if (editablePageError) {
        setStatus("Error al crear la página editable");
        return;
      }

      setStatus("Enlace guardado con éxito");
      setUserLink(inputValue.trim());
      localStorage.setItem("userLink", inputValue.trim());
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      setStatus("Error inesperado al guardar los datos");
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full h-screen">
      <div className="flex flex-col gap-2 w-[400px]">
        <div>
          <p>Claim your link: {userLink || "No link set"}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="your link"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button type="submit" className="cursor-pointer">
            Send
          </Button>
        </form>
        <div>
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}
