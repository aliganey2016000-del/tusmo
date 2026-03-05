'use client';
import { registerUser } from "@/app/actions/authActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-xl font-bold text-slate-800 mb-6 uppercase tracking-wider">
        Student Registration
      </h1>

      <Card className="w-full max-w-lg shadow-sm border-gray-200 rounded-none bg-white">
        <CardContent className="pt-8 px-8">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const result = await registerUser(formData);
              if (result?.error) {
                // Handle error (e.g., show a message)
                alert(result.error);
              }
            }}
            className="space-y-4"
          >
            
            <div className="space-y-1">
              <Label className="text-xs text-gray-700">First Name</Label>
              <Input name="firstName" placeholder="First Name" required className="h-10 rounded-none border-gray-300" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-700">Last Name</Label>
              <Input name="lastName" placeholder="Last Name" required className="h-10 rounded-none border-gray-300" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-700">User Name</Label>
              <Input name="username" placeholder="User Name" required className="h-10 rounded-none border-gray-300" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-700">E-Mail</Label>
              <Input name="email" type="email" placeholder="E-Mail" required className="h-10 rounded-none border-gray-300" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-700">Password</Label>
              <Input name="password" type="password" placeholder="Password" required className="h-10 rounded-none border-gray-300" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-700">Password confirmation</Label>
              <Input name="confirmPassword" type="password" placeholder="Password Confirmation" required className="h-10 rounded-none border-gray-300" />
            </div>

            <Button type="submit" className="w-full bg-[#1e3a5f] hover:bg-[#162a45] h-10 text-white rounded-none mt-4 uppercase text-xs font-bold tracking-widest">
              Register
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center border-t py-6 bg-white gap-4">
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition uppercase">
            <Image src="https://www.google.com/favicon.ico" alt="Google" width={12} height={12} className="w-3 h-3" />
            Sign in with Google
          </button>
          <p className="text-[10px] text-gray-400">
            Horey ma u leedahay akoon? <Link href="/signin" className="text-blue-600 font-bold hover:underline">Soo Gali</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}