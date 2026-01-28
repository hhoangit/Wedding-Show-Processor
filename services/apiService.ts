import { Role, ProcessedResult } from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function processShowData(
  rawData: string,
  ekipName: string,
  role: Role
): Promise<ProcessedResult> {
  const rule = role === Role.MUA ? "MUA" : "photographer";
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawData, ekipName, rule }),
    });
  } catch (e) {
    throw new Error(
      "Cannot reach the API server. Start it with: npm run server"
    );
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? "No response from server");
  }

  return res.json() as Promise<ProcessedResult>;
}
