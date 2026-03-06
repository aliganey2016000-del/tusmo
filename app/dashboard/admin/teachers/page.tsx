'use client';

import { useState, useEffect, useCallback } from "react";
import { Teacher } from "@prisma/client";
import { addTeacher, updateTeacher, deleteTeacher } from "@/app/actions/teacherActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GraduationCap, Mail, Phone, BookOpen, Trash2, Pencil, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // 1. Soo helidda Macallimiinta (Fetch)
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/teachers'); // Hubi in API-gan uu jiro
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // --- FORM FIELDS (Reusable) ---
  const TeacherForm = ({ teacher }: { teacher?: Teacher }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="space-y-1.5 text-left">
        <Label className="font-bold text-xs uppercase">Magaca Macallinka</Label>
        <Input name="name" defaultValue={teacher?.name} required className="rounded-xl h-12 bg-slate-50 border-none" />
      </div>
      <div className="space-y-1.5 text-left">
        <Label className="font-bold text-xs uppercase">Email-ka</Label>
        <Input name="email" type="email" defaultValue={teacher?.email} required className="rounded-xl h-12 bg-slate-50 border-none" />
      </div>
      <div className="space-y-1.5 text-left">
        <Label className="font-bold text-xs uppercase">Maadada (Subject)</Label>
        <Input name="subject" defaultValue={teacher?.subject} required className="rounded-xl h-12 bg-slate-50 border-none" />
      </div>
      <div className="space-y-1.5 text-left">
        <Label className="font-bold text-xs uppercase">Taleefanka</Label>
        <Input name="phone" defaultValue={teacher?.phone} required className="rounded-xl h-12 bg-slate-50 border-none" />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 text-left">
      {/* HEADER SECTION */}
      <div className="bg-white p-8 rounded-[2rem] border shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Maamulka Macallimiinta</h1>
          <p className="text-slate-500 text-sm italic">Waxaa kuu diwaangashan {teachers.length} macallin.</p>
        </div>

        {/* ADD TEACHER BUTTON */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full h-12 px-6 font-bold flex gap-2">
              <Plus size={18} /> Ku dar Macallin
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2rem] max-w-2xl border-none shadow-2xl overflow-hidden">
            <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b">
              <DialogTitle className="text-2xl font-black text-slate-800 text-left">Diiwaangeli Macallin</DialogTitle>
            </DialogHeader>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await addTeacher(new FormData(e.currentTarget));
              setIsAddOpen(false);
              fetchTeachers();
            }} className="space-y-4 pt-4">
              <TeacherForm />
              <Button type="submit" className="w-full bg-blue-600 h-14 rounded-xl font-black text-lg">Keydi Macallinka</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden font-bold">
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" />
            <p className="text-slate-400">Waa la rarayaa...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black py-5 pl-10 text-[10px] uppercase tracking-widest text-slate-800 text-left">Macallinka</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-800 text-left">Maadada</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-800 text-left">Xiriirka</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-800 text-left">Status</TableHead>
                <TableHead className="text-right pr-10 font-black text-[10px] uppercase tracking-widest text-slate-800">Tallaabo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((t) => (
                <TableRow key={t.id} className="hover:bg-slate-50/50 transition-all border-slate-100">
                  <TableCell className="py-6 pl-10 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 capitalize text-sm">{t.name}</span>
                        <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 mt-0.5"><Mail size={12} /> {t.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-slate-300" />
                      <span className="text-slate-600 text-sm uppercase">{t.subject}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-emerald-500" />
                      <span className="text-xs text-slate-500">{t.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase">
                      {t.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-10">
                    <div className="flex justify-end items-center gap-2">
                      {/* EDIT DIALOG */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                            <Pencil size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2rem] max-w-2xl border-none shadow-2xl overflow-hidden text-left">
                          <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b">
                            <DialogTitle className="text-2xl font-black text-slate-800">Cusboonaysii Xogta</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={async (e) => {
                            e.preventDefault();
                            await updateTeacher(new FormData(e.currentTarget));
                            fetchTeachers();
                          }} className="space-y-4 pt-4">
                            <input type="hidden" name="id" value={t.id} />
                            <TeacherForm teacher={t} />
                            <Button type="submit" className="w-full bg-blue-600 h-14 rounded-xl font-black text-lg">Badal Xogta</Button>
                          </form>
                        </DialogContent>
                      </Dialog>

                      {/* DELETE BUTTON */}
                      <Button onClick={async () => {
                        if (confirm(`Ma hubtaa inaad tirtirto ${t.name}?`)) {
                          await deleteTeacher(t.id);
                          fetchTeachers();
                        }
                      }} variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {teachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-40">
                    <div className="flex flex-col items-center gap-4 text-slate-300 font-bold">
                      <GraduationCap size={60} />
                      <p className="text-xl tracking-tight">Wali wax macallimiin ah lama helin.</p>
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