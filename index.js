const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

// Setup express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const topicPrompts = {
  "Umum": "Kamu adalah pakar KIMIA yang membantu pelajar menjawab soalan berdasarkan sukatan pelajaran sekolah menengah."
};

app.post("/chat", async (req, res) => {
  const { topic, userMessage } = req.body;

  // Match topic with custom prompt, fallback if not found
  const systemPrompt = topicPrompts[topic] || "You are a helpful chemistry tutor.";

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ];

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // ✅ Best model for v3.2.1
      messages: messages,
    });

    // ✅ Extract reply correctly for v3.2.1
    const aiReply = completion.data.choices[0].message.content || "Tiada jawapan dari AI.";
    res.json({ reply: aiReply });
  } catch (err) {
    console.error("API call error:", err.message); // Optional debug
    res.status(500).json({ error: "API call failed", details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
