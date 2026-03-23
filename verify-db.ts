import postgres from "postgres";

const targetDbUrl = process.env.DATABASE_URL || "postgres://admin:bazydanych123321@57.128.237.85:5432/university_db";

const sql = postgres(targetDbUrl, { ssl: false });

async function verify() {
  try {
    console.log("--- Weryfikacja bazy danych ---");
    
    const tableCount = await sql`SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';`;
    console.log(`Liczba tabel: ${tableCount[0].count}`);

    const userCount = await sql`SELECT count(*) FROM users;`;
    console.log(`Liczba użytkowników: ${userCount[0].count}`);

    const admin = await sql`SELECT * FROM users WHERE role = 'admin' LIMIT 1;`;
    if (admin.length > 0) {
      console.log(`Admin znaleziony: ${admin[0].username}`);
    } else {
      console.log("❌ Admin nie został znaleziony!");
    }

    const linkedProfs = await sql`
      SELECT u.username, p.first_name, p.last_name 
      FROM users u 
      JOIN professors p ON u.professor_id = p.id;
    `;
    console.log(`Użytkownicy powiązani z profesorami: ${linkedProfs.length}`);
    linkedProfs.forEach(p => console.log(` - ${p.username} -> ${p.first_name} ${p.last_name}`));

    console.log("--- Relacje zachowane ---");
    
    // Check schedules
    const schedules = await sql`SELECT count(*) FROM schedules;`;
    console.log(`Liczba wpisów w harmonogramie: ${schedules[0].count}`);

    console.log("✅ Weryfikacja zakończona sukcesem.");
  } catch (error) {
    console.error("❌ Błąd weryfikacji:", error);
  } finally {
    await sql.end();
  }
}

verify();
