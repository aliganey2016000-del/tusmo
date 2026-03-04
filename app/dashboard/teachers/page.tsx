import { prisma } from "@/lib/prisma";
import { deleteTeacher } from "@/app/actions/teacherActions";
import Link from "next/link";

export default async function AdminTeachersPage() {
  const teachers = await prisma.teacher.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maamulka Macalimiinta</h1>
        <Link 
          href="/dashboard/admin/teachers/add" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Ku dar Macalin
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Magaca</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Maadada</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {teachers.map((t) => (
              <tr key={t.id}>
                <td className="px-6 py-4">{t.name}</td>
                <td className="px-6 py-4">{t.subject}</td>
                <td className="px-6 py-4 text-green-600 font-bold">{t.status}</td>
                <td className="px-6 py-4 flex gap-3">
                   {/* Delete Button - Waxaan u baahanahay inaan Client Component ka dhigno si uu u shaqeeyo, ama sidan u qorno */}
                   <form action={async () => {
                     "use server";
                     await deleteTeacher(t.id);
                   }}>
                     <button className="text-red-500 hover:underline">Delete</button>
                   </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}