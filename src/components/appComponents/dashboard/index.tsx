"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export function AvatarDemo({ src }: { src: string }) {
  return (
    <Avatar>
      <AvatarImage src={src} alt="User avatar" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );
}

export default function Dashboard() {
  const [userData, setUserData] = useState<{
    avatar_url: string | null;
    name: string | null;
  }>({
    avatar_url: null,
    name: null,
  });

  const [text, setText] = useState<string>("");
  const [userLink, setUserLink] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const avatarUrl = user.user_metadata?.avatar_url;
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name;

          // Obtener el user_link del usuario
          const { data: linkData } = await supabase
            .from("user_links")
            .select("user_link")
            .eq("user_id", user.id)
            .single();

          if (linkData) {
            setUserLink(linkData.user_link);
          }

          // Obtener el contenido actual de la página
          if (linkData) {
            const { data: pageData } = await supabase
              .from("editable_page")
              .select("content")
              .eq("link", linkData.user_link)
              .single();

            if (pageData) {
              setText(pageData.content);
            }
          }

          // Primero intentamos obtener el perfil existente
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          // Si no existe el perfil, lo creamos
          if (!existingProfile) {
            const { error: insertError } = await supabase
              .from("profiles")
              .insert({
                id: user.id,
                avatar_url: avatarUrl,
                full_name: fullName,
                updated_at: new Date().toISOString(),
              });

            if (insertError) {
              console.error("Error creating profile:", insertError);
            }
          } else {
            // Si existe, lo actualizamos
            const { error: updateError } = await supabase
              .from("profiles")
              .update({
                avatar_url: avatarUrl,
                full_name: fullName,
                updated_at: new Date().toISOString(),
              })
              .eq("id", user.id);

            if (updateError) {
              console.error("Error updating profile:", updateError);
            }
          }

          setUserData({
            avatar_url: typeof avatarUrl === "string" ? avatarUrl : null,
            name: typeof fullName === "string" ? fullName : null,
          });
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (!userLink) {
      setStatus("No tienes un link configurado");
      return;
    }

    try {
      const { error } = await supabase
        .from("editable_page")
        .update({
          content: text,
          updated_at: new Date().toISOString(),
        })
        .eq("link", userLink);

      if (error) {
        setStatus("Error al guardar el contenido");
        console.error("Error:", error);
      } else {
        setStatus("Contenido guardado con éxito");
      }
    } catch (error) {
      setStatus("Error inesperado");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div>
        <Button variant={"outline"} className="py-5 px-7 cursor-pointer">
          <AvatarDemo src={userData.avatar_url || ""} />
          {userData.name || "User"}
        </Button>
      </div>
      <div className="flex flex-col gap-3 items-start mt-10">
        <div>
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl">Live preview</h1>
            <h2>
              {text.trim() === ""
                ? "This text is by default. You should edit it."
                : text}
            </h2>
          </div>
        </div>
        <div className="flex gap-3 mt-10">
          <Input type="text" value={text} onChange={handleTChange} />
          <Button onClick={handleSubmit}>Send</Button>
        </div>
        {status && <p className="text-sm text-gray-600">{status}</p>}
      </div>
    </>
  );
}
