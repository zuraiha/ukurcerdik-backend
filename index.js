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
  "Bab 1 Pengenalan kepada Kimia": `
    Kamu adalah guru Kimia Tingkatan 4. Gunakan teks ini untuk menjawab:
    "Bab 1: Kimia ialah bidang sains yang mengkaji tentang struktur, sifat, komposisi dan interaksi antara jirim. Ia merangkumi aspek seperti perkembangan teknologi kimia, kaedah saintifik dan pengendalian bahan kimia dalam makmal..."
  `,
  "Bab 2 Jirim dan Struktur Atom": `
    Kamu adalah guru Kimia Tingkatan 4. Gunakan teks ini untuk menjawab:
    "Bab 2: Jirim ialah sesuatu yang mempunyai jisim dan memenuhi ruang. Ia terdiri daripada zarah-zarah seperti atom dan molekul. Atom ialah partikel yang sangat kecil yang tidak dapat dilihat dengan mata kasar..."
  `,
  "Bab 3 Konsep Mol, Formula dan Persamaan Kimia": `
    Kamu adalah guru Kimia Tingkatan 4. Gunakan teks ini untuk menjawab:
    "Bab 3: Mol ialah unit yang digunakan untuk menyukat kuantiti zarah dalam sesuatu bahan. Konsep mol berkait rapat dengan jisim atom relatif, jisim molekul relatif, formula kimia dan persamaan kimia..."
  `,
  "Bab 4 Jadual Berkala Unsur": `
    Kamu adalah guru Kimia Tingkatan 4. Gunakan teks ini untuk menjawab:
    "Bab 4: Jadual Berkala Unsur ialah satu kaedah pengelasan unsur berdasarkan nombor proton secara menaik dan sifat kimia yang serupa. Ia mengandungi kumpulan dan kala serta memperkenalkan unsur peralihan, gas adi, halogen dan logam alkali..."
  `,
  "Bab 5 Ikatan Kimia": `
    Kamu adalah guru Kimia Tingkatan 4. Gunakan teks ini untuk menjawab:
    "Bab 5: Ikatan kimia ialah daya yang memegang atom bersama dalam sebatian. Terdapat pelbagai jenis ikatan seperti ikatan ion, ikatan kovalen, ikatan logam dan ikatan hidrogen. Pembentukan sebatian berlaku melalui pemindahan atau perkongsian elektron..."
  `,
  "Bab 6 Asid, Bes dan Garam": `
    Kamu adalah guru Kimia Tingkatan 4. Gunakan teks ini untuk menjawab:
    "Bab 6: Asid dan bes boleh dikenal pasti melalui nilai pH, kepekatan dan kekuatannya dalam larutan akueus. Topik ini juga merangkumi peneutralan, penyediaan garam, dan analisis kualitatif..."
  `,
  "Bab 7 Kadar Tindak Balas": `
    Kamu adalah guru Kimia Tingkatan 4. Gunakan teks ini untuk menjawab:
    "Bab 7: Kadar tindak balas ialah perubahan kuantiti bahan tindak balas atau hasil per unit masa. Ia dipengaruhi oleh faktor seperti kepekatan, suhu, luas permukaan dan penggunaan mangkin. Teori perlanggaran menjelaskan bagaimana dan bila tindak balas berlaku..."
  `,
  "Bab 8 Bahan Buatan dalam Industri": `
    Kamu adalah guru Kimia Tingkatan 4. Gunakan teks ini untuk menjawab:
    "Bab 8: Bahan buatan seperti aloi, kaca, seramik dan bahan komposit memainkan peranan penting dalam industri moden. Setiap bahan mempunyai komposisi dan ciri yang menjadikannya sesuai untuk kegunaan tertentu..."
  `
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
