"use client";

import { useEffect, useRef, useState } from "react";
import {
  analysisSocket,
  startAnalysis,
  type AnalyzeResponse,
  type WsEvent,
} from "@/lib/api";

type Stage = "idle" | "submitting" | "scraping" | "analyzing" | "done" | "error";

export default function Home() {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => socketRef.current?.close();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url.trim()) return;

    setStage("submitting");
    setError(null);
    setResult(null);
    setTotal(0);

    try {
      const { task_id } = await startAnalysis(url.trim());
      const socket = analysisSocket(task_id);
      socketRef.current = socket;

      socket.onmessage = (event) => {
        const data: WsEvent = JSON.parse(event.data);

        if (data.type === "status") {
          if (data.stage === "scraping") setStage("scraping");
          if (data.stage === "analyzing") {
            setStage("analyzing");
            setTotal(data.total ?? 0);
          }
          return;
        }

        if (data.type === "result") {
          setResult(data.result);
          setStage("done");
          socket.close();
          return;
        }

        if (data.type === "error") {
          setError(data.detail);
          setStage("error");
          socket.close();
        }
      };

      socket.onerror = () => {
        setError("Lost connection to the analysis stream");
        setStage("error");
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStage("error");
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <header className="mb-10 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-emerald-400">
            AI-Powered News Analysis
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            Fake News Detection
          </h1>
          <p className="mt-3 text-zinc-400">
            Paste a URL and the model will scrape its headlines and flag the
            ones that look untrustworthy.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example-news-site.com"
            className="h-12 flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm outline-none transition focus:border-emerald-500"
            aria-label="Website URL"
          />
          <button
            type="submit"
            disabled={stage === "submitting" || stage === "scraping" || stage === "analyzing"}
            className="h-12 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {stage === "submitting"
              ? "Queuing…"
              : stage === "scraping" || stage === "analyzing"
                ? "Analyzing…"
                : "Analyze"}
          </button>
        </form>

        {stage === "submitting" && (
          <p className="mt-8 animate-pulse text-center text-sm text-zinc-400">
            Queuing the analysis…
          </p>
        )}

        {stage === "scraping" && (
          <p className="mt-8 animate-pulse text-center text-sm text-zinc-400">
            Opening the page in a headless browser…
          </p>
        )}

        {stage === "analyzing" && (
          <p className="mt-8 animate-pulse text-center text-sm text-zinc-400">
            Analyzing {total} headlines…
          </p>
        )}

        {stage === "error" && (
          <div className="mt-8 rounded-xl border border-red-800 bg-red-950/50 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {stage === "done" && result && (
          <section className="mt-8">
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-zinc-300">{result.url}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {result.total} headlines analyzed
                </p>
              </div>
              <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-400">
                {result.real} Real
              </span>
              <span className="rounded-full bg-red-950 px-3 py-1 text-xs font-semibold text-red-400">
                {result.fake} Fake
              </span>
            </div>

            <ul className="space-y-3">
              {result.headlines.map((item, index) => (
                <li
                  key={index}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm leading-relaxed">{item.headline}</p>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        item.trusted === "Real"
                          ? "bg-emerald-950 text-emerald-400"
                          : "bg-red-950 text-red-400"
                      }`}
                    >
                      {item.trusted}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-zinc-500">
                      <span>Confidence</span>
                      <span>{Math.round(item.confidence * 100)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${
                          item.trusted === "Real"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${item.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
