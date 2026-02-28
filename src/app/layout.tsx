import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <NuqsAdapter>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}


