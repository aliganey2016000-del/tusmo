'use client';

import { useState, useEffect, useCallback } from "react";
import { Student, Class } from "@prisma/client";
import {
    addStudent,
    deleteStudent,
    updateStudent,
    approveStudent,
    rejectStudent,
    autoRejectOldStudents,
    toggleStudentStatus
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
import { Search, Trash2, UserPlus, Pencil, Phone, UserCircle, X, Loader2, Mail, Smartphone, School, UserX, UserCheck } from "lucide-react";

type StudentWithClass = Student & {
    class?: Class | null;
};

export default function StudentsPage() {
    const [students, setStudents] = useState<StudentWithClass[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    // 1. Logic-ga raadinta (Debounced Search) si aaney DB-ga u culaysin
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStudents(query);
        }, 500); // Sug badh ilbiriqsi ka hor intaanan DB la weydiin
        return () => clearTimeout(timer);
    }, [query]);

    const fetchStudents = async (searchQuery: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/students?query=${searchQuery}`);
            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = useCallback(async () => {
        try {
            const response = await fetch('/api/classes');
            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    }, []);

    // 2. Initial load oo sequential ah (Mid-mid) si looga fogaado Pool Timeout
    useEffect(() => {
        const initializePage = async () => {
            await autoRejectOldStudents(); // Kan ayaa marka hore dhacaya
            await fetchClasses();         // Marka xigta fasallada
            await fetchStudents("");      // Ugu dambeyn ardayda
        };
        initializePage();
    }, [fetchClasses]);

    const handleDelete = async (id: string) => {
        if (confirm("Ma hubtaa inaad tirtirto ardaygan?")) {
            await deleteStudent(id);
            fetchStudents(query);
        }
    };

    const StudentFormFields = ({ student }: { student?: StudentWithClass }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div className="space-y-1.5">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Magaca Ardayga</Label>
                <Input name="name" defaultValue={student?.name} placeholder="Cali Axmed" required className="rounded-xl h-12 bg-slate-50 border-none w-full font-bold" />
            </div>
            <div className="space-y-1.5">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Email-ka</Label>
                <Input name="email" type="email" defaultValue={student?.email} placeholder="ali@gmail.com" required className="rounded-xl h-12 bg-slate-50 border-none w-full font-bold" />
            </div>
            
            <div className="space-y-1.5">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Dooro Fasalka</Label>
                <select 
                    name="classId" 
                    defaultValue={student?.classId || ""} 
                    required 
                    className="w-full border-none rounded-xl p-3 text-sm bg-slate-50 h-12 font-bold outline-none focus:ring-2 focus:ring-blue-600"
                >
                    <option value="">-- Dooro Fasal --</option>
                    {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name} ({c.room})
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-1.5">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Gender</Label>
                <select name="gender" defaultValue={student?.gender || "Male"} className="w-full border-none rounded-xl p-3 text-sm bg-slate-50 h-12 font-bold outline-none">
                    <option value="Male">Lab (Male)</option>
                    <option value="Female">Dhedig (Female)</option>
                </select>
            </div>
            <div className="space-y-1.5">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Taleefanka Ardayga</Label>
                <Input name="phone" defaultValue={student?.phone || ""} placeholder="61XXXXXXX" className="rounded-xl h-12 bg-slate-50 border-none w-full font-bold" />
            </div>
            <div className="space-y-1.5">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Magaca Waalidka</Label>
                <Input name="parentName" defaultValue={student?.parentName || ""} placeholder="Magaca waalidka" className="rounded-xl h-12 bg-slate-50 border-none w-full font-bold" />
            </div>
            <div className="space-y-1.5">
                <Label className="pl-1 font-bold text-slate-700 text-xs uppercase">Taleefanka Waalidka</Label>
                <Input name="parentPhone" defaultValue={student?.parentPhone || ""} placeholder="61XXXXXXX" className="rounded-xl h-12 bg-slate-50 border-none w-full font-bold" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 w-full max-w-full overflow-hidden text-left">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-6 rounded-[2rem] border shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Maamulka Ardayda</h1>
                    <p className="text-slate-500 text-sm italic mt-1 font-medium">
                        {loading ? "Xogta waa la diyaarinayaa..." : `Waxaa kuu diwaangashan ${students.length} arday.`}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
                    <div className="relative w-full md:w-72 flex items-center gap-2">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Raadi arday..."
                                className="pl-11 rounded-full bg-slate-50 border-none h-12 w-full focus-visible:ring-blue-600 font-bold"
                            />
                        </div>
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full md:w-auto bg-blue-700 hover:bg-blue-800 rounded-full flex justify-center items-center gap-2 h-12 px-8 font-black shadow-lg shadow-blue-100">
                                <Plus size={18} /> Ku dar Arday
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2rem] max-w-2xl w-[95vw] md:w-full border-none shadow-2xl">
                            <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b text-left">
                                <DialogTitle className="text-2xl font-black text-slate-800">Diiwaangeli Arday Cusub</DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    await addStudent(new FormData(e.currentTarget));
                                    setIsAddOpen(false);
                                    fetchStudents(query);
                                }}
                                className="space-y-4 pt-2"
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

            <div className="bg-white rounded-[2rem] border shadow-sm w-full overflow-hidden">
                {loading && students.length === 0 ? (
                    <div className="py-32 flex flex-col items-center gap-4 w-full text-slate-400 font-bold">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="animate-pulse">ARDAAYDA WAA LA SOO RARAYAA...</p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-black text-slate-800 py-6 pl-10 uppercase tracking-widest text-[10px] text-left">Ardayga / Email</TableHead>
                                    <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[10px] text-left">Waalidka</TableHead>
                                    <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[10px] text-left">Taleefannada</TableHead>
                                    <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[10px] text-left">Status</TableHead>
                                    <TableHead className="text-right font-black text-slate-800 pr-10 uppercase tracking-widest text-[10px]">Tallaabo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student.id} className="hover:bg-slate-50/50 transition-all border-slate-100">
                                        <TableCell className="py-6 pl-10">
                                            <div className="flex items-center gap-4 text-left">
                                                <div className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center font-black shadow-lg text-lg shrink-0 ${student.status === 'Inactive' ? 'bg-slate-400' : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-100'}`}>
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="font-black text-slate-800 capitalize text-base tracking-tight">{student.name}</p>
                                                    <p className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1.5 tracking-wider truncate max-w-xs mt-0.5">
                                                        <Mail size={12} className="text-blue-500 shrink-0" /> {student.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-left">
                                            <div className="flex flex-col gap-1.5">
                                                <p className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-tighter">
                                                    <UserCircle size={16} className="text-slate-400" /> {student.parentName || "N/A"}
                                                </p>
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 rounded-lg font-black px-2 py-0.5 w-fit text-[9px] uppercase">
                                                    <School size={10} className="mr-1" /> {student.class?.name || student.grade}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-left">
                                            <div className="flex flex-col gap-1.5 font-bold">
                                                <p className="text-[11px] text-slate-600 flex items-center gap-2">
                                                    <Smartphone size={12} className="text-blue-500" /> {student.phone || "N/A"}
                                                </p>
                                                <p className="text-[11px] text-slate-600 flex items-center gap-2">
                                                    <Phone size={12} className="text-emerald-500" /> {student.parentPhone || "N/A"}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-left">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${
                                                student.status === 'Active' ? 'bg-emerald-50 text-emerald-600 ring-emerald-500/20' : 
                                                student.status === 'Inactive' ? 'bg-amber-50 text-amber-600 ring-amber-500/20' : 
                                                'bg-slate-50 text-slate-400 ring-slate-200'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />
                                                {student.status}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right pr-10">
                                            <div className="flex justify-end items-center gap-2">
                                                {student.status === "Pending" && (
                                                    <div className="flex items-center gap-1 animate-in fade-in zoom-in">
                                                        <Button onClick={async () => { if (confirm(`Ansixi ${student.name}?`)) { await approveStudent(student.id); fetchStudents(query); } }} className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 text-[10px] font-black uppercase rounded-xl">Approve</Button>
                                                        <Button onClick={async () => { const r = prompt("Sababta?"); if (r) { await rejectStudent(student.id, r); fetchStudents(query); } }} className="bg-rose-500 hover:bg-rose-600 text-white h-9 px-4 text-[10px] font-black uppercase rounded-xl">Reject</Button>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        onClick={async () => {
                                                            if (confirm(`Bedel xaaladda ardaygan?`)) {
                                                                await toggleStudentStatus(student.id, student.status);
                                                                fetchStudents(query);
                                                            }
                                                        }}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-10 h-10 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                                                    >
                                                        {student.status === "Active" ? <UserX size={18} /> : <UserCheck size={18} />}
                                                    </Button>

                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="w-10 h-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                                                                <Pencil size={18} />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="rounded-[2rem] max-w-2xl border-none shadow-2xl">
                                                            <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b">
                                                                <DialogTitle className="text-2xl font-black text-slate-800">Cusboonaysii Xogta</DialogTitle>
                                                            </DialogHeader>
                                                            <form
                                                                onSubmit={async (e) => {
                                                                    e.preventDefault();
                                                                    await updateStudent(new FormData(e.currentTarget));
                                                                    fetchStudents(query);
                                                                }}
                                                                className="space-y-4 pt-2"
                                                            >
                                                                <input type="hidden" name="id" value={student.id} />
                                                                <StudentFormFields student={student} />
                                                                <Button type="submit" className="w-full bg-blue-700 h-14 rounded-xl font-black text-lg mt-4">Badal Xogta</Button>
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
                    </div>
                )}
            </div>
        </div>
    );
}