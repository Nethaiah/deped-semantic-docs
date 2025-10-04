"use client"

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserDocuments() {
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
          <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-600 mt-2">Access your personal documents and resources</p>
        </div>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Documents Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">My Documents</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Recent Documents</h3>
              <p className="text-sm text-gray-600 mt-1">View your recently accessed documents</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Upload Document</h3>
              <p className="text-sm text-gray-600 mt-1">Upload a new document for analysis</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Favorites</h3>
              <p className="text-sm text-gray-600 mt-1">Quick access to your starred documents</p>
            </div>
          </div>
        </div>

        {/* Search & Analysis Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Search & Analysis</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Semantic Search</h3>
              <p className="text-sm text-gray-600 mt-1">Search documents using semantic analysis</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Document Insights</h3>
              <p className="text-sm text-gray-600 mt-1">View AI-powered insights from your documents</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Related Documents</h3>
              <p className="text-sm text-gray-600 mt-1">Discover connections between documents</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">New Analysis</h3>
              <p className="text-sm text-gray-600 mt-1">Start a new document analysis</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">View History</h3>
              <p className="text-sm text-gray-600 mt-1">Browse your analysis history</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Settings</h3>
              <p className="text-sm text-gray-600 mt-1">Manage your preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
