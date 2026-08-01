export type HeadlineResult = {
  headline: string;
  trusted: "Real" | "Fake";
  confidence: number;
};

export type AnalyzeResponse = {
  url: string;
  total: number;
  real: number;
  fake: number;
  headlines: HeadlineResult[];
};

export type AnalyzeStatus = {
  task_id: string;
  status: string;
  url: string;
};

export type AnalyzeStage = "scraping" | "analyzing" | "done";

export type WsEvent =
  | { type: "status"; stage: AnalyzeStage; total?: number; real?: number; fake?: number }
  | { type: "result"; result: AnalyzeResponse }
  | { type: "error"; detail: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function parseError(res: Response): Promise<string> {
  let detail = `Request failed (${res.status})`;
  try {
    const body = await res.json();
    if (body.detail) detail = body.detail;
  } catch {
    // keep default message
  }
  return detail;
}

export async function startAnalysis(url: string): Promise<AnalyzeStatus> {
  const res = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export function analysisSocket(taskId: string): WebSocket {
  const wsBase = API_URL.replace(/^http/, "ws");
  return new WebSocket(`${wsBase}/ws/analyze/${taskId}`);
}
