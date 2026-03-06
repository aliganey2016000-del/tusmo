'use client';

import { useState, useEffect, useCallback } from "react";
import { Class, Teacher, Student } from "@prisma/client";
import { saveAttendance } from "@/app/actions/attendanceActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, UserCheck, Users, GraduationCap, Check, X, Clock, BookOpen } from "lucide-react";

type ClassWithTeachers = Class & {
  teachers: Teacher[];
};

export default function AttendancePage() {
  const [classes, setClasses] = useState<ClassWithTeachers[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [autoSubject, setAutoSubject] = useState<string>(""); // Tani waa maadada si automatic ah u soo bixi doonta
  
  const today = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState<string>(today);
  const [attendanceStatuses, setAttendanceStatuses] = useState<{ [key: string]: string }>({});

  // 1. Soo rari fasallada
  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(data => setClasses(data));
  }, []);

  // 2. Markuu fasalku isbedelo
  const handleClassChange = useCallback(async (classId: string) => {
    setSelectedClassId(classId);
    setSelectedTeacherId(""); 
    setAutoSubject(""); // Nadiifi maadada maadaama macallinkii isbedelay
    if (!classId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/students`); 
      const allStudents: Student[] = await res.json();
      const classStudents = allStudents.filter(s => s.classId === classId);
      setStudents(classStudents);

      const initial: { [key: string]: string } = {};
      classStudents.forEach(s => { initial[s.id] = "Present"; });
      setAttendanceStatuses(initial);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Marka macallinka la doorto - LOGIC-GA CUSUB (Auto-fill Subject)
  const handleTeacherChange = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    
    // Raadi macallinka xogtiisa si aad uga soo saarto maadada (subject)
    const selectedClassData = classes.find(c => c.id === selectedClassId);
    const teacher = selectedClassData?.teachers.find(t => t.id === teacherId);
    
    if (teacher) {
      setAutoSubject(teacher.subject); // Maadada si toos ah u soo saar
    } else {
      setAutoSubject("");
    }
  };

  const handleSave = async () => {
    if (!selectedClassId || !selectedTeacherId || !autoSubject) {
      return alert("Fadlan buuxi dhammaan xogta");
    }

    setIsSubmitting(true);
    const attendanceList = students.map(s => ({
      studentId: s.id,
      classId: selectedClassId,
      teacherId: selectedTeacherId,
      subject: autoSubject,
      status: attendanceStatuses[s.id],
      date: new Date(attendanceDate)
    }));

    const res = await saveAttendance(attendanceList);
    if (res.success) {
      alert(`Imaanshaha casharka ${autoSubject} si guul leh ayaa loo keydiyay!`);
    } else {
      alert("Cillad ayaa dhacday!");
    }
    setIsSubmitting(false);
  };

  const selectedClassData = classes.find(c => c.id === selectedClassId);

  return (
    <div className="p-6 space-y-6 text-left font-bold">
      {/* SELECTION AREA */}
      <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-8">
        <div>
           <h1 className="text-3xl font-black text-slate-800 tracking-tight text-left">Imaanshaha Casharka</h1>
           <p className="text-slate-400 font-medium italic text-left">Maadada si automatic ah ayay u soo baxaysaa markaad macallinka dooratid.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* 1. FASALKA */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 pl-1 font-black">1. Dooro Fasalka</label>
            <select 
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl h-14 px-4 font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
            >
              <option value="">-- Dooro Fasal --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* 2. MACALLINKA */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 pl-1 font-black">2. Macallinka Dhigaya</label>
            <select 
              disabled={!selectedClassId}
              value={selectedTeacherId}
              onChange={(e) => handleTeacherChange(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl h-14 px-4 font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all disabled:opacity-50 cursor-pointer"
            >
              <option value="">-- Dooro Macallinka --</option>
              {selectedClassData?.teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* 3. MAADDADA (AUTO-FILLED) */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 pl-1 font-black">3. Maaddada (Subject)</label>
            <div className="relative">
               <div className="absolute left-4 top-4 text-blue-600">
                  <BookOpen size={20} />
               </div>
               <input 
                 readOnly // Maadaama ay macallinka ku xirantahay, yaan gacanta laga badalin
                 value={autoSubject}
                 placeholder="Auto-filled..."
                 className="w-full bg-blue-50/50 border-none rounded-2xl h-14 pl-12 pr-4 font-black text-blue-700 outline-none"
               />
            </div>
          </div>

          {/* 4. TAARIIKHDA */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 pl-1 font-black">4. Taariikhda</label>
            <input 
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl h-14 px-4 font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* STUDENT LIST TABLE */}
      {selectedClassId && (
        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden text-left">
          {loading ? (
            <div className="py-24 flex flex-col items-center gap-4 text-left font-bold">
               <Loader2 className="animate-spin text-blue-600" size={40} />
               <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Ardayda waa la soo rarayaa...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="py-6 pl-10 text-[10px] uppercase tracking-[0.2em] text-slate-500 text-left font-black">Ardayga</TableHead>
                    <TableHead className="text-center text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Xaaladda (Status)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id} className="hover:bg-slate-50/50 transition-all border-slate-50">
                      <TableCell className="py-6 pl-10 text-left">
                        <div className="flex items-center gap-4 text-left">
                           <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-100">
                             {s.name.charAt(0).toUpperCase()}
                           </div>
                           <div className="flex flex-col text-left">
                              <span className="text-slate-800 text-lg tracking-tight capitalize text-left font-black">{s.name}</span>
                              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest text-left">Student ID: {s.id.slice(-6)}</span>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => setAttendanceStatuses({...attendanceStatuses, [s.id]: "Present"})}
                            className={`h-12 px-6 rounded-2xl flex items-center gap-2 transition-all font-black text-xs uppercase tracking-widest ${attendanceStatuses[s.id] === 'Present' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                          >
                            <Check size={16} /> Jooga
                          </button>
                          
                          <button 
                            onClick={() => setAttendanceStatuses({...attendanceStatuses, [s.id]: "Absent"})}
                            className={`h-12 px-6 rounded-2xl flex items-center gap-2 transition-all font-black text-xs uppercase tracking-widest ${attendanceStatuses[s.id] === 'Absent' ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                          >
                            <X size={16} /> Maqan
                          </button>

                          <button 
                            onClick={() => setAttendanceStatuses({...attendanceStatuses, [s.id]: "Late"})}
                            className={`h-12 px-6 rounded-2xl flex items-center gap-2 transition-all font-black text-xs uppercase tracking-widest ${attendanceStatuses[s.id] === 'Late' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                          >
                            <Clock size={16} /> Daahay
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="p-10 bg-slate-50 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-3 text-slate-500">
                    <Users size={20} />
                    <span className="text-sm font-black uppercase tracking-widest">{students.length} Arday ayaa la calaamadiyay</span>
                 </div>
                 <Button 
                   disabled={isSubmitting || students.length === 0}
                   onClick={handleSave}
                   className="bg-blue-600 hover:bg-blue-700 h-16 px-12 rounded-[1.5rem] font-black text-xl shadow-xl shadow-blue-100 transition-all active:scale-95"
                 >
                   {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <UserCheck className="mr-2" />}
                   Keydi Imaanshaha {autoSubject}
                 </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* EMPTY STATE */}
      {!selectedClassId && (
        <div className="py-40 flex flex-col items-center gap-6 text-slate-300 font-bold border-4 border-dashed rounded-[4rem] border-slate-100 text-left">
          <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center">
             <GraduationCap size={50} />
          </div>
          <div className="text-center space-y-1">
             <p className="text-2xl text-slate-400 font-black tracking-tight">Fadlan marka hore dooro fasalka.</p>
             <p className="text-sm font-medium text-slate-300">Nidaamku wuxuu si automatic ah u soo saari doonaa macallinka iyo maadada.</p>
          </div>
        </div>
      )}
    </div>
  );
}