"use client"; // Waa muhiim in tani ay kor ku qornaato

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, Users, GraduationCap, Award, Phone, Mail, MapPin 
} from "lucide-react";

export default function Home() {
  return (
    <div className="w-full bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-blue-50 py-20 lg:py-32 w-full">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-blue-900 leading-tight">
              TUSMO Primary & <br />
              <span className="text-blue-600">Secondary School</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Waxaan bixinaa waxbarasho tayo leh oo ku dhisan anshax iyo aqoon sare. 
              Halkan waa hoyga lagu diyaariyo hoggaamiyeyaasha mustaqbalka ee dalka.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" className="bg-blue-700 hover:bg-blue-800 px-8">
                Codso Hadda (Apply)
              </Button>
              <Button size="lg" variant="outline" className="border-blue-700 text-blue-700">
                Baro Wax Badan
              </Button>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="w-full h-96 bg-blue-200 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
               <GraduationCap size={150} className="text-blue-600 opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-12 bg-white w-full">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Arday", value: "1,200+", icon: <Users /> },
            { label: "Macallimiin", value: "45+", icon: <BookOpen /> },
            { label: "Qalin-jabiyey", value: "850+", icon: <GraduationCap /> },
            { label: "Guulaha", value: "15+", icon: <Award /> },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 border rounded-2xl hover:shadow-md transition">
              <div className="flex justify-center text-blue-600 mb-2">{stat.icon}</div>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Maxaad Noo Dooranaysaa?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 mb-4">
                  <BookOpen />
                </div>
                <CardTitle>Manaahij Tayo leh</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Waxaan raacnaa manhajka qaranka oo lagu daray luuqado iyo cilmiga casriga ah.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-700 mb-4">
                  <Users />
                </div>
                <CardTitle>Maamul Casri ah</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Nidaamkayaga online-ka ah wuxuu waalidka u sahlayaa inuu la socdo dhibcaha iyo joogitaanka ardayga.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 mb-4">
                  <Award />
                </div>
                <CardTitle>Macallimiin khibrad leh</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Macallimiintayadu waa kuwo aqoon sare u leh maadada ay dhigayaan iyo barbaarinta ubadka.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-blue-900 text-white py-12 w-full">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4 uppercase">Tusmo School</h3>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 uppercase">Xiriirka</h3>
            <div className="space-y-3 text-sm text-blue-100">
              <p className="flex items-center gap-2"><MapPin size={16} /> Degmada Hodan, Muqdisho</p>
              <p className="flex items-center gap-2"><Phone size={16} /> +252 61XXXXXXX</p>
              <p className="flex items-center gap-2"><Mail size={16} /> info@tusmoschool.edu.so</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}