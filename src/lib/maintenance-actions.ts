"use server";

import sql from "@/db";
import { revalidatePath } from "next/cache";
import { getSession } from "./session";

export async function addMaintenanceReport(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Brak autoryzacji do zgłoszenia." };

  try {
    const report_type = formData.get("report_type") as string;
    const priority = formData.get("priority") as string;
    const description = formData.get("description") as string;
    const room_id = formData.get("room_id") ? Number(formData.get("room_id")) : null;
    const equipment_id = formData.get("equipment_id") ? Number(formData.get("equipment_id")) : null;

    if (!report_type || !description) {
      return { error: "Typ zgłoszenia i opis są wymagane." };
    }

    if (!room_id && !equipment_id) {
      return { error: "Zgłoszenie musi dotyczyć sali lub sprzętu." };
    }

    await sql`
      INSERT INTO maintenance_reports (reported_by, room_id, equipment_id, report_type, description, priority, status)
      VALUES (${session.id}, ${room_id}, ${equipment_id}, ${report_type}, ${description}, ${priority || 'normal'}, 'open')
    `;

    // Optionally update equipment status if broken_equipment is reported
    if (report_type === 'broken_equipment' && equipment_id) {
      await sql`UPDATE equipment SET status = 'broken' WHERE id = ${equipment_id}`;
    }

    revalidatePath("/maintenance");
    if (equipment_id) revalidatePath("/equipment");
    
    return { success: "Zgłoszenie zarejestrowane w systemie." };
  } catch (err: any) {
    return { error: "Błąd bazy danych: " + err.message };
  }
}

export async function resolveReport(id: number) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'staff')) {
    return { error: "Brak uprawnień. Tylko obsługa techniczna/admin." };
  }

  try {
    const [report] = await sql`
      UPDATE maintenance_reports 
      SET status = 'resolved', resolved_by = ${session.id}, resolved_at = NOW() 
      WHERE id = ${id}
      RETURNING equipment_id
    `;

    if (report && report.equipment_id) {
       await sql`UPDATE equipment SET status = 'operational' WHERE id = ${report.equipment_id}`;
    }

    revalidatePath("/maintenance");
    revalidatePath("/equipment");
    return { success: "Zgłoszenie zamknięte pomyślnie." };
  } catch (err: any) {
     return { error: "Wystąpił błąd podczas zamykania zgłoszenia." };
  }
}
