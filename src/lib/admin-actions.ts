"use server";

import sql from "./db";
import { revalidatePath } from "next/cache";
import { getSession } from "./session";

// W prawdziwej aplikacji użylibyśmy biblioteki typu bcrypt, tu stosujemy hasz w czystym tekście dla uproszczenia (zgodnie z zał. projektu bazy danych)
const hashPassword = (password: string) => password; // np. 'admin_hash_123'

export async function checkAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Brak dostępu: Wymagane uprawnienia administratora.");
  }
  return session;
}

export async function getAdminUsers() {
  await checkAdmin();
  // ZAAWANSOWANE ZAPYTANIE 1: Łączenie użytkowników, departamentów oraz zliczenie ich aktualnych rezerwacji
  return await sql`
    SELECT 
      u.id, 
      u.username, 
      u.email, 
      u.role, 
      u.first_name, 
      u.last_name, 
      u.is_active,
      d.name as department_name,
      (SELECT COUNT(*) FROM room_bookings rb WHERE rb.user_id = u.id) as total_bookings
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    ORDER BY u.created_at DESC;
  `;
}

export async function getDepartments() {
  await checkAdmin();
  return await sql`SELECT id, name FROM departments ORDER BY name ASC;`;
}

export async function createUser(prevState: any, formData: FormData) {
  try {
    await checkAdmin();

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const rawPassword = formData.get("password") as string;
    const role = formData.get("role") as string;
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const departmentStr = formData.get("department_id") as string;
    const department_id = departmentStr ? Number(departmentStr) : null;

    if (!username || !email || !rawPassword || !role || !first_name || !last_name) {
      return { error: "Wypełnij wszystkie wymagane pola." };
    }

    const password_hash = hashPassword(rawPassword);

    await sql`
      INSERT INTO users (username, password_hash, email, role, department_id, first_name, last_name)
      VALUES (${username}, ${password_hash}, ${email}, ${role}, ${department_id}, ${first_name}, ${last_name})
    `;

    revalidatePath("/admin/users");
    return { success: "Użytkownik pomyślnie utworzony." };
  } catch (err: any) {
    // Łapanie błędu z triggera, który dodaliśmy
    if (err.message.includes("nie może być przypisany") || err.message.includes("MUSI mieć przypisaną")) {
      return { error: "Błąd Walidacji (Trigger): " + err.message };
    }
    if (err.message.includes("unique constraint")) {
      return { error: "Nazwa użytkownika lub e-mail są już zajęte." };
    }
    return { error: "Wystąpił błąd: " + err.message };
  }
}

export async function getRoomUtilizationStats() {
  await checkAdmin();
  // Wykorzystujemy widok, który wcześniej utworzyliśmy (vw_room_utilization)
  return await sql`SELECT * FROM vw_room_utilization;`;
}

export async function getAuditLogs() {
  await checkAdmin();
  return await sql`
    SELECT a.*, u.username 
    FROM user_audit_logs a 
    JOIN users u ON a.user_id = u.id 
    ORDER BY changed_at DESC 
    LIMIT 10;
  `;
}
