"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";
import { supabase } from "@/lib/supabase";
import MessageInput from "./MessageInput";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ChatRoomProps {
  chatId: number;
  currentUserId: number;
  currentUserRole: "pasien" | "petugas";
}

export default function ChatRoom({
  chatId,
  currentUserId,
  currentUserRole,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          profiles:sender_id (
            name,
            role
          )
        `
        )
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        setLoading(false);
        return;
      }

      const formattedMessages = (data || []).map((msg: any) => ({
        ...msg,
        sender_name: msg.profiles?.name || "Unknown",
        sender_role: msg.profiles?.role || "pasien",
      })) as Message[];

      setMessages(formattedMessages);
      setLoading(false);

      // Mark messages as read if petugas
      if (currentUserRole === "petugas") {
        await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("chat_id", chatId)
          .neq("sender_id", currentUserId)
          .eq("is_read", false);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        async (payload) => {
          const newMessage = payload.new as any;

          // Get sender profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("name, role")
            .eq("id", newMessage.sender_id)
            .single();

          const message: Message = {
            ...newMessage,
            sender_name: profile?.name || "Unknown",
            sender_role: profile?.role || "pasien",
          };

          setMessages((prev) => [...prev, message]);

          // Mark as read if petugas and not own message
          if (
            currentUserRole === "petugas" &&
            newMessage.sender_id !== currentUserId
          ) {
            await supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", newMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, currentUserId, currentUserRole]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-500">
              Belum ada pesan. Mulai percakapan!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.sender_id === currentUserId;
            const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                {!isOwnMessage && showAvatar && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    {msg.sender_name?.charAt(0).toUpperCase() || "P"}
                  </div>
                )}
                {!isOwnMessage && !showAvatar && <div className="w-8" />}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isOwnMessage
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
                  }`}
                >
                  {!isOwnMessage && (
                    <p className="mb-1 text-xs font-semibold text-gray-600">
                      {msg.sender_name}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      isOwnMessage ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {isOwnMessage && !showAvatar && <div className="w-8" />}
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput chatId={chatId} senderId={currentUserId} />
    </div>
  );
}
