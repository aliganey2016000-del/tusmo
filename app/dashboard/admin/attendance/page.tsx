'use client';

import { useState, useEffect, useCallback } from "react";
import { Class, Teacher, Student } from "@prisma/client";
import { saveAttendance } from "@/app/actions/attendanceActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, UserCheck, Users, GraduationCap, Check, X, Clock, BookOpen, Lock } from "lucide-react";

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
  const [autoSubject, setAutoSubject] = useState<string>("");
  const [isAlreadyRecorded, setIsAlreadyRecorded] = useState(false); // LOCKING STATE
  
  const today = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState<string>(today);
  const [attendanceStatuses, setAttendanceStatuses] = useState<{ [key: string]: string }>({});

  // 1. Soo rari fasallada
  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(data => setClasses(data));
  }, []);

  // 2. Function-ka hubinaya haddii xogtaan hore loo keydiyay (LOCK LOGIC)
  const checkExistingAttendance = useCallback(async () => {
    if (selectedClassId && selectedTeacherId && autoSubject && attendanceDate) {
      try {
        const res = await fetch(`/api/attendance/check?classId=${selectedClassId}&teacherId=${selectedTeacherId}&subject=${autoSubject}&date=${attendanceDate}`);
        const data = await res.json();
        setIsAlreadyRecorded(data.exists);
      } catch (error) {
        console.error("Baaritaanka xogta waa fashilmay:", error);
      }
    }
  }, [selectedClassId, selectedTeacherId, autoSubject, attendanceDate]);

  // 3. Markasta oo xogtu isbedesho, hubi haddii la keydiyay
  useEffect(() => {
    checkExistingAttendance();
  }, [checkExistingAttendance]);

  // 4. Markuu fasalku isbedelo
  const handleClassChange = useCallback(async (classId: string) => {
    setSelectedClassId(classId);
    setSelectedTeacherId(""); 
    setAutoSubject(""); 
    setIsAlreadyRecorded(false);
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

  // 5. Marka macallinka la doorto
  const handleTeacherChange = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    const selectedClassData = classes.find(c => c.id === selectedClassId);
    const teacher = selectedClassData?.teachers.find(t => t.id === teacherId);
    if (teacher) {
      setAutoSubject(teacher.subject);
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
      alert(`Imaanshaha casharka ${autoSubject} waa la keydiyay!`);
      setIsAlreadyRecorded(true); // Isla markiiba quful (Lock)
    } else {
      alert("Cillad ayaa dhacday!");
    }
    setIsSubmitting(false);
  };

  const selectedClassData = classes.find(c => c.id === selectedClassId);

  return (
    <div className="p-6 space-y-6 text-left font-bold">
      <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-8">
        <div className="flex justify-between items-start">
           <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Imaanshaha Casharka</h1>
              <p className="text-slate-400 font-medium italic">Maareynta xaadiriska maalinlaha ah.</p>
           </div>
           {isAlreadyRecorded && (
             <div className="bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl flex items-center gap-2 border border-rose-100 animate-in fade-in zoom-in duration-300">
                <Lock size={18} />
                <span className="text-sm font-black uppercase tracking-widest">Xogta Casharkan waa la xiray</span>
             </div>
           )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* FASALKA */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 pl-1 font-black">1. Dooro Fasalka</label>
            <select 
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl h-14 px-4 font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">-- Dooro Fasal --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* MACALLINKA */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 pl-1 font-black">2. Macallinka Dhigaya</label>
            <select 
              disabled={!selectedClassId}
              value={selectedTeacherId}
              onChange={(e) => handleTeacherChange(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl h-14 px-4 font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">-- Dooro Macallinka --</option>
              {selectedClassData?.teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* MAADDADA */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 pl-1 font-black">3. Maaddada (Subject)</label>
            <div className="relative">
               <BookOpen className="absolute left-4 top-4 text-blue-600" size={20} />
               <input 
                 readOnly 
                 value={autoSubject}
                 placeholder="Auto-filled..."
                 className="w-full bg-blue-50/50 border-none rounded-2xl h-14 pl-12 font-black text-blue-700"
               />
            </div>
          </div>

          {/* TAARIIKHDA */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 pl-1 font-black">4. Taariikhda</label>
            <input 
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl h-14 px-4 font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {selectedClassId && (
        <div className={`bg-white rounded-[2.5rem] border shadow-sm overflow-hidden transition-opacity duration-300 ${isAlreadyRecorded ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
          {loading ? (
            <div className="py-24 flex flex-col items-center gap-4 text-left">
               <Loader2 className="animate-spin text-blue-600" size={40} />
               <p className="text-slate-400 font-black uppercase text-xs">Ardayda waa la soo rarayaa...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="py-6 pl-10 text-[10px] uppercase text-slate-500 font-black text-left">Ardayga</TableHead>
                    <TableHead className="text-center text-[10px] uppercase text-slate-500 font-black">Mark Attendance (Status)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id} className="border-slate-50">
                      <TableCell className="py-6 pl-10 text-left">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg">
                             {s.name.charAt(0).toUpperCase()}
                           </div>
                           <div className="flex flex-col text-left">
                              <span className="text-slate-800 text-lg font-black">{s.name}</span>
                              <span className="text-[10px] text-slate-400 uppercase font-bold">ID: {s.id.slice(-6)}</span>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => setAttendanceStatuses({...attendanceStatuses, [s.id]: "Present"})}
                            className={`h-12 px-6 rounded-2xl flex items-center gap-2 transition-all font-black text-xs uppercase ${attendanceStatuses[s.id] === 'Present' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                          >
                            <Check size={16} /> Jooga
                          </button>
                          
                          <button 
                            onClick={() => setAttendanceStatuses({...attendanceStatuses, [s.id]: "Absent"})}
                            className={`h-12 px-6 rounded-2xl flex items-center gap-2 transition-all font-black text-xs uppercase ${attendanceStatuses[s.id] === 'Absent' ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                          >
                            <X size={16} /> Maqan
                          </button>

                          <button 
                            onClick={() => setAttendanceStatuses({...attendanceStatuses, [s.id]: "Late"})}
                            className={`h-12 px-6 rounded-2xl flex items-center gap-2 transition-all font-black text-xs uppercase ${attendanceStatuses[s.id] === 'Late' ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
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
                 <div className="flex items-center gap-3 text-slate-500 font-black uppercase text-sm tracking-widest">
                    <Users size={20} />
                    <span>{students.length} Arday wadarta guud</span>
                 </div>
                 <Button 
                   disabled={isSubmitting || students.length === 0 || isAlreadyRecorded}
                   onClick={handleSave}
                   className={`h-16 px-12 rounded-[1.5rem] font-black text-xl shadow-xl transition-all active:scale-95 ${isAlreadyRecorded ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
                 >
                   {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : isAlreadyRecorded ? <Lock className="mr-2" /> : <UserCheck className="mr-2" />}
                   {isAlreadyRecorded ? "Xogta waa la xiray (Saved)" : `Keydi Imaanshaha ${autoSubject}`}
                 </Button>
              </div>
            </>
          )}
        </div>
      )}

      {!selectedClassId && (
        <div className="py-40 flex flex-col items-center gap-6 text-slate-300 border-4 border-dashed rounded-[4rem] border-slate-100">
          <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center">
             <GraduationCap size={50} />
          </div>
          <p className="text-2xl font-black tracking-tight text-slate-400">Fadlan marka hore dooro fasalka.</p>
        </div>
      )}
    </div>
  );
}