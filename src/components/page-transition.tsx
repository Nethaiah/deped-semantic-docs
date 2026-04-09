"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return (
    <div
      key={currentPath}
      className="w-full h-full flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
    >
      {children}
    </div>
  );
}
