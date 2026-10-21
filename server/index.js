import express from "express";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = process.env.PORT || 8787;
const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, "data");
const dataFile = path.join(dataDir, "submissions.json");

app.use(express.json({ limit: "20kb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_ORIGIN || "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

async function readSubmissions() {
  try {
    return JSON.parse(await readFile(dataFile, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { enquiries: [], subscribers: [] };
  }
}

async function saveSubmissions(data) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(data, null, 2));
}

function requiredString(value, field) {
  if (typeof value !== "string" || value.trim().length < 2) {
    const error = new Error(`${field} is required`);
    error.status = 400;
    throw error;
  }
  return value.trim();
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/enquiries", async (req, res, next) => {
  try {
    const { name, email, phone, tour, travellers, message } = req.body;
    const enquiry = {
      id: crypto.randomUUID(),
      name: requiredString(name, "Name"),
      email: requiredString(email, "Email"),
      phone: typeof phone === "string" ? phone.trim() : "",
      tour: requiredString(tour, "Tour"),
      travellers: Number.isInteger(travellers) && travellers > 0 ? travellers : 1,
      message: typeof message === "string" ? message.trim() : "",
      createdAt: new Date().toISOString(),
      status: "new"
    };
    const data = await readSubmissions();
    data.enquiries.push(enquiry);
    await saveSubmissions(data);
    res.status(201).json({ message: "Your enquiry is with our travel desk.", enquiryId: enquiry.id });
  } catch (error) {
    next(error);
  }
});

app.post("/api/newsletter", async (req, res, next) => {
  try {
    const email = requiredString(req.body.email, "Email");
    const data = await readSubmissions();
    if (!data.subscribers.some((subscriber) => subscriber.email === email)) {
      data.subscribers.push({ email, createdAt: new Date().toISOString() });
      await saveSubmissions(data);
    }
    res.status(201).json({ message: "Welcome to the inner circle." });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.status ? error.message : "Something went wrong. Please try again." });
});

app.listen(port, () => console.log(`Traviator API listening on http://localhost:${port}`));
