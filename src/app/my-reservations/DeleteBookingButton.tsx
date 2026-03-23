"use client";

import { deleteBooking } from "@/lib/my-reservations-actions";
import { useState } from "react";

export default function DeleteBookingButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    console.log("Delete button clicked for ID:", id);
    if (confirm("Czy na pewno chcesz anulować tę rezerwację? Ta akcja jest nieodwracalna.")) {
      setIsDeleting(true);
      console.log("Calling deleteBooking with ID:", id);
      const res = await deleteBooking(id);
      console.log("Response from server:", res);
      setIsDeleting(false);
      
      if (res?.error) {
        alert(res.error);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-[10px] px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-black uppercase tracking-widest rounded-lg border border-red-500/20 transition-all active:scale-95 disabled:opacity-50"
    >
      {isDeleting ? "Anulowanie..." : "Anuluj"}
    </button>
  );
}
