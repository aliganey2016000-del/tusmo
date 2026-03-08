"use client";

import { useState, useEffect } from "react";
// Ka saar ChevronsUpDown halkan:
import { Check, School, Users } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";

interface ClassOption {
  id: string;
  name: string;
  shift: string;
  capacity: number;
  _count: { students: number };
}

export default function SelectClass({ onSelect }: { onSelect: (id: string) => void }) {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    // Hubi in API-gan uu jiro, haddii kale u beddel kan aad haysato
    fetch('/api/classes/all') 
      .then(res => res.json())
      .then(data => {
        setClasses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-20 w-full bg-slate-50 animate-pulse rounded-2xl border border-dashed border-slate-200" />;

  return (
    <div className="space-y-3 text-left">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
        Dooro Fasalka Ardayga
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {classes.map((cls) => {
          const currentCount = cls._count?.students || 0;
          const isFull = currentCount >= cls.capacity;
          const isSelected = selectedId === cls.id;

          return (
            <div 
              key={cls.id}
              onClick={() => {
                if (!isFull) {
                  setSelectedId(cls.id);
                  onSelect(cls.id);
                }
              }}
              className={`
                relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2
                ${isSelected ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'}
                ${isFull ? 'opacity-50 cursor-not-allowed grayscale bg-slate-50' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <School size={16} />
                  </div>
                  <span className="font-black text-slate-800 uppercase text-sm tracking-tight">{cls.name}</span>
                </div>
                {isSelected && <Check size={18} className="text-blue-600" />}
              </div>

              <div className="flex items-center justify-between mt-2 font-black">
                <Badge variant="outline" className="text-[8px] uppercase font-black border-slate-200">
                  {cls.shift}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-500">
                  <Users size={12} className="text-blue-500" />
                  <span className={isFull ? "text-rose-600" : "text-slate-700"}>
                    {currentCount}/{cls.capacity}
                  </span>
                </div>
              </div>

              {/* Progress Bar yar */}
              <div className="w-full h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${isFull ? 'bg-rose-500' : 'bg-blue-500'}`} 
                  style={{ width: `${(currentCount / (cls.capacity || 1)) * 100}%` }}
                />
              </div>
              
              {isFull && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black shadow-lg">
                  BUUXA
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* Hidden input si FormData ay u hesho classId */}
      <input type="hidden" name="classId" value={selectedId} required />
    </div>
  );
}