import { redirect } from "next/navigation";

// La raíz ya no muestra la galería de propuestas: lleva directo al panel.
// El admin valida sesión y, si no hay, redirige a /admin-login.
export default function Home() {
  redirect("/admin");
}
