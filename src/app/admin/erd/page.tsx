"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const mermaidCode = `erDiagram
    CAMPUSES ||--o{ BUILDINGS : "campus_id"
    BUILDINGS ||--o{ ROOMS : "building_id"
    ROOM_TYPES ||--o{ ROOMS : "room_type_id"
    ROOMS ||--o{ EQUIPMENT : "room_id"
    EQUIPMENT_CATEGORIES ||--o{ EQUIPMENT : "category_id"
    DEPARTMENTS ||--o{ USERS : "department_id"
    DEPARTMENTS ||--o{ COURSES : "department_id"
    USERS ||--o{ ROOM_BOOKINGS : "user_id"
    COURSES ||--o{ ROOM_BOOKINGS : "course_id"
    ROOMS ||--o{ ROOM_BOOKINGS : "room_id"
    BOOKING_STATUSES ||--o{ ROOM_BOOKINGS : "status_id"
    USERS ||--o{ MAINTENANCE_REPORTS : "reported_by"
    USERS ||--o{ MAINTENANCE_REPORTS : "resolved_by"
    ROOMS ||--o{ MAINTENANCE_REPORTS : "room_id"
    EQUIPMENT ||--o{ MAINTENANCE_REPORTS : "equipment_id"
    USERS ||--o{ USER_AUDIT_LOGS : "user_id"

    CAMPUSES {
        SERIAL id PK
        VARCHAR_100 name UK
        VARCHAR_100 location_city
        INTEGER established_year
    }

    BUILDINGS {
        SERIAL id PK
        INTEGER campus_id FK
        VARCHAR_100 name
        VARCHAR_10 code UK
        INTEGER floors
    }

    ROOM_TYPES {
        SERIAL id PK
        VARCHAR_50 type_name UK
        TEXT description
    }

    ROOMS {
        SERIAL id PK
        INTEGER building_id FK
        INTEGER room_type_id FK
        VARCHAR_20 room_number
        INTEGER capacity
        BOOLEAN is_accessible
        VARCHAR_20 status
        TIMESTAMP updated_at
    }

    EQUIPMENT_CATEGORIES {
        SERIAL id PK
        VARCHAR_50 category_name UK
    }

    EQUIPMENT {
        SERIAL id PK
        INTEGER room_id FK
        INTEGER category_id FK
        VARCHAR_100 model_name
        VARCHAR_100 serial_number UK
        DATE purchase_date
        VARCHAR_20 status
        TIMESTAMP updated_at
    }

    DEPARTMENTS {
        SERIAL id PK
        VARCHAR_150 name UK
        VARCHAR_100 head_of_department
    }

    USERS {
        SERIAL id PK
        INTEGER department_id FK
        VARCHAR_50 username UK
        VARCHAR_255 password_hash
        VARCHAR_100 email UK
        VARCHAR_20 role
        VARCHAR_50 first_name
        VARCHAR_50 last_name
        VARCHAR_50 title
        BOOLEAN is_active
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    COURSES {
        SERIAL id PK
        INTEGER department_id FK
        VARCHAR_150 course_name
        VARCHAR_20 course_code UK
        INTEGER credits
    }

    BOOKING_STATUSES {
        SERIAL id PK
        VARCHAR_30 status_name UK
        TEXT description
    }

    ROOM_BOOKINGS {
        SERIAL id PK
        INTEGER room_id FK
        INTEGER user_id FK
        INTEGER course_id FK
        INTEGER status_id FK
        VARCHAR_20 booking_type
        VARCHAR_150 title
        VARCHAR_20 semester
        INTEGER day_of_week
        DATE reserved_date
        TIME start_time
        TIME end_time
        TEXT notes
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    MAINTENANCE_REPORTS {
        SERIAL id PK
        INTEGER reported_by FK
        INTEGER room_id FK
        INTEGER equipment_id FK
        VARCHAR_30 report_type
        TEXT description
        VARCHAR_20 priority
        VARCHAR_20 status
        INTEGER resolved_by FK
        TIMESTAMP resolved_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    USER_AUDIT_LOGS {
        SERIAL id PK
        INTEGER user_id FK
        VARCHAR_20 old_role
        VARCHAR_20 new_role
        VARCHAR_20 action_type
        TIMESTAMP changed_at
    }`;

export default function ErdPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function renderDiagram() {
      // Dynamiczny import Mermaid z CDN
      const mermaid = (await import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs" as any)).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        er: {
          layoutDirection: "TB",
          entityPadding: 15,
          useMaxWidth: false,
        },
        themeVariables: {
          primaryColor: "#6366f1",
          primaryTextColor: "#e2e8f0",
          lineColor: "#6366f1",
          secondaryColor: "#1e1b4b",
        },
      });

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        const { svg } = await mermaid.render("erd-diagram", mermaidCode);
        containerRef.current.innerHTML = svg;
      }
    }

    renderDiagram();
  }, []);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </Link>
            <h1 className="text-2xl font-serif font-black text-foreground">Diagram ERD Bazy Danych</h1>
          </div>
          <p className="text-sm text-muted-foreground">Wizualizacja pełnego schematu bazy danych — 13 tabel, relacje, typy danych.</p>
        </div>
      </div>

      <div className="bg-secondary/40 border border-white/5 shadow-xl rounded-3xl p-6 lg:p-8 backdrop-blur-sm overflow-auto">
        <div ref={containerRef} className="min-h-[600px] flex items-center justify-center text-muted-foreground">
          <p className="animate-pulse">Ładowanie diagramu ERD...</p>
        </div>
      </div>
    </div>
  );
}
