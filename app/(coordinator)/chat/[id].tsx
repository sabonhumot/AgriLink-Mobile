import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockEscalatedChats, mockChatMessages, type ChatMessage } from "@/data/coordinatorData";

export default function ChatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top } = useSafeAreaInsets();
  const [reply, setReply] = useState("");

  const chat = mockEscalatedChats.find((c) => c.id === id);
  const messages = id ? mockChatMessages[id] || [] : [];

  const triggerLabel = {
    no_response_6h: "No response from farmer in 6+ hours",
    no_response_1h_market_day: "No response from farmer in 1 hour (market day)",
    buyer_complaint: "Buyer raised a complaint",
  };

  if (!chat) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, color: Colors.textMuted }}>Chat not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <View style={[s.header, { paddingTop: top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>{chat.farmer} ↔ {chat.buyer}</Text>
          <Text style={s.headerSub}>{chat.issue}</Text>
        </View>
      </View>

      <View style={s.alertBar}>
        <Ionicons name="alert-circle" size={14} color={chat.priority === "high" ? Colors.error : Colors.accent} />
        <Text style={[s.alertText, { color: chat.priority === "high" ? Colors.error : Colors.accent }]}>
          {triggerLabel[chat.triggerReason]}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {messages.map((msg: ChatMessage) => (
          <View key={msg.id} style={[s.msgBubble, msg.senderRole === "coordinator" && s.msgCoordinator, msg.senderRole === "farmer" && s.msgFarmer, msg.senderRole === "buyer" && s.msgBuyer, msg.isInternalNote && s.msgInternal]}>
            {msg.isInternalNote && (
              <View style={s.internalHeader}>
                <Ionicons name="lock-closed" size={10} color={Colors.textMuted} />
                <Text style={s.internalLabel}>Internal Note</Text>
              </View>
            )}
            <Text style={[s.msgText, msg.senderRole === "coordinator" && s.msgTextCoordinator]}>{msg.text}</Text>
            <View style={s.msgBottom}>
              <Text style={[s.msgSender, msg.senderRole === "coordinator" && s.msgSenderCoordinator]}>{msg.senderName}</Text>
              <Text style={[s.msgTime, msg.senderRole === "coordinator" && s.msgTimeCoordinator]}>{msg.timestamp}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={s.replyBar}>
        <TouchableOpacity activeOpacity={0.7} style={s.noteBtn}>
          <Ionicons name="lock-closed" size={16} color={Colors.primary} />
          <Text style={s.noteBtnText}>Note</Text>
        </TouchableOpacity>
        <TextInput
          style={s.replyInput}
          value={reply}
          onChangeText={setReply}
          placeholder="Type your reply..."
          placeholderTextColor={Colors.placeholder}
        />
        <TouchableOpacity activeOpacity={0.7} style={s.sendBtn}>
          <Ionicons name="send" size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={s.actionBar}>
        <TouchableOpacity activeOpacity={0.8} style={s.resolveBtn}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
          <Text style={s.resolveBtnText}>Resolve</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={s.stepBackBtn}>
          <Ionicons name="arrow-undo" size={16} color={Colors.accent} />
          <Text style={s.stepBackBtnText}>Step Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = {
  header: { flexDirection: "row" as const, alignItems: "flex-start" as const, gap: 12, paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: "center" as const, justifyContent: "center" as const },
  headerTitle: { fontSize: 14, fontWeight: "700" as const, color: Colors.text },
  headerSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  alertBar: { flexDirection: "row" as const, alignItems: "center" as const, gap: 6, marginHorizontal: 16, backgroundColor: "#FEF3C7", borderRadius: 8, padding: 10, marginBottom: 8 },
  alertText: { fontSize: 11, fontWeight: "600" as const, flex: 1 },
  msgBubble: { maxWidth: "80%", borderRadius: 14, padding: 12, marginBottom: 10 },
  msgFarmer: { backgroundColor: Colors.surfaceAlt, alignSelf: "flex-start" as const, borderBottomLeftRadius: 4 },
  msgBuyer: { backgroundColor: Colors.white, alignSelf: "flex-start" as const, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.divider },
  msgCoordinator: { backgroundColor: Colors.primary, alignSelf: "flex-end" as const, borderBottomRightRadius: 4 },
  msgInternal: { backgroundColor: "#F3E8FF", alignSelf: "flex-end" as const, borderWidth: 1, borderColor: "#E9D5FF", maxWidth: "90%" },
  internalHeader: { flexDirection: "row" as const, alignItems: "center" as const, gap: 4, marginBottom: 4 },
  internalLabel: { fontSize: 9, fontWeight: "700" as const, color: Colors.textMuted, textTransform: "uppercase" as const },
  msgText: { fontSize: 13, color: Colors.text, lineHeight: 18 },
  msgTextCoordinator: { color: Colors.white },
  msgBottom: { flexDirection: "row" as const, justifyContent: "space-between" as const, marginTop: 6 },
  msgSender: { fontSize: 9, color: Colors.textMuted, fontWeight: "600" as const },
  msgSenderCoordinator: { color: "rgba(255,255,255,0.7)" },
  msgTime: { fontSize: 9, color: Colors.textMuted },
  msgTimeCoordinator: { color: "rgba(255,255,255,0.6)" },
  replyBar: { flexDirection: "row" as const, alignItems: "center" as const, gap: 8, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.divider },
  noteBtn: { flexDirection: "row" as const, alignItems: "center" as const, gap: 3, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.primarySurface },
  noteBtnText: { fontSize: 11, fontWeight: "600" as const, color: Colors.primary },
  replyInput: { flex: 1, backgroundColor: Colors.surfaceAlt, borderRadius: 10, paddingHorizontal: 14, height: 38, fontSize: 13, color: Colors.text },
  sendBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primary, alignItems: "center" as const, justifyContent: "center" as const },
  actionBar: { flexDirection: "row" as const, gap: 10, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.divider },
  resolveBtn: { flex: 1, flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 6, height: 42, borderRadius: 12, backgroundColor: Colors.successSurface },
  resolveBtnText: { fontSize: 13, fontWeight: "700" as const, color: Colors.success },
  stepBackBtn: { flex: 1, flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 6, height: 42, borderRadius: 12, backgroundColor: "#FEF3C7" },
  stepBackBtnText: { fontSize: 13, fontWeight: "700" as const, color: Colors.accent },
};
