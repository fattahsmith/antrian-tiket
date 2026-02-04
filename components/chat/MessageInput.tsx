"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface MessageInputProps {
  chatId: number;
  senderId: number;
}

export default function MessageInput({ chatId, senderId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    const messageText = message.trim();
    setMessage("");
    setSending(true);

    try {
      // Insert message
      const { error: messageError } = await supabase.from("messages").insert({
        chat_id: chatId,
        sender_id: senderId,
        message: messageText,
        is_read: false,
      });

      if (messageError) {
        console.error("Error sending message:", messageError);
        alert("Gagal mengirim pesan. Silakan coba lagi.");
        setMessage(messageText); // Restore message
        return;
      }

      // Update chat updated_at
      await supabase
        .from("chats")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", chatId);
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan. Silakan coba lagi.");
      setMessage(messageText); // Restore message
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={sending || !message.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
