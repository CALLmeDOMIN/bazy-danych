import sql from "@/db";
import AddEquipmentForm from "./AddEquipmentForm";

export default async function EquipmentPage() {
  const equipmentList = await sql`
    SELECT 
      e.id, e.model_name, e.serial_number, e.purchase_date, e.status, e.updated_at,
      r.room_number, b.code as building_code,
      c.category_name
    FROM equipment e
    JOIN rooms r ON e.room_id = r.id
    JOIN buildings b ON r.building_id = b.id
    JOIN equipment_categories c ON e.category_id = c.id
    ORDER BY e.id DESC
    LIMIT 100
  `;

  const rooms = await sql`
    SELECT r.id, r.room_number, b.code as building_code 
    FROM rooms r JOIN buildings b ON r.building_id = b.id 
    ORDER BY b.code, r.room_number
  `;
  const categories = await sql`SELECT id, category_name FROM equipment_categories ORDER BY category_name`;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif font-black text-foreground">
            Ewidencja <span className="text-primary italic">Sprzętu</span>
          </h2>
          <p className="text-muted-foreground mt-2 text-sm uppercase tracking-widest font-black">
            Zarządzanie majątkiem trwałym
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        <div className="xl:col-span-1 glass-card p-8 rounded-3xl border border-border relative overflow-hidden">
           <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none"></div>
           <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
             <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
             Dodaj Urządzenie
           </h3>
           <AddEquipmentForm rooms={rooms} categories={categories} />
        </div>

        <div className="xl:col-span-2 glass-card p-1 rounded-3xl border border-border relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/30 blur-[80px] rounded-full pointer-events-none"></div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-border text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                   <th className="p-6">Urządzenie / Model</th>
                   <th className="p-6">Lokalizacja</th>
                   <th className="p-6">Numer Seryjny</th>
                   <th className="p-6 text-right">Status Akt.</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border text-sm">
                 {equipmentList.map((eq: any) => (
                   <tr key={eq.id} className="hover:bg-secondary/40 transition-colors group">
                     <td className="p-6">
                       <span className="block font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{eq.category_name}</span>
                       <span className="block text-xs text-muted-foreground mt-1">{eq.model_name}</span>
                     </td>
                     <td className="p-6">
                       <span className="block text-foreground font-bold">Sala {eq.room_number}</span>
                       <span className="block text-muted-foreground text-xs mt-1">{eq.building_code}</span>
                     </td>
                     <td className="p-6 text-muted-foreground font-mono text-xs">
                       {eq.serial_number || <span className="text-muted-foreground italic opacity-50">Brak danych</span>}
                     </td>
                     <td className="p-6 text-right">
                       <span className={`text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full border ${
                         eq.status === 'operational' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                         eq.status === 'broken' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' :
                         eq.status === 'under_repair' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                         'bg-secondary text-muted-foreground border-border'
                       }`}>
                         {eq.status === 'operational' ? 'SPRAWNY' : 
                          eq.status === 'broken' ? 'ZEPSUTY' : 
                          eq.status === 'under_repair' ? 'W NAPRAWIE' : 'WYCOFANY'}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

      </div>
    </div>
  );
}
