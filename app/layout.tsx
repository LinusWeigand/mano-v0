import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BannerProvider } from "@/context/BannerContext";
import { ProfilesProvider } from "@/context/ProfilesContext";
import { AuthProvider } from "@/context/AuthContext";
import WrappedHeader from "./components/header/wrapper";
import { GoogleScriptContextProvider } from "@/context/GoogleMapsContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mano",
  description: "Leicht Handwerker finden.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 1) Insert a <head> section manually */}
      <head>
        {/* 2) A raw <script> tag that always appears in final HTML */}
        <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD1D5qzwgPA5guVgv6QWJFjtdhRUpqAwus&libraries=places"
        ></script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BannerProvider>
          <ProfilesProvider>
            <AuthProvider>
              <GoogleScriptContextProvider>
                <WrappedHeader />
                {children}
              </GoogleScriptContextProvider>
            </AuthProvider>
          </ProfilesProvider>
        </BannerProvider>
      </body>
    </html>
  );
}
