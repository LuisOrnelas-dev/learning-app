const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// API endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { messages, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 2000 } = req.body;

    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: max_tokens
    });

    res.json({ 
      content: response.choices[0].message.content,
      usage: response.usage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err.toString() });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'OpenAI Proxy is running' });
});

app.listen(PORT, () => {
  console.log(`OpenAI Proxy server running on http://localhost:${PORT}`);
  console.log('Make sure to set your OPENAI_API_KEY in the .env file');
}); 