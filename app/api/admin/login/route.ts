import { NextResponse } from "next/server";
import {
  getAdminPasswordHash,
  verifyPassword,
  createSession,
  ADMIN_COOKIE,
  SESSION_DAYS,
} from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Falta la contraseña" }, { status: 400 });
  }

  const stored = await getAdminPasswordHash();
  if (!stored || !verifyPassword(password, stored)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
  return res;
}
