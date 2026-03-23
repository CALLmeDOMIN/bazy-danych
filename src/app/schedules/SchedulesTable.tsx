"use client";

import { useState } from "react";

type ScheduleRow = {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    building_name: string;
    room_number: string;
    course_name: string;
    prof_first: string;
    prof_last: string;
    prof_title: string;
    dept_name: string;
};

export default function SchedulesTable({ rows }: { rows: ScheduleRow[] }) {
    const [filterText, setFilterText] = useState("");
    const [filterDay, setFilterDay] = useState("");

    const daysOfWeek = ['Brak', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

    const filteredRows = rows.filter(row => {
        const matchesText =
            row.course_name.toLowerCase().includes(filterText.toLowerCase()) ||
            row.prof_last.toLowerCase().includes(filterText.toLowerCase()) ||
            row.room_number.toLowerCase().includes(filterText.toLowerCase()) ||
            row.building_name.toLowerCase().includes(filterText.toLowerCase());

        const matchesDay = filterDay ? row.day_of_week.toString() === filterDay : true;

        return matchesText && matchesDay;
    });

    return (
        <div className="glass-card border-white/10 shadow-3xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Panel filtrów poziomy */}
            <div className="bg-white/[0.03] border-b border-white/5 p-8 flex flex-col md:flex-row gap-8 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Kryteria wyszukiwania danych</label>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Wpisz przedmiot, salę lub nazwisko..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-200 placeholder-slate-600 shadow-inner group-hover:border-white/20"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                        <svg className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
                <div className="w-full md:w-80">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Dzień Tygodnia</label>
                    <select
                        className="w-full px-4 py-4 bg-slate-950/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm text-slate-200 shadow-inner cursor-pointer hover:border-white/20 transition-all appearance-none"
                        value={filterDay}
                        onChange={(e) => setFilterDay(e.target.value)}
                    >
                        <option value="">Wszystkie Dni</option>
                        <option value="1">Poniedziałek</option>
                        <option value="2">Wtorek</option>
                        <option value="3">Środa</option>
                        <option value="4">Czwartek</option>
                        <option value="5">Piątek</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto h-[600px] custom-scrollbar">
                <table className="w-full text-left text-sm whitespace-nowrap relative">
                    <thead className="bg-[#020617] border-b border-white/5 text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black sticky top-0 z-20 shadow-xl">
                        <tr>
                            <th className="px-8 py-6 w-56 border-r border-white/5">Czas i Termin</th>
                            <th className="px-8 py-6 border-r border-white/5">Lokalizacja</th>
                            <th className="px-8 py-6 border-r border-white/5">Moduł Dydaktyczny</th>
                            <th className="px-8 py-6">Kierownik</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredRows.map((row) => (
                            <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-8 align-top border-r border-white/5">
                                    <div className="font-bold text-white group-hover:text-primary transition-colors text-lg">
                                        {daysOfWeek[row.day_of_week]}
                                    </div>
                                    <div className="text-primary text-[10px] mt-3 font-black bg-primary/5 px-3 py-1.5 rounded-lg inline-block border border-primary/20 tracking-widest uppercase">
                                        {row.start_time.substring(0, 5)} - {row.end_time.substring(0, 5)}
                                    </div>
                                </td>
                                <td className="px-8 py-8 align-top border-r border-white/5">
                                    <div className="font-black text-slate-100 flex items-center gap-3 text-lg">
                                        <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                                        Sala {row.room_number}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-3 pr-4 whitespace-normal leading-relaxed max-w-[200px] font-medium italic">
                                        {row.building_name}
                                    </div>
                                </td>
                                <td className="px-8 py-8 align-top border-r border-white/5">
                                    <div className="font-bold text-slate-100 text-lg whitespace-normal leading-tight max-w-[300px]">{row.course_name}</div>
                                    <div className="mt-3 inline-flex items-center gap-2 text-[9px] text-slate-600 bg-white/5 px-2 py-1 rounded border border-white/5 font-black uppercase tracking-wider">
                                        Verified System Record
                                    </div>
                                </td>
                                <td className="px-8 py-8 align-top">
                                    <div className="font-bold text-slate-100 text-lg">
                                        <span className="text-primary/50 text-xs mr-2 font-black italic">{row.prof_title}</span>
                                        {row.prof_first} {row.prof_last}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-3 whitespace-normal leading-relaxed max-w-[250px] font-medium">
                                        {row.dept_name}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filteredRows.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-8 py-24 text-center text-slate-600">
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                                       <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p className="text-xl font-bold text-slate-500">Brak dopasowanych rekordów</p>
                                    <p className="text-sm mt-3 font-medium opacity-50">Spróbuj zmienić parametry filtrowania bazy danych.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="bg-[#020617] border-t border-white/5 px-8 py-5 text-[9px] text-slate-600 text-right uppercase tracking-[0.3em] font-black flex justify-between items-center">
                <span className="flex items-center gap-2">
                   <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                   ID: SECURE-RECORDS-291-B
                </span>
                <span className="bg-white/5 px-4 py-2 rounded-full text-slate-400 border border-white/5 italic">
                   Status: {filteredRows.length} aktywnych wpisów
                </span>
            </div>
        </div>
    );
}
