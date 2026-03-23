import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "uczelnia_secret_2024_auth_key";

export function encryptSession(data: any): string {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64");
  const hmac = createHmac("sha256", SESSION_SECRET);
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return `${payload}.${signature}`;
}

export function decryptSession(session: string): any | null {
  try {
    const [payload, signature] = session.split(".");
    if (!payload || !signature) return null;

    const hmac = createHmac("sha256", SESSION_SECRET);
    hmac.update(payload);
    const expectedSignature = hmac.digest("hex");

    // Timing safe comparison to prevent timing attacks
    const isValid = timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    
    if (!isValid) return null;

    return JSON.parse(Buffer.from(payload, "base64").toString());
  } catch (e) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return decryptSession(session);
}

export async function setSession(data: any) {
  const cookieStore = await cookies();
  const session = encryptSession(data);
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
