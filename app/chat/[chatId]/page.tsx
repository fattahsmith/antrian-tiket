"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Chat } from "@/types/chat";
import ChatRoom from "@/components/chat/ChatRoom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = Number(params.chatId);
  const [chat, setChat] = useState<Chat | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<"pasien" | "petugas">("pasien");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChat = async () => {
      if (!chatId || isNaN(chatId)) {
        setLoading(false);
        return;
      }

      // Get chat data
      const { data: chatData, error: chatError } = await supabase
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
        .eq("id", chatId)
        .single();

      if (chatError || !chatData) {
        console.error("Error loading chat:", chatError);
        setLoading(false);
        return;
      }

      const formattedChat = {
        ...chatData,
        pasien_name: chatData.queues?.name,
        pasien_contact: chatData.queues?.contact,
        queue_code: chatData.queues?.queue_code,
        service_name: chatData.queues?.service_name,
      } as Chat;

      setChat(formattedChat);

      // For pasien view, use pasien_id
      // In production, get from auth context or session
      const pasienId = formattedChat.pasien_id;
      setCurrentUserId(pasienId);
      setCurrentUserRole("pasien");

      setLoading(false);
    };

    loadChat();
  }, [chatId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!chat || !currentUserId) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Chat tidak ditemukan</p>
          <Link
            href="/myqueue"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700"
          >
            Kembali ke halaman antrian
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/myqueue"
            className="rounded-lg p-1.5 hover:bg-gray-100 transition"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">
              Chat dengan Petugas
            </h1>
            <p className="text-xs text-gray-500">
              {chat.queue_code} • {chat.service_name}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Room */}
      <div className="flex-1 overflow-hidden">
        <ChatRoom
          chatId={chatId}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
      </div>
    </div>
  );
}
