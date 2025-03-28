import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BannerProvider } from "@/context/BannerContext";
import { ProfilesProvider } from "@/context/ProfilesContext";
import { AuthProvider } from "@/context/AuthContext";
import WrappedHeader from "./components/header/wrapper";
import { GoogleScriptContextProvider } from "@/context/GoogleMapsContext";
import Script from "next/script";

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
      {/* If you need something in <head>, just place it here, but do not use raw <script> */}
      <head />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Load Google Maps script after the page is interactive (or change strategy to 'beforeInteractive' if absolutely necessary) */}
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD1D5qzwgPA5guVgv6QWJFjtdhRUpqAwus&libraries=places"
          strategy="afterInteractive"
        />

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
