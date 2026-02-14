import type { Metadata } from "next";
import "./globals.css";

import { CollectionProvider } from "@/context/CollectionContext";


export const metadata: Metadata = {
  title: "Objectory",
  description: "Your digital museum of physical objects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">

        <CollectionProvider>
          {children}
        </CollectionProvider>
      </body>
    </html>
  );
}



