import "./globals.css";

import Header from "@/components/layout/Header";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Header />
        {children}
      </body>
    </html>
  );
}
