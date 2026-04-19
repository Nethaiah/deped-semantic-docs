import PublicHeader from "@/components/public-header";
import ScrollToTopButton from "@/components/public/scroll-to-top-button";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main>
        {children}
      </main>
      <ScrollToTopButton />
    </>
  );
}
