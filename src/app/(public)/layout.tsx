import { Suspense } from "react";
import Header from "@/components/header";

function HeaderSkeleton() {
  return (
    <nav className="fixed top-0 z-[1220] w-full h-12 bg-[#087830] border-b border-gray-200" />
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main>
        {children}
      </main>
    </>
  );
}
