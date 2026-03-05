'use client';

import { useState, useEffect, useCallback } from "react";
import { Student } from "@prisma/client";
import { addStudent, deleteStudent, updateStudent } from "@/app/actions/studentActions";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, UserPlus, Pencil, Users, Phone, UserCircle, X, Loader2, Mail } from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // 1. Fetch Students
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/students?query=${query}`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // 2. Delete Student
  const handleDelete = async (id: string) => {
    if (confirm("Ma hubtaa inaad tirtirto ardaygan?")) {
      await deleteStudent(id);
      fetchStudents();
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] border shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Maamulka Ardayda</h1>
          <p className="text-slate-500 text-sm italic">
            {loading ? "Wali waa la rarayaa..." : `Wali waxaa diwaangashan ${students.length} arday.`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 flex items-center gap-2">
            <div className="relative w-full">
               <Search className="absolute left-3 top-3 text-slate-400" size={18} />
               <Input 
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 placeholder="Raadi arday..." 
                 className="pl-10 rounded-full bg-slate-50 border-none h-12 w-full focus-visible:ring-blue-600" 
               />
            </div>
            {query && (
              <button onClick={() => setQuery("")} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                <X size={18} />
              </button>
            )}
          </div>
          
          {/* ADD STUDENT MODAL */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-700 hover:bg-blue-800 rounded-full flex gap-2 h-12 px-6 font-bold shadow-lg shadow-blue-100">
                <UserPlus size={18} /> Ku dar Arday
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2rem] max-w-2xl border-none shadow-2xl overflow-hidden">
              <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b">
                <DialogTitle className="text-2xl font-black text-slate-800 text-left">Diiwaangeli Arday Cusub</DialogTitle>
                <p className="text-slate-500 text-sm text-left italic">Fadlan geli xogta saxda ah ee ardayga (Dhammaan Fields-ka waa muhiim).</p>
              </DialogHeader>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  await addStudent(formData);
                  setIsAddOpen(false);
                  fetchStudents();
                }} 
                className="space-y-4 pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 text-left">
                    <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Magaca Ardayga</Label>
                    <Input name="name" placeholder="Cali Axmed" required className="rounded-xl h-12 bg-slate-50 border-none" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Email-ka</Label>
                    <Input name="email" type="email" placeholder="ali@gmail.com" required className="rounded-xl h-12 bg-slate-50 border-none" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Fasalka (Grade)</Label>
                    <Input name="grade" placeholder="Grade 10" required className="rounded-xl h-12 bg-slate-50 border-none" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Gender</Label>
                    <select name="gender" className="w-full border-none rounded-xl p-3 text-sm bg-slate-50 h-12 font-medium outline-none focus:ring-2 focus:ring-blue-600 transition-all">
                      <option value="Male">Lab (Male)</option>
                      <option value="Female">Dhedig (Female)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Telefoonka Ardayga</Label>
                    <Input name="phone" placeholder="61XXXXXXX" className="rounded-xl h-12 bg-slate-50 border-none" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Magaca Waalidka</Label>
                    <Input name="parentName" placeholder="Magaca waalidka" className="rounded-xl h-12 bg-slate-50 border-none" />
                  </div>
                  <div className="space-y-1.5 text-left md:col-span-2">
                    <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Telefoonka Waalidka</Label>
                    <Input name="parentPhone" placeholder="61XXXXXXX" className="rounded-xl h-12 bg-slate-50 border-none" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 h-14 rounded-xl font-black text-lg mt-4 shadow-xl shadow-blue-100 transition-all active:scale-[0.98]">
                   Keydi Ardayga
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="font-bold text-slate-400">Ardayda waa la soo rarayaa...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/80 backdrop-blur-sm border-b">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-black text-slate-800 py-6 pl-10 uppercase tracking-widest text-[10px]">Ardayga</TableHead>
                <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Xiriirka Waalidka</TableHead>
                <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Xogta Kale</TableHead>
                <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead className="text-right font-black text-slate-800 pr-10 uppercase tracking-widest text-[10px]">Tallaabo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="hover:bg-slate-50/50 transition-all border-slate-100">
                  <TableCell className="py-6 pl-10">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-lg shadow-blue-100 text-lg shrink-0">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="font-black text-slate-800 capitalize text-base tracking-tight mb-1">{student.name}</p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1.5 tracking-wider">
                          <Mail size={12} className="text-blue-500" /> {student.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <UserCircle size={16} className="text-slate-400" /> {student.parentName || "N/A"}
                      </p>
                      <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 pl-6 tracking-wider">
                        <Phone size={10} className="text-slate-400" /> {student.parentPhone || "No contact"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 rounded-lg font-black px-3 py-1 w-fit text-[10px]">
                        {student.grade.toUpperCase()}
                      </Badge>
                      <p className="text-[10px] text-slate-400 font-bold uppercase pl-1">{student.gender}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${student.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                        <span className={`font-black text-xs uppercase tracking-widest ${student.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {student.status}
                        </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                      {/* EDIT MODAL */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-10 h-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <Pencil size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2rem] max-w-2xl border-none shadow-2xl overflow-hidden">
                          <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b">
                            <DialogTitle className="text-2xl font-black text-slate-800 text-left tracking-tight">Cusboonaysii Xogta</DialogTitle>
                            <p className="text-slate-500 text-sm text-left italic">Wax ka baddal xogta ardayga: {student.name}</p>
                          </DialogHeader>
                          <form 
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const formData = new FormData(e.currentTarget);
                              await updateStudent(formData);
                              fetchStudents();
                            }} 
                            className="space-y-4 pt-4 text-left"
                          >
                            <input type="hidden" name="id" value={student.id} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="space-y-1.5">
                                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase tracking-wider">Magaca Ardayga</Label>
                                <Input name="name" defaultValue={student.name} required className="rounded-xl h-12 bg-slate-50 border-none" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase tracking-wider">Email-ka</Label>
                                <Input name="email" type="email" defaultValue={student.email} required className="rounded-xl h-12 bg-slate-50 border-none" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase tracking-wider">Fasalka</Label>
                                <Input name="grade" defaultValue={student.grade} required className="rounded-xl h-12 bg-slate-50 border-none" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase tracking-wider">Gender</Label>
                                <select name="gender" defaultValue={student.gender} className="w-full border-none rounded-xl p-3 text-sm bg-slate-50 h-12 font-medium outline-none">
                                  <option value="Male">Lab (Male)</option>
                                  <option value="Female">Dhedig (Female)</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase tracking-wider">Magaca Waalidka</Label>
                                <Input name="parentName" defaultValue={student.parentName || ""} className="rounded-xl h-12 bg-slate-50 border-none" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase tracking-wider">Telefoonka Waalidka</Label>
                                <Input name="parentPhone" defaultValue={student.parentPhone || ""} className="rounded-xl h-12 bg-slate-50 border-none" />
                              </div>
                            </div>
                            <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 h-14 rounded-xl font-black text-lg mt-4 shadow-lg shadow-blue-50 transition-all active:scale-[0.98]">
                               Badal Xogta
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        onClick={() => handleDelete(student.id)} 
                        variant="ghost" 
                        size="icon" 
                        className="w-10 h-10 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-40 text-slate-400">
                     <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center">
                           <Users size={48} className="text-slate-200" />
                        </div>
                        <p className="font-black text-slate-800 text-xl tracking-tight">Ma jiraan arday la helay</p>
                        <p className="text-sm font-medium">Isku day inaad raadiso magac kale ama ku dar arday cusub.</p>
                     </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}