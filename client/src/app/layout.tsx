import type { Metadata } from "next";
import { Barlow, Poppins } from "next/font/google";
import ReduxProvider from "@/redux/provider";
import { CheckUser } from "@/components/Secure/Checkauth";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zuno",
  description:
    "Zuno is a social blogging platform to share your thoughts and connect with others.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barlow.variable} ${poppins.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <ReduxProvider>
          <CheckUser>{children}</CheckUser>
        </ReduxProvider>
      </body>
    </html>
  );
}
