<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1_zXrw41hJyqAXUpQgLYuF-FTl3kKYbcR

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## API Server

Run the API server (uses `GEMINI_API_KEY` from `.env` / `.env.local`):

```bash
npm run server
```

Server runs at **http://localhost:3001** (override with `PORT`).

### POST `/api/process`

**Request body (JSON):**

| Field      | Type   | Description                         |
| ---------- | ------ | ----------------------------------- |
| `rawData`  | string | Raw scheduling string               |
| `ekipName` | string | Ekip/staff name to check assignment |
| `rule`     | string | `"photographer"` or `"MUA"`         |

**Response (JSON):**

| Field      | Type    | Description                             |
| ---------- | ------- | --------------------------------------- |
| `assigned` | boolean | `true` if ekip is in this show          |
| `Raw_data` | string  | Echo of input raw data                  |
| `data`     | object  | `date`, `customer_name`, `type_of_show` |

**Example:**

```bash
curl -X POST http://localhost:3001/api/process \
  -H "Content-Type: application/json" \
  -d '{"rawData":"( Phúc) 1841 Nguyễn Tư -Tuyết Trinh vũ sg stu 3h mk ( sang - đan )","ekipName":"sang","rule":"MUA"}'
```
