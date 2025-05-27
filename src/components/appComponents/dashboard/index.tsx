'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const avatarUrl = user.user_metadata?.avatar_url;
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
        setUserData({
          avatar_url: typeof avatarUrl === 'string' ? avatarUrl : null,
          name: typeof fullName === 'string' ? fullName : null,
        });
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
    </>
  );
}
