import dotenv from "dotenv";
import { resolve } from "path";

// Load .env.local first (higher priority), then .env as fallback
const envLocalPath = resolve(process.cwd(), ".env.local");
dotenv.config({ path: envLocalPath });
dotenv.config(); // Loads .env if it exists

// Verify API key is loaded
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️  Warning: GEMINI_API_KEY is not set. API requests will fail.");
}
import express from "express";
import cors from "cors";
import { Role } from "../types";
import { processShowData } from "./processor";

const app = express();
const PORT = process.env.PORT ?? 5001;

app.use(cors());
app.use(express.json());

/** Request body: raw data, ekip's name, rule (photographer | MUA) */
type ApiRequestBody = {
  rawData: string;
  ekipName: string;
  rule: "photographer" | "MUA";
};

function parseRule(rule: string): Role {
  const r = rule?.toLowerCase();
  if (r === "mua") return Role.MUA;
  if (r === "photographer") return Role.PHOTOGRAPHER;
  throw new Error('Invalid rule: must be "photographer" or "MUA"');
}

app.post("/api/process", async (req, res) => {
  try {
    const { rawData, ekipName, rule } = req.body as ApiRequestBody;

    if (typeof rawData !== "string" || !rawData.trim()) {
      return res.status(400).json({ error: "rawData is required and must be a non-empty string" });
    }
    if (typeof ekipName !== "string" || !ekipName.trim()) {
      return res.status(400).json({ error: "ekipName is required and must be a non-empty string" });
    }
    if (typeof rule !== "string" || !rule.trim()) {
      return res.status(400).json({ error: 'rule is required and must be "photographer" or "MUA"' });
    }

    const role = parseRule(rule);
    const result = await processShowData(rawData.trim(), ekipName.trim(), role);

    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = message.includes("GEMINI_API_KEY") || message.includes("Invalid rule") ? 400 : 500;
    res.status(status).json({ error: message });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
