// api/grok.js  ← FINAL VERSION (copy this exactly)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const key = process.env.GROK_API_KEY;
  if (!key) return res.status(500).json({ error: "No API key" });

  try {
    const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: req.body,
    });

    const data = await grokRes.json();
    res.status(grokRes.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}