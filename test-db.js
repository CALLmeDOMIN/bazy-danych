import postgres from "postgres";

async function check() {
  const sql = postgres(process.env.DATABASE_URL || "postgres://admin:bazydanych123321@57.128.237.85:5432/postgres", {
    ssl: false,
    max: 1,
  });

  try {
    const dbs = await sql`SELECT datname FROM pg_database WHERE datistemplate = false;`;
    console.log("Databases:", dbs.map(d => d.datname));

    const currentUser = await sql`SELECT current_user, session_user;`;
    console.log("Current User:", currentUser);

    const schemas = await sql`SELECT schema_name, schema_owner FROM information_schema.schemata;`;
    console.log("Schemas:", schemas);

    const publicPermissions = await sql`SELECT has_schema_privilege(current_user, 'public', 'CREATE');`;
    console.log("Has CREATE privilege on public schema:", publicPermissions);

    if (!publicPermissions[0].has_schema_privilege) {
      console.log("Attempting to grant CREATE on schema public to admin...");
      try {
        await sql`GRANT CREATE ON SCHEMA public TO admin;`;
        console.log("Grant successful.");
      } catch (grantErr) {
        console.error("Grant failed:", grantErr.message);
      }
    }
  } catch (err) {
    console.error("Error during check:", err);
  } finally {
    await sql.end();
  }
}

check();
