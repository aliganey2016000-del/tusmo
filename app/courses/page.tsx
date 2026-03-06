import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Atom, Globe, Languages, Calculator, History, 
  PenTool, FlaskConical, Zap, Languages as ArabicIcon, 
  Monitor, Briefcase 
} from "lucide-react";

// Xogta Maaddooyinka (Courses Data)
const courses = [
  {
    title: "Tarbiyada Islaamka",
    level: "Primary & Secondary",
    desc: "Barashada Qur'anka, Axaadiista, iyo Akhlaaqda Islaamka.",
    icon: <BookOpen className="text-emerald-600" />,
    category: "Asaasiga",
    color: "bg-emerald-50",
  },
  {
    title: "Af-Soomaali",
    level: "Primary & Secondary",
    desc: "Kobcinta suugaanta, naxwaha iyo qoraalka afka hooyo.",
    icon: <PenTool className="text-blue-600" />,
    category: "Luuqadaha",
    color: "bg-blue-50",
  },
  {
    title: "Mathematics",
    level: "Primary & Secondary",
    desc: "Xisaabta guud, Aljabra, iyo Geometry-ga Manhajka Qaranka.",
    icon: <Calculator className="text-orange-600" />,
    category: "Sayniska",
    color: "bg-orange-50",
  },
  {
    title: "English Language",
    level: "Primary & Secondary",
    desc: "Barashada akhriska, qoraalka iyo ku hadalka afka Ingiriiska.",
    icon: <Languages className="text-purple-600" />,
    category: "Luuqadaha",
    color: "bg-purple-50",
  },
  {
    title: "Physics",
    level: "Secondary School",
    desc: "Barashada miisaanka, iftiinka, korontada iyo awoodda (Force).",
    icon: <Zap className="text-yellow-600" />,
    category: "Sayniska",
    color: "bg-yellow-50",
  },
  {
    title: "Arabic Language",
    level: "Primary & Secondary",
    desc: "Barashada naxwaha, sarfka iyo qoraalka luuqadda Carabiga.",
    icon: <ArabicIcon className="text-green-600" />,
    category: "Luuqadaha",
    color: "bg-green-50",
  },
  {
    title: "Technology (ICT)",
    level: "Primary & Secondary",
    desc: "Barashada Computer-ka, Software-ka iyo dunida casriga ah.",
    icon: <Monitor className="text-slate-600" />,
    category: "Farsamada",
    color: "bg-slate-50",
  },
  {
    title: "Business Studies",
    level: "Secondary School",
    desc: "Barashada ganacsiga, xisaabaadka (Accounting) iyo maamulka.",
    icon: <Briefcase className="text-rose-600" />,
    category: "Bulshada",
    color: "bg-rose-50",
  },
  {
    title: "Biology",
    level: "Secondary School",
    desc: "Darsidda nolosha, dhirta, xoolaha iyo jidhka bini-aadamka.",
    icon: <Atom className="text-red-600" />,
    category: "Sayniska",
    color: "bg-red-50",
  },
  {
    title: "Chemistry",
    level: "Secondary School",
    desc: "Barashada curiyeyaasha iyo falgallada kiimikada.",
    icon: <FlaskConical className="text-cyan-600" />,
    category: "Sayniska",
    color: "bg-cyan-50",
  },
  {
    title: "Geography",
    level: "Primary & Secondary",
    desc: "Barashada dhulka, jawiga, iyo khayraadka dabiiciga ah.",
    icon: <Globe className="text-indigo-600" />,
    category: "Bulshada",
    color: "bg-indigo-50",
  },
  {
    title: "History",
    level: "Primary & Secondary",
    desc: "Taariikhda Soomaaliya iyo tan caalamka ee Manhajka cusub.",
    icon: <History className="text-amber-600" />,
    category: "Bulshada",
    color: "bg-amber-50",
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-4 py-1">
            Manhajka Qaranka Soomaaliya
          </Badge>
          <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl">
            Maaddooyinka aan bixino
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto italic">
            &ldquo;Barashadu waa furaha guusha mustaqbalka.&rdquo;
          </p>
        </div>

        {/* COURSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
              <CardHeader className={`${course.color} pb-4`}>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4 group-hover:rotate-12 transition-transform">
                  {course.icon}
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {course.title}
                </CardTitle>
                <Badge variant="outline" className="w-fit mt-2 bg-white/50 border-gray-200 text-[10px]">
                  {course.level}
                </Badge>
              </CardHeader>
              <CardContent className="pt-6">
                <CardDescription className="text-gray-600 text-sm leading-relaxed mb-4 min-h-15">
                  {course.desc}
                </CardDescription>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {course.category}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA SECTION */}
        <div className="mt-20 bg-blue-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 italic">Diiwaangelinta waa furan tahay!</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              TUSMO School waxay kuu haysaa macallimiin aqoon sare leh iyo jawi waxbarasho oo degan.
            </p>
            <button className="bg-white text-blue-900 px-10 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
              Is-diiwaangeli Hadda
            </button>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-800 rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 h-48 bg-blue-800 rounded-full opacity-50"></div>
        </div>

      </div>
    </div>
  );
}