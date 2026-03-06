'use client';

import { useState, useEffect, useCallback } from "react";
import { Student, Class } from "@prisma/client";
import {
    addStudent,
    deleteStudent,
    updateStudent,
    approveStudent,
    rejectStudent,
    autoRejectOldStudents
} from "@/app/actions/studentActions";
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
import { Search, Trash2, UserPlus, Pencil, Phone, UserCircle, X, Loader2, Mail, Smartphone, School } from "lucide-react";

// 1. QEEX TYPE CUSUB: Si looga fogaado 'any'
type StudentWithClass = Student & {
    class?: Class | null;
};

export default function StudentsPage() {
    // 2. ISTICMAAL TYPE-KA CUSUB:
    const [students, setStudents] = useState<StudentWithClass[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

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

    const fetchClasses = useCallback(async () => {
        try {
            const response = await fetch('/api/classes');
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    }, []);

    useEffect(() => {
        const initializePage = async () => {
            await autoRejectOldStudents();
            fetchStudents();
            fetchClasses();
        };
        initializePage();
    }, [fetchStudents, fetchClasses]);

    const handleDelete = async (id: string) => {
        if (confirm("Ma hubtaa inaad tirtirto ardaygan?")) {
            await deleteStudent(id);
            fetchStudents();
        }
    };

    // --- FORM COMPONENT ---
    const StudentFormFields = ({ student }: { student?: StudentWithClass }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 text-left">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Magaca Ardayga</Label>
                <Input name="name" defaultValue={student?.name} placeholder="Cali Axmed" required className="rounded-xl h-12 bg-slate-50 border-none" />
            </div>
            <div className="space-y-1.5 text-left">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Email-ka</Label>
                <Input name="email" type="email" defaultValue={student?.email} placeholder="ali@gmail.com" required className="rounded-xl h-12 bg-slate-50 border-none" />
            </div>
            
            <div className="space-y-1.5 text-left">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Dooro Fasalka</Label>
                <select 
                    name="classId" 
                    defaultValue={student?.classId || ""} 
                    required 
                    className="w-full border-none rounded-xl p-3 text-sm bg-slate-50 h-12 font-medium outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                >
                    <option value="">-- Dooro Fasal --</option>
                    {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name} ({c.room})
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-1.5 text-left">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Gender</Label>
                <select name="gender" defaultValue={student?.gender || "Male"} className="w-full border-none rounded-xl p-3 text-sm bg-slate-50 h-12 font-medium outline-none">
                    <option value="Male">Lab (Male)</option>
                    <option value="Female">Dhedig (Female)</option>
                </select>
            </div>
            <div className="space-y-1.5 text-left">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Taleefanka Ardayga</Label>
                <Input name="phone" defaultValue={student?.phone || ""} placeholder="61XXXXXXX" className="rounded-xl h-12 bg-slate-50 border-none" />
            </div>
            <div className="space-y-1.5 text-left">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Magaca Waalidka</Label>
                <Input name="parentName" defaultValue={student?.parentName || ""} placeholder="Magaca waalidka" className="rounded-xl h-12 bg-slate-50 border-none" />
            </div>
            <div className="space-y-1.5 text-left">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Taleefanka Waalidka</Label>
                <Input name="parentPhone" defaultValue={student?.parentPhone || ""} placeholder="61XXXXXXX" className="rounded-xl h-12 bg-slate-50 border-none" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] border shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight text-left">Maamulka Ardayda</h1>
                    <p className="text-slate-500 text-sm italic text-left">
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
                        <DialogContent className="rounded-[2rem] max-w-2xl border-none shadow-2xl overflow-hidden text-left">
                            <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b text-left">
                                <DialogTitle className="text-2xl font-black text-slate-800 text-left">Diiwaangeli Arday Cusub</DialogTitle>
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
                                <StudentFormFields />
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
                    <div className="py-24 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="font-bold text-slate-400">Ardayda waa la soo rarayaa...</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-slate-50/80 backdrop-blur-sm border-b">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-black text-slate-800 py-6 pl-10 uppercase tracking-widest text-[10px] text-left">Ardayga / Email</TableHead>
                                <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[10px] text-left">Waalidka</TableHead>
                                <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[10px] text-left">Taleefannada</TableHead>
                                <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[10px] text-left">Status</TableHead>
                                <TableHead className="text-right font-black text-slate-800 pr-10 uppercase tracking-widest text-[10px]">Tallaabo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* 3. HADDA MAP-KU WUXUU GARANAYAA STUDENT-KA (Ma jiro 'any') */}
                            {students.map((student) => (
                                <TableRow key={student.id} className="hover:bg-slate-50/50 transition-all border-slate-100">
                                    <TableCell className="py-6 pl-10">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-lg shadow-blue-100 text-lg shrink-0">
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
                                        <div className="flex flex-col gap-1 text-left">
                                            <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <UserCircle size={16} className="text-slate-400" /> {student.parentName || "N/A"}
                                            </p>
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 rounded-lg font-black px-2 py-0.5 w-fit text-[9px] flex items-center gap-1">
                                                <School size={10} /> {student.class?.name || student.grade}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-left">
                                        <div className="flex flex-col gap-1.5 text-left">
                                            <p className="text-[11px] text-slate-600 font-bold flex items-center gap-2">
                                                <Smartphone size={12} className="text-blue-500" /> <span className="text-slate-400 mr-1">Std:</span> {student.phone || "N/A"}
                                            </p>
                                            <p className="text-[11px] text-slate-600 font-bold flex items-center gap-2">
                                                <Phone size={12} className="text-emerald-500" /> <span className="text-slate-400 mr-1">Prnt:</span> {student.parentPhone || "N/A"}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-left">
                                        <div className="flex items-center gap-2 text-left">
                                            <div className={`w-2 h-2 rounded-full ${student.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                            <span className={`font-black text-xs uppercase tracking-widest ${student.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {student.status}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right pr-8">
                                        <div className="flex justify-end items-center gap-2">
                                            {student.status === "Pending" && (
                                                <>
                                                    <Button
                                                        onClick={async () => {
                                                            if (confirm(`Ma hubtaa inaad ansixiso ${student.name}?`)) {
                                                                await approveStudent(student.id);
                                                                fetchStudents();
                                                            }
                                                        }}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 text-[11px] font-black uppercase rounded-xl shadow-lg transition-all"
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        onClick={async () => {
                                                            const reason = prompt(`Maxaad u diidaysaa ${student.name}? Fadlan qor sababta:`);
                                                            if (reason) {
                                                                await rejectStudent(student.id, reason);
                                                                fetchStudents();
                                                            }
                                                        }}
                                                        className="bg-rose-500 hover:bg-rose-600 text-white h-9 px-4 text-[11px] font-black uppercase rounded-xl shadow-lg transition-all"
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}

                                            <div className="flex gap-1 ml-2 border-l pl-2 border-slate-100">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="w-10 h-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                                                            <Pencil size={18} />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="rounded-[2rem] max-w-2xl border-none shadow-2xl overflow-hidden text-left">
                                                        <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b text-left">
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
                                                            <StudentFormFields student={student} />
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
                                                    className="w-10 h-10 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}