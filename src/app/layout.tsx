import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/authContext'
import Script from 'next/script'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inbox Secreta - Receba Mensagens Anônimas | 100% Seguro",
  description: "Receba mensagens anônimas de forma segura e divertida. Compartilhe seus pensamentos sem medo! Crie seu perfil gratuito e comece a receber confissões anônimas hoje mesmo.",
  keywords: "mensagens anônicas, confissões anônimas, inbox secreta, mensagens secretas, anônimo, confissões, perguntas anônimas, respostas anônimas",
  authors: [{ name: "Inbox Secreta" }],
  creator: "Inbox Secreta",
  publisher: "Inbox Secreta",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://inboxsecreta.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Inbox Secreta - Receba Mensagens Anônimas",
    description: "Receba mensagens anônimas de forma segura e divertida. Compartilhe seus pensamentos sem medo!",
    url: 'https://inboxsecreta.com',
    siteName: 'Inbox Secreta',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Inbox Secreta - Mensagens Anônimas',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Inbox Secreta - Receba Mensagens Anônimas",
    description: "Receba mensagens anônimas de forma segura e divertida. Compartilhe seus pensamentos sem medo!",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
