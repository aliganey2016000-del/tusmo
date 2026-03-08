'use client';

import { useState, useCallback, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { Student, Class } from "@prisma/client";
import {
  addStudent,
  deleteStudent,
  updateStudent,
  toggleStudentStatus,
  getLatestStudentId,
  importStudents,
  checkExistingStudents
} from "@/app/actions/studentActions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search, Trash2, Pencil, Loader2, Plus, BookOpen, Users,
  ChevronDown, Check, Activity, ChevronLeft, ChevronRight,
  Inbox, School, Sparkles, FileDown, FileUp, Download
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface StudentWithClass extends Student {
  class?: Class | null;
}

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  icon: React.ElementType;
}

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pageCount: 1 });
  const [stats, setStats] = useState({ totalAll: 0, active: 0, pending: 0 });
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["Active"]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<StudentWithClass[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [lastIdHint, setLastIdHint] = useState("");

  const [importData, setImportData] = useState<(string | number | null | undefined)[][]>([]);
  const [duplicates, setDuplicates] = useState<{ grade: string, email: string }[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const levels = ["Primary", "Middle", "Secondary"];
  const statuses = ["Active", "Inactive", "Pending"];
  const genders = ["Male", "Female"];

  const fetchStudents = useCallback(async (signal?: AbortSignal) => {
    setLoading(true); setHasSearched(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(), levels: selectedLevels.join(","),
        statuses: selectedStatuses.join(","), genders: selectedGenders.join(","), query
      });
      const res = await fetch(`/api/students?${params.toString()}`, { signal });
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
        setMeta(data.pagination || { total: 0, pageCount: 1 });
        setStats(data.stats || { totalAll: 0, active: 0, pending: 0 });
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') console.error(error.message);
    } finally { setLoading(false); }
  }, [page, selectedLevels, selectedStatuses, selectedGenders, query]);

  useEffect(() => {
    fetch('/api/classes').then(res => res.json()).then(setClasses).catch(() => { });
  }, []);

  const handleOpenAdd = async () => {
    const lastId = await getLatestStudentId();
    setLastIdHint(lastId);
    setIsAddOpen(true);
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      if (typeof bstr !== 'string') return;
      const wb = XLSX.read(bstr, { type: "binary" });
      // WAA LAGA SAXAY HALKAN: 'any[][]' waa laga bedelay
      const data: (string | number | null | undefined)[][] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
      const rows = data.slice(1).filter(r => r.length > 0);
      const idents = rows.map(r => ({ sid: String(r[0]), email: String(r[2]).toLowerCase() }));
      const existing = await checkExistingStudents(idents);
      setImportData(rows);
      setDuplicates(existing.map((ex: { grade: string, email: string }) => ({ grade: ex.grade, email: ex.email })));
      setIsPreviewOpen(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ma hubtaa inaad tirtirto ardaygan?")) return;
    try {
      await deleteStudent(id);
      toast.success("Ardayga waa la tirtiray");
      fetchStudents();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      // WAA LAGA SAXAY HALKAN: currentStatus ayaa lagu daray function-ka
      await toggleStudentStatus(id, currentStatus);
      toast.success("Xaaladda waa la bedelay");
      fetchStudents();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    }
  };

  const StudentFormFields = ({ student }: { student?: StudentWithClass }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-black text-left">
      <div className="space-y-1">
        <label className="text-[10px] uppercase text-slate-400">Student ID</label>
        <Input name="studentId" defaultValue={student?.grade || ""} placeholder={lastIdHint} required className="rounded-xl h-12 bg-slate-50 border-none font-black" />
        {!student && lastIdHint && <p className="text-[9px] text-blue-500 mt-1 flex items-center gap-1 uppercase"><Sparkles size={10} /> Hint: {lastIdHint}</p>}
      </div>
      <div className="space-y-1"><label className="text-[10px] uppercase text-slate-400">Magaca</label><Input name="name" defaultValue={student?.name} required className="rounded-xl h-12 bg-slate-50 border-none font-black" /></div>
      <div className="space-y-1"><label className="text-[10px] uppercase text-slate-400">Email</label><Input name="email" type="email" defaultValue={student?.email} required className="rounded-xl h-12 bg-slate-50 border-none font-black" /></div>
      <div className="space-y-1"><label className="text-[10px] uppercase text-slate-400">Fasalka</label>
        <select name="classId" defaultValue={student?.classId || ""} required className="w-full h-12 rounded-xl bg-slate-50 px-3 text-sm font-black outline-none border-none">
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-black uppercase text-left">
      {/* 1. STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[{ label: "Wadarta", v: stats.totalAll, ic: Users, c: "text-blue-600", b: "bg-blue-50" }, { label: "Active", v: stats.active, ic: Check, c: "text-emerald-600", b: "bg-emerald-50" }, { label: "Pending", v: stats.pending, ic: Activity, c: "text-amber-600", b: "bg-amber-50" }].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl ${s.b} ${s.c} flex items-center justify-center`}><s.ic size={24} /></div>
            <div><p className="text-[10px] text-slate-400 tracking-widest">{s.label}</p><p className="text-2xl font-black">{s.v}</p></div>
          </div>
        ))}
      </div>

      {/* 2. HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm font-black">
        <div className="text-left font-black"><h1 className="text-3xl font-black text-slate-800 tracking-tight">Maamulka Ardayda</h1><p className="text-slate-400 text-[10px] tracking-widest mt-1">Enterprise Database</p></div>
        <div className="flex flex-wrap items-center gap-3">
          <input type="file" ref={fileInputRef} onChange={handleImportExcel} className="hidden" accept=".xlsx, .xls" />
          <Button variant="outline" onClick={() => {
            const ws = XLSX.utils.aoa_to_sheet([["Id", "Ardayga", "Email", "Phone", "Fasalka", "Jinsiga", "Waalidka", "W-Phone"]]);
            const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Template"); XLSX.writeFile(wb, "Sample.xlsx");
          }} className="h-11 rounded-xl border-slate-200 text-blue-600 text-[10px] gap-2 uppercase font-black"><Download size={16} /> Get Sample</Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-11 rounded-xl border-slate-200 text-emerald-600 gap-2 font-black uppercase text-[10px]"><FileUp size={16} /> Import</Button>
          <Button variant="outline" onClick={() => {
            const ws = XLSX.utils.json_to_sheet(students.map(s => ({ Id: s.grade, Name: s.name, Email: s.email })));
            const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Students"); XLSX.writeFile(wb, "Export.xlsx");
          }} className="h-11 rounded-xl border-slate-200 text-amber-600 gap-2 font-black uppercase text-[10px]"><FileDown size={16} /> Export</Button>
          <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 rounded-full h-11 px-8 font-black text-white shadow-lg"><Plus size={18} /> Ku dar</Button>
        </div>
      </div>

      {/* IMPORT PREVIEW */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-[2rem] font-black uppercase text-left">
          {/* WAA LAGA SAXAY HALKAN: DialogTitle ayaa la isticmaalay */}
          <DialogHeader><DialogTitle className="text-xl font-black">Preview Import</DialogTitle></DialogHeader>
          <div className="overflow-x-auto border rounded-2xl">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-slate-50"><tr><th className="p-3">ID</th><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Status</th></tr></thead>
              <tbody>
                {importData.map((r, i) => {
                  const isDup = duplicates.some(d => d.grade === String(r[0]) || d.email === String(r[2]).toLowerCase());
                  return (
                    <tr key={i} className={`border-t ${isDup ? 'bg-rose-50 text-rose-600' : ''}`}>
                      <td className="p-3 font-black">{r[0]}</td><td className="p-3 font-black">{r[1]}</td><td className="p-3 font-black">{r[2]}</td>
                      <td className="p-3">{isDup ? "EXIST" : "NEW"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Button onClick={async () => {
            setIsSubmitting(true);
            const clean = importData.filter(r => !duplicates.some(d => d.grade === String(r[0]) || d.email === String(r[2]).toLowerCase()));
            await importStudents(clean); setIsSubmitting(false); setIsPreviewOpen(false); fetchStudents();
          }} disabled={isSubmitting} className="w-full bg-blue-600 h-12 rounded-xl text-white font-black">{isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm Import"}</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-2xl border-none shadow-2xl overflow-y-auto font-black text-left">
          {/* WAA LAGA SAXAY HALKAN: DialogTitle ayaa la isticmaalay */}
          <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b text-left font-black">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Diiwaangeli</DialogTitle>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault(); setIsSubmitting(true);
            try { await addStudent(new FormData(e.currentTarget)); setIsAddOpen(false); toast.success("Keydiyay"); fetchStudents(); }
            catch (err: unknown) { if (err instanceof Error) toast.error(err.message); } finally { setIsSubmitting(false); }
          }} className="space-y-6 pt-4 font-black">
            <StudentFormFields />
            <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 h-14 rounded-2xl font-black text-white shadow-xl shadow-blue-100">{isSubmitting ? <Loader2 className="animate-spin" /> : "Keydi"}</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* FILTERS */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-[2.2rem] border border-slate-100 shadow-xl flex flex-wrap items-center gap-4 sticky top-4 z-40 font-black">
        <MultiSelectDropdown label="Heerarka" options={levels} selected={selectedLevels} onToggle={(v) => { setSelectedLevels(p => p.includes(v) ? p.filter(i => i !== v) : [...p, v]); setPage(1); }} icon={BookOpen} />
        <MultiSelectDropdown label="Xaaladda" options={statuses} selected={selectedStatuses} onToggle={(v) => { setSelectedStatuses(p => p.includes(v) ? p.filter(i => i !== v) : [...p, v]); setPage(1); }} icon={Activity} />
        <MultiSelectDropdown label="Jinsiga" options={genders} selected={selectedGenders} onToggle={(v) => { setSelectedGenders(p => p.includes(v) ? p.filter(i => i !== v) : [...p, v]); setPage(1); }} icon={Users} />
        <div className="flex-1 min-w-[200px] relative font-black"><Search className="absolute left-4 top-3.5 text-slate-400" size={16} /><Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Raadi..." className="pl-11 rounded-2xl h-12 bg-slate-50 border-none font-black text-xs shadow-inner" /></div>
        <Button onClick={() => fetchStudents()} disabled={loading} className="h-12 px-10 rounded-2xl bg-slate-900 text-white font-black flex gap-2 shadow-lg active:scale-95"><Search size={18} /><span>Raadi</span></Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {!hasSearched ? (
          <div className="py-32 text-center space-y-6 font-black"><div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto animate-bounce font-black"><Users size={40} className="text-slate-200" /></div><p className="text-slate-400 text-[10px] tracking-widest uppercase">Riix Raadi si aad u bilowdo</p></div>
        ) : loading ? (
          <div className="p-10 space-y-4 font-black">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 w-full bg-slate-50 animate-pulse rounded-2xl font-black" />)}</div>
        ) : students.length === 0 ? (
          <div className="py-32 text-center text-slate-300 font-black"><Inbox size={60} className="mx-auto" /><p className="mt-4 text-xs uppercase font-black">Arday lama helin!</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 font-black">
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest">Ardayga / Id</th>
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest text-center">Fasalka & Jinsiga</th>
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest text-right">Ficil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group font-black">
                    <td className="p-6">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg uppercase text-sm font-black">
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex flex-col text-left font-black">
                          <span className="text-sm text-slate-800 font-black">{student.name}</span>
                          <span className="text-[10px] text-blue-600 font-black">{student.grade || "No ID"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center font-black">
                      <div className="flex flex-col items-center gap-1.5 font-black text-center">
                        <Badge className="bg-blue-50 text-blue-700 border-none text-[9px] uppercase px-2 font-black tracking-tighter">
                          <School size={10} className="inline mr-1" /> {student.class?.name || "N/A"}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] uppercase border-slate-200 font-black">
                          {student.gender}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-6 text-right font-black">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all font-black">
                        {/* WAA LAGA SAXAY HALKAN: status-ka waa loo gudbiyay handleToggleStatus */}
                        <Button onClick={() => handleToggleStatus(student.id, student.status)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-amber-50 text-slate-400 hover:text-amber-600 font-black">
                          <Activity size={18} />
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 font-black">
                              <Pencil size={18} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[2.5rem] max-w-2xl border-none shadow-2xl font-black text-left overflow-y-auto">
                            {/* WAA LAGA SAXAY HALKAN: DialogTitle ayaa la isticmaalay */}
                            <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b text-left font-black">
                              <DialogTitle className="text-2xl font-black uppercase tracking-tight">Cusboonaysii</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={async (e) => {
                              e.preventDefault(); setIsSubmitting(true);
                              try {
                                await updateStudent(new FormData(e.currentTarget));
                                toast.success("Updated"); fetchStudents();
                              } catch (err: unknown) {
                                if (err instanceof Error) toast.error(err.message);
                              } finally { setIsSubmitting(false); }
                            }} className="space-y-6 pt-4 font-black text-left">
                              <input type="hidden" name="id" value={student.id} />
                              <StudentFormFields student={student} />
                              <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 h-14 rounded-2xl font-black text-white shadow-xl">Badal</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        
                        <Button onClick={() => handleDelete(student.id)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all font-black">
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FOOTER PAGINATION */}
      {students.length > 0 && (
        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between font-black">
          <p className="text-[10px] text-slate-400 uppercase">Bogga {page} ee {meta.pageCount} ({meta.total} Arday)</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-10 w-10 p-0 rounded-xl border-slate-100 font-black"><ChevronLeft size={18} /></Button>
            <Button variant="outline" disabled={page >= meta.pageCount} onClick={() => setPage(p => p + 1)} className="h-10 w-10 p-0 rounded-xl border-slate-100 font-black"><ChevronRight size={18} /></Button>
          </div>
        </div>
      )}
    </div>
  );
}

function MultiSelectDropdown({ label, options, selected, onToggle, icon: Icon }: MultiSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-12 w-full md:w-60 justify-between rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] uppercase tracking-widest px-6 shadow-sm">
          <div className="flex items-center gap-2 font-black">
            <Icon size={14} className="text-slate-400" /><span>{label}:</span><span className="text-blue-600">{selected.length > 0 ? `${selected.length} la doortay` : "Dhammaan"}</span>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2 rounded-[1.5rem] border-slate-100 shadow-2xl z-50 font-black text-left">
        <div className="space-y-1 max-h-60 overflow-y-auto scrollbar-hide text-left font-black">
          {options.map((opt) => (
            <div key={opt} onClick={() => onToggle(opt)} className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-all group font-black text-left">
              <span className={`text-[11px] uppercase font-black ${selected.includes(opt) ? 'text-blue-600' : 'text-slate-600'}`}>{opt}</span>
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selected.includes(opt) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-white font-black'}`}>
                {selected.includes(opt) && <Check size={12} className="font-black" />}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}