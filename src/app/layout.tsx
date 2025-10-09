import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { createClient } from "@/lib/supabase/server";

const supabase = createClient();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocuLens - DepEd Semantic Documents",
  description: "Comprehensive retrieval of DepEd memoranda and policies",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get role on the server to avoid client flash
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('uid', user?.id)
    .single();

  const role = userData?.role || 'user';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        { user ? (
          <Sidebar role={role}>
            {children}
            <Toaster/>
          </Sidebar>
        ) : (
          <>
            {children}
            <Toaster/>
          </>
        )}
      </body>
    </html>
  );
}
