import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/lib/i18n/context";
import { CatalogProvider } from "@/lib/catalog-context";
import PWARegistration from "@/components/app/PWARegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rider Horse Banyuwangi – Pengalaman Berkuda Terbaik",
    template: "%s | Rider Horse Banyuwangi",
  },
  description:
    "Jelajahi jalur berkuda yang menakjubkan, pelajaran profesional, dan petualangan equestrian yang tak terlupakan di Banyuwangi.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  applicationName: "Rider Horse Banyuwangi",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rider Horse",
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <LanguageProvider>
          <CatalogProvider>
            {children}
            <PWARegistration />
          </CatalogProvider>
        </LanguageProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#17231f",
              border: "1px solid #ddd6c8",
              borderRadius: "0.85rem",
              fontSize: "0.875rem",
            },
          }}
        />
      </body>
    </html>
  );
}
