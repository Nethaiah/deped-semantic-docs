"use client";

import { Menu, X } from "lucide-react";
import { useSidebar } from "./sidebar-context";

export default function MobileMenuButton() {
  const { isOpen, toggle } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggle}
      className="lg:hidden h-9 w-9 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
    >
      {isOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  );
}
