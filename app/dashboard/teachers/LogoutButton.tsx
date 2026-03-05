"use client"; // Tani waxay oggolaanaysaa inonClick uu shaqeeyo

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })} // Markuu ka baxo wuxuu tagayaa Home
      className="flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 w-full rounded-2xl transition-all font-bold text-sm"
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}