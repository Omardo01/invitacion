import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, ADMIN_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  await destroySession(token);

  // 303 → el navegador sigue el redirect con GET tras el POST del formulario.
  const res = NextResponse.redirect(new URL("/admin-login", req.url), { status: 303 });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
