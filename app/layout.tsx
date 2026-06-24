import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Friend Activity",
  description: "A private Spotify friend activity dashboard"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
