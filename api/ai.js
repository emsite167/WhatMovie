export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { messages, max_tokens } = req.body;

    // Appel API Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: max_tokens || 1400,
        messages: messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: { message: err } });
    }

    const data = await response.json();

    // Reformate la réponse au format Anthropic pour que le front ne change pas
    const text = data.choices?.[0]?.message?.content || '';
    res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch(e) {
    res.status(500).json({ error: { message: e.message } });
  }
}
