import type { Metadata } from "next";
import { Toaster } from "sonner";
import { cinzel, cormorant, greatVibes, sourceSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "XXVII Fiesta Nacional e Internacional del Caballo | Trancas",
  description:
    "Invitación oficial digital a la XXVII Fiesta Nacional e Internacional del Caballo. Trancas, Tucumán, Argentina.",
  openGraph: {
    title: "XXVII Fiesta Nacional e Internacional del Caballo",
    description:
      "Experiencia digital institucional · Trancas · Tucumán · Argentina",
    locale: "es_AR",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fiesta del Caballo",
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2B2654",
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${cormorant.variable} ${greatVibes.variable} ${sourceSans.variable}`}
    >
      <body className="min-h-dvh antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
