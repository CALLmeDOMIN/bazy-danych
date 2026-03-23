"use server";

import sql from "@/db";
import { revalidatePath } from "next/cache";
import { getSession } from "./session";

export async function addBooking(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Zaloguj się, aby dokonać rezerwacji." };

  try {
    const room_id = Number(formData.get("room_id"));
    const title = formData.get("title") as string;
    const reserved_date = formData.get("reserved_date") as string;
    const start_time = formData.get("start_time") + ":00";
    const end_time = formData.get("end_time") + ":00";

    if (!room_id || !title || !reserved_date || !start_time || !end_time) {
      return { error: "Wypełnij wszystkie pola formularza." };
    }

    if (start_time >= end_time) {
      return { error: "Czas rozpoczęcia musi być przed czasem zakończenia." };
    }

    // Realizujemy wywołanie POSTGRESQL CALL naszej procedury book_room_proc, która sprawdza zajętość
    // Fetch status_id first
    const [statusRow] = await sql`SELECT id FROM booking_statuses WHERE status_name = 'Zatwierdzona' LIMIT 1`;
    if (!statusRow) return { error: "Brak statusu 'Zatwierdzona' w bazie danych." };

    // Call procedure with explicit casting
    await sql`
      CALL book_room_proc(
        ${room_id}::INTEGER,
        ${session.id}::INTEGER,
        NULL::INTEGER,
        ${statusRow.id}::INTEGER,
        'reservation'::VARCHAR,
        ${title}::VARCHAR,
        ${reserved_date}::DATE,
        ${start_time}::TIME,
        ${end_time}::TIME,
        NULL
      )
    `;

    revalidatePath("/calendar");
    revalidatePath("/my-reservations");
    return { success: "Pomyślnie zarezerwowano salę." };
  } catch (err: any) {
    if (err.message.includes("Room is already booked")) {
      return { error: "BŁĄD: Sala jest już zajęta w tym terminie." };
    }
    return { error: "Wystąpił nieoczekiwany błąd: " + err.message };
  }
}
