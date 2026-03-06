"use client";

import { useState } from "react";
import { registerUser } from "@/app/actions/authActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, GraduationCap } from "lucide-react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-10 px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center">
        
        {/* Qaybta Bidix: Hero Inspirational */}
        <div className="text-white space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30 text-blue-300">
            <GraduationCap size={18} />
            <span className="text-sm font-semibold tracking-wide">TUSMO PRIMARY & SECONDARY</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Halkaan Ayay Ka Bilaabataa... <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Jidkaaga Guusha.</span>
          </h1>
          
          <p className="text-lg text-gray-300 leading-relaxed border-l-4 border-orange-500 pl-6">
            TUSMO School ma ahan kaliya goob waxbarasho, waa hoyga lagu naaxiyo hammiga ardayga, laguna dhiso aqoon iyo anshax is-kaabaya. Nagu soo Biir si aad u dhisatid mustaqbal dhalaalaya.
          </p>
          
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-xl text-lg font-bold transition-all shadow-lg shadow-orange-500/20">
            Bilow Safarkaaga Hadda →
          </Button>
        </div>

        {/* Qaybta Midig: Diiwaangelinta */}
        <Card className="p-8 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border-0 bg-white">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Diiwaangelin</h2>
          <p className="text-gray-500 mb-8">Buuxi xogtaada si aad u bilowdo waxbarashada.</p>
          
          {message && (
            <div className={`mb-6 p-4 flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </div>
          )}

          {!message || message.type === 'error' ? (
            <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const formData = new FormData(e.currentTarget);
                const result = await registerUser(formData);
                setLoading(false);
                if (result?.error) setMessage({ type: 'error', text: result.error });
                else setMessage({ type: 'success', text: "Diiwaangelintu way guulaysatay!" });
              }} className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-gray-500">Magaca Koowaad</Label>
                  <Input name="firstName" placeholder="Magaca" required className="h-12 rounded-xl border-gray-200" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-gray-500">Magaca dambe</Label>
                  <Input name="lastName" placeholder="Magaca dambe" required className="h-12 rounded-xl border-gray-200" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-gray-500">Fasalka (Grade)</Label>
                <select name="grade" required className="w-full h-12 border border-gray-300 rounded-xl px-3 text-sm focus:outline-none">
                  <option value="">Dooro Fasalka...</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-gray-500">E-Mail</Label>
                <Input name="email" type="email" placeholder="Email-kaaga" required className="h-12 rounded-xl border-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-gray-500">Password</Label>
                  <Input name="password" type="password" placeholder="••••••••" required className="h-12 rounded-xl border-gray-200" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-gray-500">Confirm Password</Label>
                  <Input name="confirmPassword" type="password" placeholder="••••••••" required className="h-12 rounded-xl border-gray-200" />
                </div>
              </div>

              <Button disabled={loading} type="submit" className="w-full bg-blue-700 hover:bg-blue-800 h-14 text-white rounded-xl mt-4 font-bold text-lg transition-all">
                {loading ? <Loader2 className="animate-spin" /> : "Abuur Akoon"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-600 mb-4">Diiwaangelintaadu way dhamaatay, sug oggolaanshaha maamulka.</p>
              <Link href="/signin" className="text-blue-600 font-bold hover:underline">Soo Gali</Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}