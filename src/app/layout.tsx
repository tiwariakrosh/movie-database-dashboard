import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movie Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className="light">
      <body>{children}</body>
    </html>
  );
}
