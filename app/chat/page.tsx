"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ChatList from "@/components/chat/ChatList";
import ChatRoom from "@/components/chat/ChatRoom";
import { useStaffAuth } from "@/contexts/StaffAuthContext";
import { Loader2 } from "lucide-react";

export default function PetugasChatPage() {
  const router = useRouter();
  const { isStaffLoggedIn, isLoading: authLoading } = useStaffAuth();
  const [petugasId, setPetugasId] = useState<number | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isStaffLoggedIn) {
      router.push("/login");
      return;
    }

    if (isStaffLoggedIn) {
      // Get petugas ID from profiles
      // In production, get from auth context
      const loadPetugasId = async () => {
        // Get first petugas or create one
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "petugas")
          .limit(1)
          .maybeSingle();

        if (profiles) {
          setPetugasId(profiles.id);
        } else {
          // Create default petugas if not exists
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({
              name: "Petugas",
              role: "petugas",
            })
            .select()
            .single();

          if (newProfile) {
            setPetugasId(newProfile.id);
          }
        }
        setLoading(false);
      };

      loadPetugasId();
    }
  }, [isStaffLoggedIn, authLoading, router]);

  if (authLoading || loading || !petugasId) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Chat List */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <h1 className="text-lg font-semibold text-gray-900">Chat Pasien</h1>
          <p className="text-xs text-gray-500">Daftar percakapan dengan pasien</p>
        </div>
        <ChatList
          petugasId={petugasId}
          onSelectChat={setSelectedChatId}
          selectedChatId={selectedChatId || undefined}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChatId ? (
          <div className="flex h-full flex-col">
            {/* Chat Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Chat dengan Pasien</h2>
            </div>
            {/* Chat Room */}
            <div className="flex-1 overflow-hidden">
              <ChatRoom
                chatId={selectedChatId}
                currentUserId={petugasId}
                currentUserRole="petugas"
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                Pilih chat untuk memulai percakapan
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Klik salah satu chat di sidebar untuk melihat pesan
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
