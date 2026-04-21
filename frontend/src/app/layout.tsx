import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marine Oil Spill Detection System",
  description: "AIS and satellite-based oil spill monitoring dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}