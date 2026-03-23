import { cookies } from "next/headers";

const SESSION_SECRET = process.env.SESSION_SECRET || "uczelnia_secret_2024_auth_key";

// Helper to encode/decode for Edge compatibility
const encode = (str: string) => btoa(str);
const decode = (str: string) => atob(str);

// Use Web Crypto API for signing (available in both Node and Edge)
async function sign(payload: string, secret: string) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function verify(payload: string, signature: string, secret: string) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const signatureBytes = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
  return await crypto.subtle.verify("HMAC", key, signatureBytes, encoder.encode(payload));
}

export async function encryptSession(data: any): Promise<string> {
  const payload = encode(JSON.stringify(data));
  const signature = await sign(payload, SESSION_SECRET);
  return `${payload}.${signature}`;
}

export async function decryptSession(session: string): Promise<any | null> {
  try {
    const [payload, signature] = session.split(".");
    if (!payload || !signature) return null;

    const isValid = await verify(payload, signature, SESSION_SECRET);
    if (!isValid) return null;

    return JSON.parse(decode(payload));
  } catch (e) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decryptSession(session);
}

export async function setSession(data: any) {
  const cookieStore = await cookies();
  const session = await encryptSession(data);
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
