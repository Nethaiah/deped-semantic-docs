import { getCurrentUserRole } from "@/lib/dal";
import { redirect } from "next/navigation";
import { columns, UserRecord } from "@/components/user-management/columns";
import { UserDataTable } from "@/components/user-management/data-table";

// ── Dummy user data ──────────────────────────────────────────────────────────
const dummyUsers: UserRecord[] = [
  {
    id: "1",
    studentNumber: "211-1392",
    username: "jdelacruiz",
    email: "jdelacruiz@lu.edu.ph",
    role: "user",
    college: "College of Engineering",
    status: "pending",
  },
  {
    id: "2",
    studentNumber: "211-0847",
    username: "mreyes",
    email: "mreyes@lu.edu.ph",
    role: "user",
    college: "College of Business",
    status: "approved",
  },
  {
    id: "3",
    studentNumber: "211-2034",
    username: "kpascual",
    email: "kpascual@lu.edu.ph",
    role: "user",
    college: "College of Education",
    status: "approved",
  },
  {
    id: "4",
    studentNumber: "211-0391",
    username: "asantos",
    email: "asantos@lu.edu.ph",
    role: "admin",
    college: "College of Information Technology",
    status: "approved",
  },
  {
    id: "5",
    studentNumber: "211-1755",
    username: "rferrer",
    email: "rferrer@lu.edu.ph",
    role: "user",
    college: "College of Arts & Sciences",
    status: "pending",
  },
  {
    id: "6",
    studentNumber: "211-2211",
    username: "cbautista",
    email: "cbautista@lu.edu.ph",
    role: "user",
    college: "College of Nursing",
    status: "rejected",
  },
  {
    id: "7",
    studentNumber: "211-3301",
    username: "evillanueva",
    email: "evillanueva@lu.edu.ph",
    role: "user",
    college: "College of Engineering",
    status: "pending",
  },
  {
    id: "8",
    studentNumber: "211-0172",
    username: "ncarpio",
    email: "ncarpio@lu.edu.ph",
    role: "user",
    college: "College of Business",
    status: "approved",
  },
  {
    id: "9",
    studentNumber: "211-4489",
    username: "tmagno",
    email: "tmagno@lu.edu.ph",
    role: "user",
    college: "College of Education",
    status: "rejected",
  },
  {
    id: "10",
    studentNumber: "211-5602",
    username: "prizon",
    email: "prizon@lu.edu.ph",
    role: "user",
    college: "College of Information Technology",
    status: "pending",
  },
  {
    id: "11",
    studentNumber: "211-6714",
    username: "lsalazar",
    email: "lsalazar@lu.edu.ph",
    role: "user",
    college: "College of Arts & Sciences",
    status: "approved",
  },
  {
    id: "12",
    studentNumber: "211-7823",
    username: "dmendoza",
    email: "dmendoza@lu.edu.ph",
    role: "user",
    college: "College of Nursing",
    status: "pending",
  },
];

export default async function UserManagementPage() {
  const userRole = await getCurrentUserRole();
  if (!userRole?.isAdmin) {
    redirect("/dashboard");
  }

  const pending = dummyUsers.filter((u) => u.status === "pending").length;
  const approved = dummyUsers.filter((u) => u.status === "approved").length;
  const rejected = dummyUsers.filter((u) => u.status === "rejected").length;

  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      {/* Page Header — renders instantly */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
          User Management
        </h1>
        <p className="text-sm text-gray-600">
          Manage and approve student access to DocuLens.
        </p>
      </div>

      {/* Quick stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Total Users",
            value: dummyUsers.length,
            colorText: "text-gray-800",
            colorBg: "bg-white",
            border: "border-gray-200",
          },
          {
            label: "Pending",
            value: pending,
            colorText: "text-yellow-700",
            colorBg: "bg-yellow-50",
            border: "border-yellow-200",
          },
          {
            label: "Approved",
            value: approved,
            colorText: "text-green-700",
            colorBg: "bg-green-50",
            border: "border-green-200",
          },
          {
            label: "Rejected",
            value: rejected,
            colorText: "text-red-700",
            colorBg: "bg-red-50",
            border: "border-red-200",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border ${stat.border} ${stat.colorBg} px-4 py-3`}
          >
            <p className="text-xs font-medium text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${stat.colorText}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <UserDataTable columns={columns} data={dummyUsers} />
    </div>
  );
}
