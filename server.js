const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/format', async (req, res) => {
  const rawText = req.body.text;

  try {
    const response = await axios.post(
      'https://your-azure-openai-endpoint.com/openai/deployments/your-deployment/chat/completions?api-version=2023-05-15',
      {
        messages: [
          { role: 'system', content: 'You are a helpful assistant that formats and corrects emails.' },
          { role: 'user', content: rawText }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_API_KEY`
        }
      }
    );

    const formatted = response.data.choices[0].message.content;
    res.json({ formatted });
  } catch (error) {
    console.error('Error formatting email:', error.message);
    res.status(500).json({ error: 'Formatting failed' });
  }
});

app.listen(3000, () => {
  console.log('Formatter API running on http://localhost:3000');
});
