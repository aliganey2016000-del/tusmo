'use client';

import { useState, useEffect, useCallback } from "react";
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
import { Search, Trash2, UserPlus, Pencil, Users, Phone, UserCircle, X, Loader2 } from "lucide-react";
import Link from "next/link";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // 1. Shaqada xogta soo akhrinaysa (Fetch Data)
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

  // 2. Shaqada tirtirista (Delete)
  const handleDelete = async (id: string) => {
    if (confirm("Ma hubtaa inaad tirtirto ardaygan?")) {
      await deleteStudent(id);
      fetchStudents();
    }
  };

  return (
    <div className="space-y-6">
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
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-700 hover:bg-blue-800 rounded-full flex gap-2 h-12 px-6 font-bold shadow-lg shadow-blue-100">
                <UserPlus size={18} /> Ku dar Arday
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2rem] max-w-2xl border-none shadow-2xl overflow-hidden">
              <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b">
                <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight text-left">Diiwaangeli Arday Cusub</DialogTitle>
                <p className="text-slate-500 text-sm text-left">Fadlan geli xogta saxda ah ee ardayga iyo waalidkiisa.</p>
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
                    <Label className="pl-1 font-bold text-slate-700">Magaca oo Buuxa</Label>
                    <Input name="name" placeholder="Tusaale: Cali Axmed" required className="rounded-xl h-12 bg-slate-50 border-none focus:bg-white" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label className="pl-1 font-bold text-slate-700">Email-ka</Label>
                    <Input name="email" type="email" placeholder="ali@gmail.com" required className="rounded-xl h-12 bg-slate-50 border-none focus:bg-white" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label className="pl-1 font-bold text-slate-700">Fasalka (Grade)</Label>
                    <Input name="grade" placeholder="Tusaale: 10" required className="rounded-xl h-12 bg-slate-50 border-none focus:bg-white" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label className="pl-1 font-bold text-slate-700">Gender</Label>
                    <select name="gender" className="w-full border-none rounded-xl p-3 text-sm bg-slate-50 h-12 font-medium outline-none">
                      <option value="Male">Lab (Male)</option>
                      <option value="Female">Dhedig (Female)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label className="pl-1 font-bold text-slate-700">Telefoonka Ardayga</Label>
                    <Input name="phone" placeholder="61XXXXXXX" className="rounded-xl h-12 bg-slate-50 border-none" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label className="pl-1 font-bold text-slate-700">Magaca Waalidka</Label>
                    <Input name="parentName" placeholder="Magaca waalidka" className="rounded-xl h-12 bg-slate-50 border-none" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 h-14 rounded-xl font-black text-lg mt-4">
                   Keydi Ardayga
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="font-bold text-slate-400">Ardayda waa la soo rarayaa...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="font-black text-slate-800 py-6 pl-10 uppercase text-[10px]">Ardayga</TableHead>
                <TableHead className="font-black text-slate-800 uppercase text-[10px]">Xiriirka Waalidka</TableHead>
                <TableHead className="font-black text-slate-800 uppercase text-[10px]">Fasalka</TableHead>
                <TableHead className="font-black text-slate-800 uppercase text-[10px]">Status</TableHead>
                <TableHead className="text-right font-black text-slate-800 pr-10 uppercase text-[10px]">Tallaabo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="hover:bg-slate-50/50 border-slate-100">
                  <TableCell className="py-6 pl-10">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-lg shadow-blue-100 text-lg">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="font-black text-slate-800 capitalize text-base tracking-tight mb-1">{student.name}</p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1.5 tracking-wider">
                          <Phone size={12} className="text-blue-500" /> {student.phone || "No Phone"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <UserCircle size={16} className="text-slate-400" /> {student.parentName || "Unknown"}
                      </p>
                      <p className="text-[11px] text-slate-500 font-bold pl-6">{student.parentPhone || "No contact"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 rounded-lg font-black px-3 py-1">
                        GRADE {student.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Active</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-10 h-10 text-slate-400 hover:text-blue-600 rounded-xl">
                            <Pencil size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2rem] max-w-2xl border-none">
                          <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b">
                            <DialogTitle className="text-2xl font-black text-slate-800 text-left">Cusboonaysii Xogta</DialogTitle>
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
                                <Label className="pl-1 font-bold text-slate-700">Magaca oo Buuxa</Label>
                                <Input name="name" defaultValue={student.name} required className="rounded-xl h-12 bg-slate-50 border-none" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="pl-1 font-bold text-slate-700">Email-ka</Label>
                                <Input name="email" type="email" defaultValue={student.email} required className="rounded-xl h-12 bg-slate-50 border-none" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="pl-1 font-bold text-slate-700">Fasalka</Label>
                                <Input name="grade" defaultValue={student.grade} required className="rounded-xl h-12 bg-slate-50 border-none" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="pl-1 font-bold text-slate-700">Telefoonka</Label>
                                <Input name="phone" defaultValue={student.phone || ""} className="rounded-xl h-12 bg-slate-50 border-none" />
                              </div>
                            </div>
                            <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 h-14 rounded-xl font-black text-lg mt-4">
                               Badal Xogta
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        onClick={() => handleDelete(student.id)} 
                        variant="ghost" 
                        size="icon" 
                        className="w-10 h-10 text-slate-400 hover:text-rose-600 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-32 text-slate-400">
                     <div className="flex flex-col items-center gap-4">
                        <Users size={48} className="text-slate-200" />
                        <p className="font-black text-slate-800 text-xl">Ma jiraan arday la helay</p>
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