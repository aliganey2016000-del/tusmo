export default function StudentDashboardPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-blue-900">Ardayga Dashboard</h1>
      <p className="mt-4 text-gray-600 font-medium">
        Ku soo dhawaaw TUSMO School Portal. Halkan waxaad ka maamuli kartaa waxbarashadaada.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow-md rounded-2xl border border-blue-50">
          <h3 className="font-bold text-gray-800 text-lg">My Courses</h3>
          <p className="text-3xl font-black text-blue-600 mt-2">0</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-2xl border border-blue-50">
          <h3 className="font-bold text-gray-800 text-lg">Assignments</h3>
          <p className="text-3xl font-black text-emerald-600 mt-2">0</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-2xl border border-blue-50">
          <h3 className="font-bold text-gray-800 text-lg">Attendance</h3>
          <p className="text-3xl font-black text-amber-600 mt-2">0%</p>
        </div>
      </div>
    </div>
  );
}