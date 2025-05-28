import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserLinkPageProps {
  params: { userLink: string };
}

export default async function UserLinkPage({ params }: UserLinkPageProps) {
  const { userLink } = params;

  // Consultar el enlace y el contenido en Supabase
  const { data, error } = await supabase
    .from("editable_page")
    .select("user_id, content")
    .eq("link", userLink)
    .single();

  if (error || !data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl">Página no encontrada</h1>
      </div>
    );
  }

  // Obtener los datos del usuario usando una consulta directa
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user_id)
    .single();

  if (userError || !userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl">Error al cargar los datos del usuario</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={userData.avatar_url || ""} alt="Profile" />
          <AvatarFallback>{userData.full_name?.[0] || userData.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl">{data.content}</h1>
      </div>
    </div>
  );
}
