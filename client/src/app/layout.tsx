import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/components/store/StoreProvider"; 

export const metadata: Metadata = {
  title: "Axoma",
  description: "A platform for encrypted learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <StoreProvider>{children}</StoreProvider> 
      </body>
    </html>
  );
}
