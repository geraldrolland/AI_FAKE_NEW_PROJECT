import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Fake News Detection",
  description:
    "Analyze a webpage URL and detect whether its headlines are likely real or fake.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur-md">
          <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
            <Link
              href="/"
              className="group flex items-center gap-2 text-sm font-bold tracking-tight"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 font-mono text-xs text-emerald-400 transition group-hover:bg-emerald-500/25">
                AI
              </span>
              <span>
                Veri<span className="text-emerald-400">Scope</span>
              </span>
            </Link>
            <div className="flex items-center gap-6 text-sm text-zinc-400">
              <Link
                href="/"
                className="transition hover:text-zinc-100"
              >
                Home
              </Link>
              <Link
                href="/analyze"
                className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500"
              >
                Analyze a URL
              </Link>
            </div>
          </nav>
        </header>

        {children}

        <footer className="border-t border-zinc-800/60 py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 sm:flex-row">
            <p className="font-mono text-xs">
              Veri<span className="text-emerald-400">Scope</span> — AI-powered
              news credibility analysis
            </p>
            <p className="text-xs">
              Scrape. Analyze. Verify. Built with FastAPI, Celery &amp; Next.js
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
