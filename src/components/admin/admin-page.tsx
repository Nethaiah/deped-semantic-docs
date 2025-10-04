"use client"

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminDocuments() {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
    } else {
      toast.success("Logged out successfully");
      router.push("/login");
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Documents</h1>
          <p className="text-gray-600 mt-2">Full access to all documents and management features</p>
        </div>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Management Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Document Management</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">All Documents</h3>
              <p className="text-sm text-gray-600 mt-1">View and manage all system documents</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Upload Documents</h3>
              <p className="text-sm text-gray-600 mt-1">Upload new documents to the system</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Document Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">View usage statistics and insights</p>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">User Management</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">User List</h3>
              <p className="text-sm text-gray-600 mt-1">Manage system users and permissions</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Role Assignment</h3>
              <p className="text-sm text-gray-600 mt-1">Assign and modify user roles</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Activity Logs</h3>
              <p className="text-sm text-gray-600 mt-1">Review user activity and audit trails</p>
            </div>
          </div>
        </div>

        {/* System Settings Section */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">System Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">GNN Configuration</h3>
              <p className="text-sm text-gray-600 mt-1">Configure graph neural network settings</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Semantic Analysis</h3>
              <p className="text-sm text-gray-600 mt-1">Adjust semantic analysis parameters</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">System Backup</h3>
              <p className="text-sm text-gray-600 mt-1">Manage backups and restore points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
