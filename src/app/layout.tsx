import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeaLens",
  description: "Przejrzysta analiza ofert używanego sprzętu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
