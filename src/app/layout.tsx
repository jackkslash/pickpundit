import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "./components/NavBar";

const ceefax = localFont({
  src: [
    {
      path: "./fonts/ceefax-teletext-1.ttf",
    }
  ],
  variable: "--font-ceefax",

});

const ceefaxBulletin = localFont({
  src: [
    {
      path: "./fonts/ceefax-bulletin-1.ttf",
      weight: "800",
    }],
  variable: "--font-ceefax-bulletin",
})

export const metadata: Metadata = {
  title: "PickPundit",
  description: "Be your own pick pundit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ceefax.variable} ${ceefaxBulletin.variable} font-ceefax`}>
        <header>
          <NavBar />
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
