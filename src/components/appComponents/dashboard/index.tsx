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

  const handleTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const avatarUrl = user.user_metadata?.avatar_url;
          const fullName =
            user.user_metadata?.full_name || user.user_metadata?.name;

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
          <Input type="text" onChange={handleTChange}></Input>
          <Button>Send</Button>
        </div>
      </div>
    </>
  );
}
