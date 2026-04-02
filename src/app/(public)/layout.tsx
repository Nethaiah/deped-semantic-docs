import Header from "@/components/header";
import { PageTransition } from "@/components/page-transition";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </>
  );
}
