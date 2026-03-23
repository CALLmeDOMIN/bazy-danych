"use server";

import sql from "@/db";
import { revalidatePath } from "next/cache";

export async function addEquipment(prevState: any, formData: FormData) {
  try {
    const room_id = Number(formData.get("room_id"));
    const category_id = Number(formData.get("category_id"));
    const model_name = formData.get("model_name") as string;
    const serial_number = formData.get("serial_number") as string;
    const purchase_date = formData.get("purchase_date") as string;

    if (!room_id || !category_id || !model_name) {
      return { error: "Wymagane pola to: sprzęt, kategoria i model." };
    }

    await sql`
      INSERT INTO equipment (room_id, category_id, model_name, serial_number, purchase_date, status)
      VALUES (${room_id}, ${category_id}, ${model_name}, ${serial_number || null}, ${purchase_date || null}, 'operational')
    `;

    revalidatePath("/equipment");
    return { success: "Sprzęt dodany do ewidencji." };
  } catch (err: any) {
    return { error: "Wystąpił błąd bazy danych: " + err.message };
  }
}
