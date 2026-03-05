'use client';
import { useState } from "react"; // Waxaan ku darnay useState
import { registerUser } from "@/app/actions/authActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"; // Icons cusub

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-xl font-bold text-slate-800 mb-6 uppercase tracking-wider">
        Student Registration
      </h1>

      <Card className="w-full max-w-lg shadow-sm border-gray-200 rounded-none bg-white">
        <CardContent className="pt-8 px-8">
          
          {/* Farriinta Guusha ama Khaladka */}
          {message && (
            <div className={`mb-6 p-4 flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </div>
          )}

          {message?.type === 'success' ? (
            <div className="text-center py-10 space-y-4">
              <p className="text-slate-600 font-medium">Diiwaangelintaadu waxay u gudubtay maamulka. Fadlan sug inta laguu oggolaanayo (Approval).</p>
              <Button asChild className="bg-[#1e3a5f] rounded-none">
                <Link href="/signin">Ku noqo Sign In</Link>
              </Button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setMessage(null);
                const formData = new FormData(e.currentTarget);
                const result = await registerUser(formData);
                setLoading(false);
                
                if (result?.error) {
                  setMessage({ type: 'error', text: result.error });
                } else {
                  setMessage({ type: 'success', text: "Diiwaangelintu way guulaysatay!" });
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-gray-500">First Name</Label>
                  <Input name="firstName" placeholder="First Name" required className="h-10 rounded-none border-gray-300 focus:ring-slate-400" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-gray-500">Last Name</Label>
                  <Input name="lastName" placeholder="Last Name" required className="h-10 rounded-none border-gray-300 focus:ring-slate-400" />
                </div>
              </div>

              {/* FASALKA (GRADE) - TANI WAA MUHIIM */}
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-gray-500">Fasalka (Grade)</Label>
                <select name="grade" required className="flex h-10 w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400">
                  <option value="">Dooro Fasalkaaga...</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-gray-500">E-Mail</Label>
                <Input name="email" type="email" placeholder="Email Address" required className="h-10 rounded-none border-gray-300 focus:ring-slate-400" />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-gray-500">Password</Label>
                <Input name="password" type="password" placeholder="••••••••" required className="h-10 rounded-none border-gray-300 focus:ring-slate-400" />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-gray-500">Confirm Password</Label>
                <Input name="confirmPassword" type="password" placeholder="••••••••" required className="h-10 rounded-none border-gray-300 focus:ring-slate-400" />
              </div>

              <Button disabled={loading} type="submit" className="w-full bg-[#1e3a5f] hover:bg-[#162a45] h-12 text-white rounded-none mt-4 uppercase text-xs font-bold tracking-widest transition-all">
                {loading ? <Loader2 className="animate-spin" /> : "Abuur Akoon"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-center border-t py-6 bg-white gap-4">
          <p className="text-[11px] text-gray-400">
            Horey ma u leedahay akoon? <Link href="/signin" className="text-blue-600 font-bold hover:underline">Soo Gali</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}