// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userText } = req.body || {};
    if (!userText) return res.status(400).json({ error: "Missing userText" });

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini"; // אפשר להחליף לדגם אחר זמין בחשבון
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const system = [
      "אתה עוזר לקבלת החלטות רכישה.",
      "דבר בטון נעים ולא שיפוטי.",
      "התבסס על עקרונות: כיסוי ולא אשראי יקר, דחיית סיפוקים (cooling-off), בדיקת חלופות, מחיר-תקרה, התאמה ליעדים.",
      "ספק הסבר אנושי ומשכנע – לא פסק דין.",
      "כשאפשר – הצע תזכורת לבחינה מחדש בעוד 24 שעות."
    ].join(" ");

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userText }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(r.status).json({ error: "OpenAI error", details: errText });
    }

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "🤖";
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: "Server error", details: String(e) });
  }
}
