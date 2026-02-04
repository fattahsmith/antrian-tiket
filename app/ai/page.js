"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = input;
    setMessages([...messages, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Tampilkan error ke user
        setMessages(prev => [
          ...prev,
          { role: "bot", text: `❌ Error: ${data.error || "Terjadi kesalahan"}` }
        ]);
        setLoading(false);
        return;
      }

      setMessages(prev => [
        ...prev,
        { role: "bot", text: data.reply }
      ]);

    } catch (err) {
      console.error("Fetch error:", err);
      setMessages(prev => [
        ...prev,
        { role: "bot", text: `❌ Error: Gagal terhubung ke server. ${err.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>AI Chatbot</h1>

      <div>
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.text}
          </p>
        ))}
        {loading && <p>AI sedang ngetik...</p>}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ketik pesan..."
      />
      <button onClick={sendMessage}>Kirim</button>
    </main>
  );
}
