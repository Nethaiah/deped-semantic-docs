"use client";

import { useRouter } from "next/navigation";

export default function SmoothFooterLink({
  href,
  children,
  className,
}: {
  href: "/" | "#about" | "#features";
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  function handleClick() {
    if (href === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const sectionId = href.slice(1);
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    router.push(`/${href}`);
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
