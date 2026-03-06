"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function BecomeInstructorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-800 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm mb-4 inline-block font-semibold">
              Ku soo biir 500+ macallin oo adduunka ah
            </span>
            <h1 className="text-5xl font-bold mb-6 leading-tight">La wadaag aqoontaada Bulshada</h1>
            <p className="text-lg opacity-90 mb-8">
              U beddel khibraddaada dakhli. Samee koorsooyin oo gaarsii malaayiin arday ah.
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-lg text-lg font-bold">
              Bilow wax-dhigista maanta →
            </Button>
          </div>

          {/* Contact Form Card */}
          <Card className="bg-white p-8 rounded-xl shadow-2xl border-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nala soo xiriir</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Magacaaga *" className="w-full p-3 border rounded-lg text-gray-800" />
                <input placeholder="Email-kaaga *" className="w-full p-3 border rounded-lg text-gray-800" />
              </div>
              <input placeholder="Ujeedada *" className="w-full p-3 border rounded-lg text-gray-800" />
              <textarea placeholder="Fariintaada *" className="w-full p-3 border rounded-lg h-32 text-gray-800" />
              <Button className="w-full bg-slate-800 text-white py-6 text-lg font-bold">
                Dir Fariinta
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
        <div className="flex gap-4 p-6 bg-white rounded-lg shadow-sm border items-center">
          <Mail className="text-orange-500 w-10 h-10" />
          <div>
            <h4 className="font-bold text-gray-900">Email-ka</h4>
            <p className="text-gray-600">info@tusmo.edu.so</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 bg-white rounded-lg shadow-sm border items-center">
          <Phone className="text-orange-500 w-10 h-10" />
          <div>
            <h4 className="font-bold text-gray-900">Nala soo xiriir</h4>
            <p className="text-gray-600">+252 61XXXXXXX</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 bg-white rounded-lg shadow-sm border items-center">
          <MapPin className="text-orange-500 w-10 h-10" />
          <div>
            <h4 className="font-bold text-gray-900">Xarunta Dhexe</h4>
            <p className="text-gray-600">Degmada Hodan, Muqdisho</p>
          </div>
        </div>
      </section>
    </div>
  );
}