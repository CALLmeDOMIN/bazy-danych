"use server";

import sql from "@/db";
import { revalidatePath } from "next/cache";

export async function addRoom(prevState: any, formData: FormData) {
  try {
    const building_id = Number(formData.get("building_id"));
    const room_type_id = Number(formData.get("room_type_id"));
    const room_number = formData.get("room_number") as string;
    const capacity = Number(formData.get("capacity"));
    const is_accessible = formData.get("is_accessible") === "true";

    if (!building_id || !room_type_id || !room_number || !capacity) {
      return { error: "Wszystkie pola są wymagane!" };
    }

    await sql`
      INSERT INTO rooms (building_id, room_type_id, room_number, capacity, is_accessible, status)
      VALUES (${building_id}, ${room_type_id}, ${room_number}, ${capacity}, ${is_accessible}, 'available')
    `;

    revalidatePath("/rooms");
    revalidatePath("/");
    return { success: "Sala dodana pomyślnie!" };
  } catch (err: any) {
    return { error: err.message || "Wystąpił błąd podczas dodawania sali." };
  }
}
