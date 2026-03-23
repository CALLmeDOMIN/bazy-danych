import sql from "@/db";

export default async function EquipmentAnalyticsPage() {
    const campusAnalytics = await sql`
    SELECT 
      c.id,
      c.name AS campus_name,
      COUNT(e.id) AS total_equipment
    FROM campuses c
    LEFT JOIN buildings b ON c.id = b.campus_id
    LEFT JOIN rooms r ON b.id = r.building_id
    LEFT JOIN equipment e ON r.id = e.room_id
    GROUP BY c.id, c.name
    ORDER BY total_equipment DESC;
  `;

    const equipmentByType = await sql`
    SELECT 
      b.name AS building_name,
      ec.category_name,
      COUNT(e.id) as item_count
    FROM equipment e
    JOIN equipment_categories ec ON e.category_id = ec.id
    JOIN rooms r ON e.room_id = r.id
    JOIN buildings b ON r.building_id = b.id
    GROUP BY b.id, b.name, ec.id, ec.category_name
    ORDER BY b.name ASC, item_count DESC;
  `;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-12">

            {/* Nagłówek Sekcji */}
            <div className="relative p-10 rounded-3xl premium-gradient border border-white/5 overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-4xl font-serif font-black text-white">Raport <span className="text-primary italic">Inwentarza</span></h2>
                    <p className="text-slate-400 mt-4 max-w-2xl text-lg font-medium">
                        Zautomatyzowany panel weryfikacji ewidencji sprzętu w wydziałach strukturalnych. Moduł podsumowuje majątek rzeczowy uczelni.
                    </p>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/4 bg-primary/5 blur-3xl pointer-events-none"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Raport Ogólny - Kampusy (1/3) */}
                <div className="lg:col-span-1 space-y-8">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5 pb-4">Agregacja - Przydziały na Kampusy</h3>
                    <div className="flex flex-col gap-6">
                        {campusAnalytics.map(record => (
                            <div key={record.id} className="glass-card rounded-2xl p-8 group hover:border-primary/40 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/30 group-hover:bg-primary transition-colors"></div>
                                <div className="mb-6">
                                    <h3 className="text-xl font-black text-white group-hover:translate-x-1 transition-transform">{record.campus_name}</h3>
                                    <p className="text-[9px] text-primary uppercase tracking-[0.2em] font-black flex items-center gap-2 mt-4">
                                        <span className="w-1 h-1 rounded-full bg-primary animate-ping"></span>
                                        Środki Trwałe i Wyposażenie
                                    </p>
                                </div>
                                <div className="text-5xl font-serif font-black text-white border-t border-white/5 pt-6 flex items-baseline gap-3">
                                    {record.total_equipment} 
                                    <span className="text-xs font-sans font-black text-slate-600 uppercase tracking-widest">Jednostek</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Raport Szczegółowy (2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5 pb-4 flex justify-between items-center">
                        Szczegółowa Dyslokacja Zasobów IT
                    </h3>

                    <div className="glass-card border-white/10 rounded-3xl shadow-3xl overflow-hidden max-h-[750px] flex flex-col">
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-[#020617] border-b border-white/5 text-slate-600 uppercase tracking-[0.2em] text-[10px] font-black sticky top-0 z-10 shadow-xl">
                                    <tr>
                                        <th className="px-8 py-6 w-1/2 border-r border-white/5">Wydział / Budynek</th>
                                        <th className="px-8 py-6 border-r border-white/5">Kategoria</th>
                                        <th className="px-8 py-6 text-right">Stan Inwentarza</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {equipmentByType.map((eq, idx) => {
                                        // Dynamic color scheme based on category
                                        const getCategoryStyle = (cat: string) => {
                                            if (cat.includes('VR') || cat.includes('AR')) return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
                                            if (cat.includes('Serwer') || cat.includes('Obliczeniowe')) return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
                                            if (cat.includes('3D')) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
                                            if (cat.includes('Komputer') || cat.includes('Laptopy') || cat.includes('PC')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
                                            return 'text-slate-400 bg-white/5 border-white/10';
                                        };

                                        return (
                                            <tr 
                                                key={idx} 
                                                className="hover:bg-white/[0.04] transition-all duration-300 group cursor-default"
                                                style={{ animationDelay: `${idx * 50}ms` }}
                                            >
                                                <td className="px-8 py-7 align-middle border-r border-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-1.5 h-10 bg-slate-800 rounded-full overflow-hidden relative">
                                                            <div className="absolute top-0 left-0 w-full bg-primary/40 group-hover:h-full transition-all duration-700 h-1/3"></div>
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-100 text-lg group-hover:text-primary transition-colors duration-300">
                                                                {eq.building_name}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Active Asset Node</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-7 align-middle border-r border-white/5">
                                                    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] uppercase tracking-[0.15em] font-black border backdrop-blur-md transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] ${getCategoryStyle(eq.category_name)}`}>
                                                        {eq.category_name}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-7 align-middle text-right">
                                                    <div className="inline-flex flex-col items-end">
                                                        <span className="font-mono text-2xl font-black text-white group-hover:scale-110 transition-transform duration-500 origin-right">
                                                            {eq.item_count}
                                                        </span>
                                                        <span className="text-[8px] font-black text-slate-700 uppercase tracking-tighter mt-1">Total Quantity</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-[#020617] border-t border-white/5 px-8 py-4 text-[9px] text-slate-600 text-right uppercase tracking-[0.3em] font-black flex justify-between items-center italic">
                            <span>Moduł Analityczny - Księgowość Wewnętrzna</span>
                            <span className="text-primary/40 leading-none">Weryfikacja Kontrolna Zakończona</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
