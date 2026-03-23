"use server";

import sql from "@/lib/db";
import { setSession, deleteSession } from "./session";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Podaj nazwę użytkownika i hasło." };
  }

  // W prawdziwej aplikacji użylibyśmy bcrypt.compare
  // Tutaj robimy proste porównanie (w init.ts są: admin_hash_123, prof_hash_*)
  const [user] = await sql`
    SELECT id, username, email, role, password_hash, first_name, last_name 
    FROM users 
    WHERE username = ${username}
  `;

  if (!user || user.password_hash !== password) {
    return { error: "Nieprawidłowa nazwa użytkownika lub hasło." };
  }

  await setSession({
    id: user.id,
    username: user.username,
    role: user.role,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name
  });

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
