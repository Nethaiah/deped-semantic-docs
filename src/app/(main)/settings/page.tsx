import { Suspense } from "react";
import Settings from "@/components/settings/settings";
import { Skeleton } from "@/components/ui/skeleton";

function SettingsContent() {
  return <Settings />;
}

function SettingsSkeleton() {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="w-48 h-8 rounded" />
        <Skeleton className="w-full h-64 rounded-xl" />
        <Skeleton className="w-full h-48 rounded-xl" />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}
