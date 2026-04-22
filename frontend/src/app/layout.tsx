import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Marine Oil Spill Detection System",
  description: "AIS and satellite-based marine monitoring dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}