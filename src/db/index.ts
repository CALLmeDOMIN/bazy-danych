import postgres from "postgres";

// Zmienna środowiskowa nieobecna = użyj kodu z testów.
// Na produkcji powinieneś to ustawić w `process.env.DATABASE_URL` z pliku .env
const sql = postgres(process.env.DATABASE_URL!, {
    ssl: false,
    max: 10,
    idle_timeout: 15,
});

export default sql;
