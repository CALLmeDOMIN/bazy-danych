"use server";

import sql from "@/db";
import { revalidatePath } from "next/cache";
import { getSession } from "./session";

export async function deleteBooking(id: number) {
  const session = await getSession();
  if (!session) return { error: "Nie zalogowano" };

  try {
    const [booking] = await sql`SELECT user_id FROM room_bookings WHERE id = ${id}`;
    if (!booking) return { error: "Brak rezerwacji" };
    if (booking.user_id !== session.id && session.role !== 'admin') {
      return { error: "Brak uprawnień" };
    }

    await sql`DELETE FROM room_bookings WHERE id = ${id}`;
    revalidatePath("/my-reservations");
    revalidatePath("/calendar");
    return { success: "OK" };
  } catch (err: any) {
    return { error: err.message };
  }
}
