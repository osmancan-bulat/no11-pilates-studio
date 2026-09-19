import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "No.11 Pilates Studio | Nilüfer, Bursa",
  description: "No.11 Pilates Studio'da bedeninizi dinleyin, dengenizi yeniden keşfedin. Balat, Nilüfer'de kişiye özel klasik pilates deneyimi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
