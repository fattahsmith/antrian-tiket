"use client";

import { useEffect, useState } from "react";
import { Chat } from "@/types/chat";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface ChatListProps {
  petugasId: number;
  onSelectChat: (chatId: number) => void;
  selectedChatId?: number;
}

export default function ChatList({
  petugasId,
  onSelectChat,
  selectedChatId,
}: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChats = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
        *,
        queues!inner (
          queue_code,
          service_name,
          name,
          contact
        )
      `
      )
      .eq("petugas_id", petugasId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error loading chats:", error);
      setLoading(false);
      return;
    }

    // Get unread counts and last messages
    const chatsWithMetadata = await Promise.all(
      (data || []).map(async (chat: any) => {
        // Get unread count
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("chat_id", chat.id)
          .eq("is_read", false)
          .neq("sender_id", petugasId);

        // Get last message
        const { data: lastMessage } = await supabase
          .from("messages")
          .select("message, created_at")
          .eq("chat_id", chat.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          ...chat,
          pasien_name: chat.queues?.name,
          pasien_contact: chat.queues?.contact,
          queue_code: chat.queues?.queue_code,
          service_name: chat.queues?.service_name,
          unread_count: unreadCount || 0,
          last_message: lastMessage?.message || "",
          last_message_at: lastMessage?.created_at || chat.updated_at,
        } as Chat;
      })
    );

    setChats(chatsWithMetadata);
    setLoading(false);
  };

  useEffect(() => {
    loadChats();

    // Subscribe to chat updates
    const channel = supabase
      .channel("chats-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
          filter: `petugas_id=eq.${petugasId}`,
        },
        () => {
          loadChats();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          loadChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [petugasId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">Memuat chat...</p>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">Belum ada chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {chats.map((chat) => (
        <motion.button
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`w-full border-b border-gray-100 p-4 text-left transition hover:bg-gray-50 ${
            selectedChatId === chat.id ? "bg-blue-50" : ""
          }`}
          whileHover={{ x: 2 }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 truncate">
                  {chat.pasien_name || "Pasien"}
                </p>
                {chat.unread_count > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                    {chat.unread_count > 9 ? "9+" : chat.unread_count}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500 truncate">
                {chat.queue_code} • {chat.service_name}
              </p>
              {chat.last_message && (
                <p className="mt-1 text-sm text-gray-600 truncate">
                  {chat.last_message}
                </p>
              )}
            </div>
            {chat.last_message_at && (
              <p className="text-xs text-gray-400 shrink-0">
                {new Date(chat.last_message_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
