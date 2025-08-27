// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OR_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat-v3-0324:free";

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const conversation = req.body.conversation || [];

  if (!userMessage) return res.status(400).json({ error: "No message provided" });

  conversation.push({ role: "user", content: userMessage });

  try {
    const response = await fetch(OR_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: MODEL, messages: conversation })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No reply from AI";
    res.json({ reply });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
