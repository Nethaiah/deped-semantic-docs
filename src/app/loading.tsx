import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="size-8 text-[#087830]" />
        <p className="text-sm font-medium text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
