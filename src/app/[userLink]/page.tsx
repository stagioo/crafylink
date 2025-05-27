import { supabase } from "@/lib/supabase";

interface UserLinkPageProps {
  params: { userLink: string };
}

export default async function UserLinkPage({ params }: UserLinkPageProps) {
  const { userLink } = params;

  // Consultar el enlace en Supabase
  const { data, error } = await supabase
    .from("user_links")
    .select("user_id")
    .eq("user_link", userLink)
    .single();

  if (error || !data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl">Enlace no encontrado: {userLink}</h1>
      </div>
    );
  }

  // Consultar el email en auth.users
  const { data: userData, error: userError } = await supabase
    .from("auth.users")
    .select("email")
    .eq("id", data.user_id)
    .single();

  if (userError || !userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl">Error al cargar el correo del usuario</h1>
      </div>
    );
  }

  const userEmail = userData.email || "Correo desconocido";

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl">Esta página es de {userEmail}</h1>
    </div>
  );
}
