import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Simulação de “banco de dados”
const users = [{ id: 1, email: "admin@admin.com", password: "123456" }];

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json(
      { error: "E-mail ou senha incorretos." },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET ?? "secret123",
    { expiresIn: "1h" }
  );

  const response = NextResponse.json({ success: true });

  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
