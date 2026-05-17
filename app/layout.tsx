import type { Metadata } from "next";
import "./globals.css";
import GlobalCursor from "./components/GlobalCursor";

export const metadata: Metadata = {
  title: "DVND — Two Forces. One Label.",
  description: "DVND. Premium dark luxury streetwear. Two forces. One label.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <GlobalCursor />
        {children}
      </body>
    </html>
  );
}