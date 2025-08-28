import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { descriptions } = req.body;
  console.log(descriptions)

  if (!Array.isArray(descriptions) || descriptions.length === 0) {
    return res.status(400).json({ error: "Descriptions array is required" });
  }

  try {
    const prompt = `
You are given a list of error descriptions. 
Classify each into one of the categories: Data Issue, Process Delay, Configuration Error, Tool Error, Other.
If none fit, create a new category. 
Return result in JSON array form: 
[ { "description": "...", "category": "..." }, ... ]

Descriptions:
${descriptions.map((d, i) => `${i + 1}. ${d}`).join("\n")}
    `;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a smart assistant for error categorization." },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "MERN AI Error Categorizer",
        },
      }
    );

    const raw = response.data.choices[0].message.content.trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("AI did not return JSON:", raw);
      parsed = descriptions.map((d) => ({ description: d, category: "Uncategorized" }));
    }

    res.json({ results: parsed });
  } catch (error) {
    console.error("OpenRouter error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get AI response from OpenRouter" });
  }
});

export default router;
