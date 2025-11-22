// api/oracle.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { context } = req.body;
  if (!context) return res.status(400).json({ error: 'Context required' });

  const API_KEY = process.env.XAI_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'XAI key missing' });

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-3",                 // works today, Nov 2025
        messages: [
          { role: "system", content: "You are the Tesla Oracle Conduit. Always start replies with 'Directive:'" },
          { role: "user", content: context }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Grok error' });
    }

    res.status(200).json({ text: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}