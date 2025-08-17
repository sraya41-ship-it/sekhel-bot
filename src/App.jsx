import React, { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "שלום! אני 'שקל עם שכל' 🤝💡\nאני עוזר בקבלת החלטות רכישה בהתבסס על עקרונות של כלכלה התנהגותית: דחיית סיפוקים, עלות אלטרנטיבית והתאמה ליעדים. ספר/י לי מה ההתלבטות – מחיר, האם יש כיסוי, דחיפות וחלופה זולה – ואני אכוון אותך צעד־צעד."
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: text })
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMessages((m) => [...m, { from: "bot", text: data.reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text:
            "לא הצלחתי להתחבר כעת לשירות. אפשר לנסות שוב עוד רגע, או להמשיך בשיחה ידנית 🙂."
        }
      ]);
    } finally {
      setTyping(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter") sendMessage();
  }

  function quick(t) {
    setInput(t);
  }

  return (
    <div className="app" dir="rtl">
      {/* Header */}
      <header className="topbar">
        <div className="brand">
          <div className="logo">₪💡</div>
          <div className="title">שקל עם שכל</div>
        </div>
        <div className="subtitle">בוט להתלבטויות רכישה – חכם, רגוע, ומבוסס עקרונות</div>
      </header>

      {/* Chat area */}
      <main className="chat" ref={listRef}>
        {messages.map((m, i) => (
          <div key={i} className={`row ${m.from}`}>
            <div className="bubble">{m.text}</div>
          </div>
        ))}
        {typing && (
          <div className="row bot">
            <div className="bubble typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
      </main>

      {/* Quick suggestions */}
      <div className="suggest">
        <button onClick={() => quick("זה צורך לעבודה, המחיר 1200 ₪ ויש כיסוי.")}>
          צורך לעבודה
        </button>
        <button onClick={() => quick("זה יותר מותרות, אין כיסוי כרגע.")}>
          מותרות / אין כיסוי
        </button>
        <button onClick={() => quick("יש חלופה יד 2, לא דחוף.")}>חלופה יד 2</button>
        <button onClick={() => quick("דחוף, אבל אפשר לחכות יומיים לבדיקה.")}>דחוף?</button>
      </div>

      {/* Input */}
      <footer className="composer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="ספר/י על ההתלבטות… מחיר, כיסוי, דחיפות, חלופות…"
        />
        <button onClick={sendMessage}>שלח</button>
      </footer>
    </div>
  );
}
