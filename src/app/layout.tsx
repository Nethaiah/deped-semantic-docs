import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import ConditionalLayout from "./conditional-layout";
import ConditionalHeader from "./conditional-header";

// ✅ Load only Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "DocuLens - DepEd Semantic Documents",
  description: "Comprehensive retrieval of DepEd memoranda and policies",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user?.id)
    .single();

  const role = userData?.role || "user";

  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ConditionalHeader>
          <Header />
        </ConditionalHeader>
        <ConditionalLayout user={user} role={role}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
