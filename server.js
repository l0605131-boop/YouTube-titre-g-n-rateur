require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const path = require('path');
const cors = require('cors'); // <--- Ligne ajoutée pour CORS

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // <--- Ligne ajoutée pour activer CORS

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Cet endpoint reçoit les requêtes du frontend
app.post('/api/combine', async (req, res) => {
  const { mot1, mot2 } = req.body;
  const prompt = `Combinez ces deux mots pour créer un titre YouTube original et créatif en un seul mot si possible, ou une expression courte de 3 mots maximum. Mots : "${mot1}" et "${mot2}". Répondez uniquement avec le nouveau titre.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const nouveauTitre = completion.choices[0].message.content;
    res.json({ nouveauMot: nouveauTitre });
  } catch (error) {
    console.error('Erreur de l\'API OpenAI:', error);
    res.status(500).json({ error: 'Erreur lors de la communication avec l\'API.' });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
