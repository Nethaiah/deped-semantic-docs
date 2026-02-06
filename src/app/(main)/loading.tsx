import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="size-8 text-[#087830]" />
        <p className="text-sm font-medium text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
