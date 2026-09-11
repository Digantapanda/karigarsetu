"use server";

import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_COOKIE = "pilot_admin_session";

function expectedToken(): string {
  const secret = process.env.PILOT_ADMIN_PASSWORD ?? "";
  // Store a hash of the password, not the password itself, in the cookie.
  return crypto.createHash("sha256").update(secret).digest("hex");
}

export async function pilotAdminLogin(formData: FormData): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const configured = process.env.PILOT_ADMIN_PASSWORD;

  if (!configured) {
    return { error: "PILOT_ADMIN_PASSWORD is not set on the server. Set it in your environment first." };
  }
  if (password !== configured) {
    return { error: "Incorrect password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, expectedToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/pilot/admin",
    maxAge: 60 * 60 * 4, // 4 hours
  });

  return {};
}

export async function pilotAdminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

/** Used by the admin page and the export route to verify the session cookie server-side. */
export async function isPilotAdminAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token || !process.env.PILOT_ADMIN_PASSWORD) return false;
  return token === expectedToken();
}
