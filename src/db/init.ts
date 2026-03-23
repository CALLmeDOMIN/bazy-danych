import postgres from "postgres";

const targetDbUrl = process.env.DATABASE_URL || "postgres://admin:bazydanych123321@57.128.237.85:5432/university_db";

const sql = postgres(targetDbUrl, {
  ssl: false,
  max: 5,
  idle_timeout: 10,
});

async function runSQL() {
  console.log("Rozpoczynanie pełnej konfiguracji bazy danych dla university_db...");

  try {
    console.log("Usuwanie starych tabel (jeśli istnieją)...");
    await sql`DROP TABLE IF EXISTS users CASCADE;`;
    await sql`DROP TABLE IF EXISTS schedules CASCADE;`;
    await sql`DROP TABLE IF EXISTS courses CASCADE;`;
    await sql`DROP TABLE IF EXISTS professors CASCADE;`;
    await sql`DROP TABLE IF EXISTS departments CASCADE;`;
    await sql`DROP TABLE IF EXISTS equipment CASCADE;`;
    await sql`DROP TABLE IF EXISTS equipment_categories CASCADE;`;
    await sql`DROP TABLE IF EXISTS rooms CASCADE;`;
    await sql`DROP TABLE IF EXISTS room_types CASCADE;`;
    await sql`DROP TABLE IF EXISTS buildings CASCADE;`;
    await sql`DROP TABLE IF EXISTS campuses CASCADE;`;

    console.log("Tworzenie schematu...");
    await sql`CREATE TABLE campuses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        location_city VARCHAR(100) NOT NULL,
        established_year INTEGER CHECK (established_year > 1800)
    );`;

    await sql`CREATE TABLE buildings (
        id SERIAL PRIMARY KEY,
        campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(10) UNIQUE NOT NULL,
        floors INTEGER NOT NULL CHECK (floors >= 1)
    );`;

    await sql`CREATE TABLE room_types (
        id SERIAL PRIMARY KEY,
        type_name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT
    );`;

    await sql`CREATE TABLE rooms (
        id SERIAL PRIMARY KEY,
        building_id INTEGER NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
        room_type_id INTEGER NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
        room_number VARCHAR(20) NOT NULL,
        capacity INTEGER NOT NULL CHECK (capacity > 0),
        is_accessible BOOLEAN DEFAULT true,
        UNIQUE(building_id, room_number)
    );`;

    await sql`CREATE TABLE equipment_categories (
        id SERIAL PRIMARY KEY,
        category_name VARCHAR(50) UNIQUE NOT NULL
    );`;

    await sql`CREATE TABLE equipment (
        id SERIAL PRIMARY KEY,
        room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
        category_id INTEGER NOT NULL REFERENCES equipment_categories(id) ON DELETE RESTRICT,
        model_name VARCHAR(100) NOT NULL,
        serial_number VARCHAR(100) UNIQUE,
        purchase_date DATE
    );`;

    await sql`CREATE TABLE departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) UNIQUE NOT NULL,
        head_of_department VARCHAR(100)
    );`;

    await sql`CREATE TABLE professors (
        id SERIAL PRIMARY KEY,
        department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE SET NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        title VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL
    );`;

    await sql`CREATE TABLE courses (
        id SERIAL PRIMARY KEY,
        department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
        course_name VARCHAR(150) NOT NULL,
        course_code VARCHAR(20) UNIQUE NOT NULL,
        credits INTEGER NOT NULL CHECK (credits > 0)
    );`;

    await sql`CREATE TABLE schedules (
        id SERIAL PRIMARY KEY,
        room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
        course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        professor_id INTEGER NOT NULL REFERENCES professors(id) ON DELETE CASCADE,
        semester VARCHAR(20) NOT NULL,
        day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        CONSTRAINT valid_time CHECK (start_time < end_time)
    );`;

    await sql`CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'professor', 'student', 'staff')),
        professor_id INTEGER REFERENCES professors(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    console.log("Dodawanie danych podstawowych...");

    const campusesArray = await sql`
      INSERT INTO campuses (name, location_city, established_year) VALUES 
      ('Kampus Główny', 'Warszawa', 1915),
      ('Kampus Technologii Występujących', 'Warszawa', 2010),
      ('Kampus Południowy', 'Kraków', 1880),
      ('Ośrodek Badawczy nad Zatoką', 'Gdańsk', 2005)
      RETURNING id;
    `;

    const buildingsArray = await sql`
      INSERT INTO buildings (campus_id, name, code, floors) VALUES 
      (${campusesArray[0].id}, 'Wydział Inżynierii Środowiska', 'IŚ', 5),
      (${campusesArray[0].id}, 'Gmach Główny', 'GG', 4),
      (${campusesArray[1].id}, 'Centrum Nowych Technologii', 'CNT', 8),
      (${campusesArray[1].id}, 'Wydział Elektroniki i Technik Informacyjnych', 'WEITI', 6),
      (${campusesArray[2].id}, 'Wydział Architektury', 'WA', 5),
      (${campusesArray[3].id}, 'Wydział Oceanotechniki', 'WO', 3)
      RETURNING id;
    `;

    const roomTypesArray = await sql`
      INSERT INTO room_types (type_name, description) VALUES 
      ('Audytoryjna duża', 'Sala wykładowa na 200+ miejsc'),
      ('Laboratorium Komputerowe', 'Sala wyposażona w stacje robocze PC'),
      ('Laboratorium Obliczeniowe', 'Sala specjalistycznych komputerów'),
      ('Sala Ćwiczeniowa', 'Klasyczna mniejsza sala')
      RETURNING id;
    `;

    let roomsData = [];
    for (let b of buildingsArray) {
      roomsData.push({ building_id: b.id, room_type_id: roomTypesArray[0].id, room_number: "AULA-" + b.id, capacity: 250, is_accessible: true });
      roomsData.push({ building_id: b.id, room_type_id: roomTypesArray[1].id, room_number: "LAB-" + b.id + "0", capacity: 30, is_accessible: true });
      roomsData.push({ building_id: b.id, room_type_id: roomTypesArray[2].id, room_number: "SRV-" + b.id + "5", capacity: 15, is_accessible: true });
    }
    const roomsArray = await sql`
      INSERT INTO rooms ${sql(roomsData, 'building_id', 'room_type_id', 'room_number', 'capacity', 'is_accessible')}
      RETURNING id;
    `;

    const depthsArray = await sql`
      INSERT INTO departments (name, head_of_department) VALUES 
      ('Katedra Baz Danych', 'Prof. Dr hab. Anna Skłodowska'),
      ('Katedra Algorytmiki', 'Prof. Mikołaj Wójcik'),
      ('Instytut Fizyki Kwantowej', 'Dr hab. Jakub Nowak')
      RETURNING id;
    `;

    const profsArray = await sql`
      INSERT INTO professors (department_id, first_name, last_name, title, email) VALUES 
      (${depthsArray[0].id}, 'Anna', 'Skłodowska', 'Prof. Dr hab.', 'a.sklodowska@uczelnia.edu.pl'),
      (${depthsArray[1].id}, 'Mikołaj', 'Wójcik', 'Prof.', 'm.wojcik@uczelnia.edu.pl'),
      (${depthsArray[2].id}, 'Jakub', 'Nowak', 'Dr hab.', 'j.nowak@uczelnia.edu.pl'),
      (${depthsArray[0].id}, 'Piotr', 'Zieliński', 'Dr inż.', 'p.zielinski@uczelnia.edu.pl'),
      (${depthsArray[1].id}, 'Katarzyna', 'Mazur', 'Dr', 'k.mazur@uczelnia.edu.pl')
      RETURNING id;
    `;

    const coursesArray = await sql`
      INSERT INTO courses (department_id, course_name, course_code, credits) VALUES 
      (${depthsArray[0].id}, 'Zaawansowane Bazy Danych SQL', 'CS-DB-401', 6),
      (${depthsArray[1].id}, 'Algorytmy i Struktury Danych', 'CS-AL-201', 6),
      (${depthsArray[2].id}, 'Inżynieria Kwantowa', 'PHYS-KW-501', 5),
      (${depthsArray[0].id}, 'Projektowanie Systemów IT', 'CS-SYS-302', 4)
      RETURNING id;
    `;

    console.log("Generowanie harmonogramów (Mass Seed)...");
    const times = [
      { s: '08:15', e: '09:45' },
      { s: '10:15', e: '11:45' },
      { s: '12:15', e: '13:45' },
      { s: '14:15', e: '15:45' },
      { s: '16:15', e: '17:45' }
    ];

    let schedulesData = [];
    for (let day = 1; day <= 5; day++) {
       // Dla każdego dnia dodaj 8-12 losowych zajęć
       const dailyCount = Math.floor(Math.random() * 5) + 8;
       for (let i = 0; i < dailyCount; i++) {
          const room = roomsArray[Math.floor(Math.random() * roomsArray.length)];
          const course = coursesArray[Math.floor(Math.random() * coursesArray.length)];
          const prof = profsArray[Math.floor(Math.random() * profsArray.length)];
          const time = times[Math.floor(Math.random() * times.length)];
          
          schedulesData.push({
            room_id: room.id,
            course_id: course.id,
            professor_id: prof.id,
            semester: 'Letni 2025/2026',
            day_of_week: day,
            start_time: time.s,
            end_time: time.e
          });
       }
    }

    await sql`
      INSERT INTO schedules ${sql(schedulesData, 'room_id', 'course_id', 'professor_id', 'semester', 'day_of_week', 'start_time', 'end_time')}
    `;

    console.log("Generowanie ewidencji sprzętu...");
    const eqCats = await sql`
      INSERT INTO equipment_categories (category_name) VALUES 
      ('Stacje Robocze PC'), ('Laptopy'), ('Drukarki 3D'), ('Gogle VR'), ('Serwery')
      RETURNING id;
    `;

    const models = ['Dell Precision', 'MacBook Pro', 'Prusa i3', 'Meta Quest 3', 'PowerEdge R750'];
    let equipmentData = [];
    for (let r of roomsArray) {
       const count = Math.floor(Math.random() * 5) + 5;
       for (let i = 0; i < count; i++) {
          const catIdx = Math.floor(Math.random() * eqCats.length);
          equipmentData.push({
            room_id: r.id,
            category_id: eqCats[catIdx].id,
            model_name: models[catIdx],
            serial_number: `SN-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${r.id}-${i}`,
            purchase_date: '2024-01-01'
          });
       }
    }

    await sql`INSERT INTO equipment ${sql(equipmentData, 'room_id', 'category_id', 'model_name', 'serial_number', 'purchase_date')}`;

    console.log("Dodawanie użytkowników i administratora...");
    await sql`
      INSERT INTO users (username, password_hash, email, role, professor_id) VALUES 
      ('admin', 'admin_hash_123', 'admin@uczelnia.edu.pl', 'admin', NULL),
      ('a_sklodowska', 'prof_hash_234', 'a.sklodowska@uczelnia.edu.pl', 'professor', ${profsArray[0].id}),
      ('m_wojcik', 'prof_hash_345', 'm.wojcik@uczelnia.edu.pl', 'professor', ${profsArray[1].id}),
      ('j_nowak', 'prof_hash_456', 'j.nowak@uczelnia.edu.pl', 'professor', ${profsArray[2].id}),
      ('student1', 'sec_hash_567', 'student1@uczelnia.edu.pl', 'student', NULL),
      ('staff_tech', 'sec_hash_789', 'tech@uczelnia.edu.pl', 'staff', NULL);
    `;

    console.log("✅ Baza danych w pełni zainicjalizowana.");

  } catch (error: any) {
    console.error("❌ Błąd:", error.message);
  } finally {
    await sql.end();
  }
}

runSQL();
