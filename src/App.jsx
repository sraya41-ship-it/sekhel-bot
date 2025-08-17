import React, { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "שלום 👋, איך אפשר לעזור לך היום?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { from: "user", text: input };
    setMessages([...messages, newMessage]);

    // כאן אתה יכול להוסיף לוגיקה שתשלח את ההודעה לשרת / API
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "קיבלתי את ההודעה שלך ✅" }
      ]);
    }, 800);

    setInput("");
  };

  return (
    <div className="App">
      <h1>🤖 Sekhel Bot</h1>

      <div className="chat-window">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.from === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="כתוב הודעה..."
        />
        <button onClick={sendMessage}>שלח</button>
      </div>
    </div>
  );
}

export default App;
