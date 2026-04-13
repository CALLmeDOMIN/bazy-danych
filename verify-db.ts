import postgres from "postgres";

const targetDbUrl = process.env.DATABASE_URL || "postgres://admin:bazydanych123321@57.128.237.85:5432/university_db";
const sql = postgres(targetDbUrl, { ssl: false });

async function verify() {
  try {
    console.log("--- Weryfikacja bazy danych (Nowy Schemat) ---");
    
    // Check tables
    const tableCount = await sql`SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';`;
    console.log(`Liczba tabel: ${tableCount[0].count}`);

    // Check users
    const userCount = await sql`SELECT count(*) FROM users;`;
    console.log(`Liczba użytkowników: ${userCount[0].count}`);

    // Check trigger execution
    console.log("Testowanie triggera updated_at...");
    const updatedUser = await sql`UPDATE users SET title = 'Mgr' WHERE username = 'admin' RETURNING updated_at;`;
    console.log(`Trigger update uzytkownika admin, nowy updated_at: ${updatedUser[0].updated_at}`);

    // Book Room Procedure test
    try {
      console.log("Testowanie procedury book_room_proc...");
      const [room] = await sql`SELECT id FROM rooms LIMIT 1`;
      const [user] = await sql`SELECT id FROM users LIMIT 1`;
      const [status] = await sql`SELECT id FROM booking_statuses LIMIT 1`;
      const [bookResult] = await sql`
        CALL book_room_proc(
          ${room.id}::INTEGER,
          ${user.id}::INTEGER,
          NULL::INTEGER,
          ${status.id}::INTEGER,
          'reservation'::VARCHAR,
          'Test Meeting'::VARCHAR,
          '2026-05-10'::DATE,
          '10:00:00'::TIME,
          '11:00:00'::TIME,
          NULL::INTEGER
        );
      `;
      console.log("Nowa rezerwacja ID:", bookResult.p_new_id);
      console.log("✅ Procedura dodawania rezerwacji działa.");
      
      const countB = await sql`SELECT count(*) FROM room_bookings;`;
      console.log(`Liczba rezerwacji (z nowo dodaną): ${countB[0].count}`);
    } catch (err: any) {
       console.log("❌ Błąd testu book_room_proc:", err.message);
    }

    console.log("✅ Weryfikacja zakończona sukcesem.");
  } catch (error) {
    console.error("❌ Błąd weryfikacji:", error);
  } finally {
    await sql.end();
  }
}

verify();
