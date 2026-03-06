'use client';

import { useState, useRef } from "react";
import { sendContactMessage } from "@/app/actions/contactActions";
import { Mail, Phone, MapPin, ArrowRight, Loader2 } from "lucide-react";

export default function BecomeInstructorPage() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await sendContactMessage(formData);
    setLoading(false);

    if (result.success) {
      alert("Mahadsanid! Fariintaada si guul leh ayaa loo diray.");
      formRef.current?.reset(); // Foomka nadiifi marka la diro
    } else {
      alert("Cillad ayaa dhacday: " + result.error);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a2332]"> {/* Background-ka Navy-ga ah */}
      
      {/* MAIN HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE: TEXT & HERO */}
        <div className="space-y-8 text-left">
          <div className="inline-block bg-orange-500/10 text-orange-500 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
            Ku soo biir 500+ macallin oo adduunka ah
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
            La wadaag aqoontaada <br /> 
            <span className="text-white/90">Bulshada</span>
          </h1>
          
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            U beddel khibraddaada dakhli. Samee koorsooyin oo gaarsii malaayiin arday ah.
          </p>

          <button className="bg-[#f08533] hover:bg-[#d6722a] text-white px-8 py-4 rounded-xl font-black text-lg flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20 active:scale-95">
            Bilow wax-dhigista maanta <ArrowRight size={20} />
          </button>
        </div>

        {/* RIGHT SIDE: THE FORM CARD */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-8">
          <div className="text-left">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Nala soo xiriir</h2>
          </div>

          <form ref={formRef} action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                name="name" 
                placeholder="Magacaaga *" 
                required 
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-600 font-medium" 
              />
              <input 
                name="email" 
                type="email" 
                placeholder="Email-kaaga *" 
                required 
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-600 font-medium" 
              />
            </div>

            <input 
              name="subject" 
              placeholder="Ujeedada *" 
              required 
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-600 font-medium" 
            />

            <textarea 
              name="message" 
              placeholder="Fariintaada *" 
              rows={5} 
              required 
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-600 font-medium" 
            />

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-[#1a2332] text-white font-black py-5 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} /> Dirista fariinta...
                </div>
              ) : "Dir Fariinta"}
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM CONTACT CARDS */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Email */}
          <div className="bg-white p-8 rounded-[2rem] flex items-center gap-5 shadow-sm hover:shadow-xl transition-all group">
            <div className="bg-orange-50 text-orange-500 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Email-ka</p>
              <p className="text-slate-800 font-bold">info@tusmo.edu.so</p>
            </div>
          </div>

          {/* Card 2: Phone */}
          <div className="bg-white p-8 rounded-[2rem] flex items-center gap-5 shadow-sm hover:shadow-xl transition-all group">
            <div className="bg-orange-50 text-orange-500 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Phone size={24} />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nala soo xiriir</p>
              <p className="text-slate-800 font-bold">+252 61XXXXXXX</p>
            </div>
          </div>

          {/* Card 3: Address */}
          <div className="bg-white p-8 rounded-[2rem] flex items-center gap-5 shadow-sm hover:shadow-xl transition-all group">
            <div className="bg-orange-50 text-orange-500 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <MapPin size={24} />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Xarunta Dhexe</p>
              <p className="text-slate-800 font-bold">Degmada Hodan, Muqdisho</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}