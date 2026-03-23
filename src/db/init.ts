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
    console.log("Usuwanie starych tabel i funkcji...");
    await sql`DROP TABLE IF EXISTS maintenance_reports CASCADE;`;
    await sql`DROP TABLE IF EXISTS room_bookings CASCADE;`;
    await sql`DROP TABLE IF EXISTS booking_statuses CASCADE;`;
    await sql`DROP TABLE IF EXISTS courses CASCADE;`;
    await sql`DROP TABLE IF EXISTS users CASCADE;`;
    await sql`DROP TABLE IF EXISTS professors CASCADE;`; // old table
    await sql`DROP TABLE IF EXISTS departments CASCADE;`;
    await sql`DROP TABLE IF EXISTS equipment CASCADE;`;
    await sql`DROP TABLE IF EXISTS equipment_categories CASCADE;`;
    await sql`DROP TABLE IF EXISTS rooms CASCADE;`;
    await sql`DROP TABLE IF EXISTS room_types CASCADE;`;
    await sql`DROP TABLE IF EXISTS buildings CASCADE;`;
    await sql`DROP TABLE IF EXISTS campuses CASCADE;`;
    await sql`DROP TABLE IF EXISTS schedules CASCADE;`; // old table

    await sql`DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;`;
    await sql`DROP FUNCTION IF EXISTS book_room CASCADE;`;

    console.log("Tworzenie schematu...");
    
    // Trigger function for updated_at
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    await sql`
      CREATE TABLE campuses (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          location_city VARCHAR(100) NOT NULL,
          established_year INTEGER CHECK (established_year > 1800)
      );
    `;

    await sql`
      CREATE TABLE buildings (
          id SERIAL PRIMARY KEY,
          campus_id INTEGER REFERENCES campuses(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          code VARCHAR(10) UNIQUE NOT NULL,
          floors INTEGER CHECK (floors >= 1)
      );
    `;

    await sql`
      CREATE TABLE room_types (
          id SERIAL PRIMARY KEY,
          type_name VARCHAR(50) UNIQUE NOT NULL,
          description TEXT
      );
    `;

    await sql`
      CREATE TABLE rooms (
          id SERIAL PRIMARY KEY,
          building_id INTEGER REFERENCES buildings(id) ON DELETE CASCADE,
          room_type_id INTEGER REFERENCES room_types(id) ON DELETE RESTRICT,
          room_number VARCHAR(20) NOT NULL,
          capacity INTEGER CHECK (capacity > 0),
          is_accessible BOOLEAN DEFAULT true,
          status VARCHAR(20) CHECK (status IN ('available', 'under_maintenance', 'closed')) DEFAULT 'available',
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await sql`CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`;

    await sql`
      CREATE TABLE equipment_categories (
          id SERIAL PRIMARY KEY,
          category_name VARCHAR(50) UNIQUE NOT NULL
      );
    `;

    await sql`
      CREATE TABLE equipment (
          id SERIAL PRIMARY KEY,
          room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
          category_id INTEGER REFERENCES equipment_categories(id) ON DELETE RESTRICT,
          model_name VARCHAR(100) NOT NULL,
          serial_number VARCHAR(100) UNIQUE,
          purchase_date DATE,
          status VARCHAR(20) CHECK (status IN ('operational', 'broken', 'under_repair', 'retired')) DEFAULT 'operational',
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await sql`CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`;

    await sql`
      CREATE TABLE departments (
          id SERIAL PRIMARY KEY,
          name VARCHAR(150) UNIQUE NOT NULL,
          head_of_department VARCHAR(100)
      );
    `;

    await sql`
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          role VARCHAR(20) CHECK (role IN ('admin', 'professor', 'student', 'staff')) NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          title VARCHAR(50),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await sql`CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`;

    await sql`
      CREATE TABLE courses (
          id SERIAL PRIMARY KEY,
          department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
          course_name VARCHAR(150) NOT NULL,
          course_code VARCHAR(20) UNIQUE NOT NULL,
          credits INTEGER CHECK (credits > 0)
      );
    `;

    await sql`
      CREATE TABLE booking_statuses (
          id SERIAL PRIMARY KEY,
          status_name VARCHAR(30) UNIQUE NOT NULL,
          description TEXT
      );
    `;

    await sql`
      CREATE TABLE room_bookings (
          id SERIAL PRIMARY KEY,
          room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
          status_id INTEGER REFERENCES booking_statuses(id) ON DELETE RESTRICT,
          booking_type VARCHAR(20) CHECK (booking_type IN ('class', 'reservation')) NOT NULL,
          title VARCHAR(150) NOT NULL,
          semester VARCHAR(20),
          day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 7),
          reserved_date DATE,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await sql`CREATE TRIGGER update_room_bookings_updated_at BEFORE UPDATE ON room_bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`;

    await sql`
      CREATE TABLE maintenance_reports (
          id SERIAL PRIMARY KEY,
          reported_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
          room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
          equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
          report_type VARCHAR(30) CHECK (report_type IN ('broken_equipment', 'room_preparation', 'other')) NOT NULL,
          description TEXT NOT NULL,
          priority VARCHAR(20) CHECK (priority IN ('low', 'normal', 'high', 'critical')) DEFAULT 'normal',
          status VARCHAR(20) CHECK (status IN ('open', 'in_progress', 'resolved', 'rejected')) DEFAULT 'open',
          resolved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
          resolved_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await sql`CREATE TRIGGER update_maintenance_reports_updated_at BEFORE UPDATE ON maintenance_reports FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`;

    // Add stored procedure
    console.log("Tworzenie stored procedures...");
    await sql`
      CREATE OR REPLACE PROCEDURE book_room_proc(
          p_room_id INTEGER,
          p_user_id INTEGER,
          p_course_id INTEGER,
          p_status_id INTEGER,
          p_booking_type VARCHAR,
          p_title VARCHAR,
          p_reserved_date DATE,
          p_start_time TIME,
          p_end_time TIME,
          INOUT p_new_booking_id INTEGER DEFAULT NULL
      )
      LANGUAGE plpgsql
      AS $$
      DECLARE
          v_overlap_count INTEGER;
      BEGIN
          SELECT COUNT(*) INTO v_overlap_count
          FROM room_bookings
          WHERE room_id = p_room_id
            AND reserved_date = p_reserved_date
            AND (
                (start_time < p_end_time AND end_time > p_start_time)
            );

          IF v_overlap_count > 0 THEN
              RAISE EXCEPTION 'Room is already booked for this time period.';
          END IF;

          INSERT INTO room_bookings (room_id, user_id, course_id, status_id, booking_type, title, reserved_date, start_time, end_time)
          VALUES (p_room_id, p_user_id, p_course_id, p_status_id, p_booking_type, p_title, p_reserved_date, p_start_time, p_end_time)
          RETURNING id INTO p_new_booking_id;
      END;
      $$;
    `;

    console.log("Dodawanie danych podstawowych...");

    const campusesArray = await sql`
      INSERT INTO campuses (name, location_city, established_year) VALUES 
      ('Kampus Główny', 'Warszawa', 1915),
      ('Kampus Południowy', 'Kraków', 1880)
      RETURNING id;
    `;

    const buildingsArray = await sql`
      INSERT INTO buildings (campus_id, name, code, floors) VALUES 
      (${campusesArray[0].id}, 'Wydział Inżynierii Środowiska', 'IŚ', 5),
      (${campusesArray[0].id}, 'Gmach Główny', 'GG', 4),
      (${campusesArray[1].id}, 'Wydział Elektroniki', 'WE', 6)
      RETURNING id;
    `;

    const roomTypesArray = await sql`
      INSERT INTO room_types (type_name, description) VALUES 
      ('Audytoryjna', 'Sala wykładowa na 100+ miejsc'),
      ('Laboratorium Komputerowe', 'Sala ze stacjami PC'),
      ('Sala Ćwiczeniowa', 'Klasyczna mniejsza sala')
      RETURNING id;
    `;

    let roomsData = [];
    for (let b of buildingsArray) {
      roomsData.push({ building_id: b.id, room_type_id: roomTypesArray[0].id, room_number: "AULA-" + b.id, capacity: 150, is_accessible: true, status: 'available' });
      roomsData.push({ building_id: b.id, room_type_id: roomTypesArray[1].id, room_number: "LAB-" + b.id + "0", capacity: 30, is_accessible: true, status: 'available' });
      roomsData.push({ building_id: b.id, room_type_id: roomTypesArray[2].id, room_number: "S-" + b.id + "5", capacity: 20, is_accessible: false, status: 'available' });
    }
    const roomsArray = await sql`
      INSERT INTO rooms ${sql(roomsData, 'building_id', 'room_type_id', 'room_number', 'capacity', 'is_accessible', 'status')}
      RETURNING id;
    `;

    const departmentsArray = await sql`
      INSERT INTO departments (name, head_of_department) VALUES 
      ('Katedra Baz Danych', 'Prof. Dr hab. Anna Skłodowska'),
      ('Katedra Algorytmiki', 'Prof. Mikołaj Wójcik')
      RETURNING id;
    `;

    const eqCats = await sql`
      INSERT INTO equipment_categories (category_name) VALUES 
      ('Stacje Robocze PC'), ('Projektor'), ('Ekran'), ('Głośniki')
      RETURNING id;
    `;

    let equipmentData = [];
    for (let r of roomsArray) {
      if (Math.random() > 0.5) {
        equipmentData.push({
          room_id: r.id,
          category_id: eqCats[1].id,
          model_name: 'Epson Pro 100',
          serial_number: `PRJ-${r.id}-${Math.floor(Math.random()*100)}`,
          purchase_date: '2022-01-10',
          status: 'operational'
        });
      }
    }
    await sql`INSERT INTO equipment ${sql(equipmentData, 'room_id', 'category_id', 'model_name', 'serial_number', 'purchase_date', 'status')}`;

    console.log("Dodawanie użytkowników i administratora...");
    const usersArray = await sql`
      INSERT INTO users (username, password_hash, email, role, department_id, first_name, last_name, title) VALUES 
      ('admin', 'admin_hash_123', 'admin@uczelnia.edu.pl', 'admin', NULL, 'Główny', 'Administrator', NULL),
      ('a_sklodowska', 'prof_hash_234', 'a.sklodowska@uczelnia.edu.pl', 'professor', ${departmentsArray[0].id}, 'Anna', 'Skłodowska', 'Prof. Dr hab.'),
      ('m_wojcik', 'prof_hash_345', 'm.wojcik@uczelnia.edu.pl', 'professor', ${departmentsArray[1].id}, 'Mikołaj', 'Wójcik', 'Prof.'),
      ('student1', 'sec_hash_567', 'student1@uczelnia.edu.pl', 'student', NULL, 'Jan', 'Kowalski', NULL),
      ('staff_tech', 'sec_hash_789', 'tech@uczelnia.edu.pl', 'staff', NULL, 'Piotr', 'Techniczny', NULL)
      RETURNING id;
    `;

    const coursesArray = await sql`
      INSERT INTO courses (department_id, course_name, course_code, credits) VALUES 
      (${departmentsArray[0].id}, 'Zaawansowane Bazy Danych SQL', 'CS-DB-401', 6),
      (${departmentsArray[1].id}, 'Algorytmy i Struktury Danych', 'CS-AL-201', 6)
      RETURNING id;
    `;

    const statusesArray = await sql`
      INSERT INTO booking_statuses (status_name, description) VALUES 
      ('Zatwierdzona', 'Rezerwacja została w pełni zatwierdzona'),
      ('Oczekująca', 'Rezerwacja czeka na akceptację administratora'),
      ('Anulowana', 'Rezerwacja została odwołana')
      RETURNING id;
    `;

    console.log("✅ Baza danych w pełni zainicjalizowana z nowym schematem zgodnym z erDiagram!");

  } catch (error: any) {
    console.error("❌ Błąd:", error.message);
  } finally {
    await sql.end();
  }
}

runSQL();
