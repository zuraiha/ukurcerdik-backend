const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const topicPrompts = {
  "Kimia": "You are a teacher that teach Kimia for tingkatan 4, explain and answer the question based on the text book of KIMIA for tingkatan 4",
  "Pecahan": "You are a smart math tutor teaching about fractions...",
  "Sejarah Malaysia": "You are an expert in Malaysian history...",
};

app.post("/chat", async (req, res) => {
  const { topic, userMessage } = req.body;

  const systemPrompt = topicPrompts[topic] || "You are a helpful tutor.";
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages,
    });
    const aiReply = completion?.data?.choices?.[0]?.message?.content || "Tiada jawapan dari AI.";
    res.json({ reply: aiReply });

  } catch (err) {
    res.status(500).json({ error: "API call failed", details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
