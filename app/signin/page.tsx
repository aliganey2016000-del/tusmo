"use client"; // Waa muhiim maadaama aan state isticmaaleyno

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email ama Password-ka waa khalad!");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Blue Header Section */}
        <div className="bg-blue-700 p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-2xl font-bold italic uppercase">TUSMO SCHOOL</h2>
          <p className="text-blue-100 text-sm mt-1 font-medium tracking-wide">Nidaamka Maamulka Ardayda</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs flex items-center gap-2 border border-red-100 animate-shake">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-gray-700">Email-ka</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@tusmoschool.com" 
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 rounded-xl" 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password" className="font-semibold text-gray-700">Password-ka</Label>
              <Link href="#" className="text-xs text-blue-600 hover:underline">Ma ilowday?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 rounded-xl" 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            disabled={loading}
            type="submit" 
            className="w-full bg-blue-700 hover:bg-blue-800 h-12 text-lg font-bold mt-4 shadow-lg shadow-blue-200 rounded-xl transition-all active:scale-95"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" /> Hubinayaa...
              </div>
            ) : (
              "Soo Gali System-ka"
            )}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Weli ma haysatid akoon? <Link href="/signup" className="text-blue-700 font-bold hover:underline">Codso Admission</Link>
          </p>
        </form>
      </div>
    </div>
  );
}