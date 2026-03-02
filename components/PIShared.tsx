import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ShadowStyle } from "./style/Shadow";
import { Text } from "@/components/Text";

// --- Shared Styles ---
export const piStyles = StyleSheet.create({
  // Field Container
  fieldContainer: {
    marginBottom: 25,
  },
  // Label Pill
  labelPill: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: "#f8f8fa",
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#aaa",
  },
  // Content Box (Used for both Text and TextInput)
  contentBox: {
    backgroundColor: "#f8f8fa",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    minHeight: 60,
    justifyContent: "center",
  },
});

// --- Reusable Notice Section ---
export function NoticeSection() {
  return (
    <View style={styles.noticeContainer}>
      {/* Title Row */}
      <View style={styles.noticeHeaderRow}>
        <Ionicons
          name="information-circle-outline"
          size={18}
          color="#888"
          style={{ marginRight: 4, marginTop: 1, marginLeft: -5 }}
        />
        <Text style={styles.noticeTitle}>유의사항</Text>
      </View>

      {/* Bullet 1 */}
      <View style={styles.bulletRow}>
        <Text style={styles.bulletPoint}>•</Text>
        <Text style={styles.noticeText}>
          이곳에서 설정한 개인정보는 도깨비불의 채팅 자동응답 생성에 활용됩니다.
        </Text>
      </View>

      {/* Bullet 2 */}
      <View style={styles.bulletRow}>
        <Text style={styles.bulletPoint}>•</Text>
        <Text style={styles.noticeText}>
          Memory는 주기적으로 AI에 의해 업데이트 됩니다.
        </Text>
      </View>
    </View>
  );
}

// --- Reusable Layout for a Field (Label + Box Wrapper) ---
export function PIFieldLayout({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={piStyles.fieldContainer}>
      <View style={[piStyles.labelPill, ShadowStyle.pill3d]}>
        <Text style={piStyles.labelText}>{label}</Text>
      </View>
      <View style={[piStyles.contentBox, ShadowStyle.pill3d]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  noticeContainer: {
    marginBottom: 30,
    marginTop: 10,
    paddingLeft: 16,
    paddingRight: 16,
  },
  noticeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  noticeTitle: {
    fontSize: 16,
    color: "#888",
    fontWeight: "600",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  bulletPoint: {
    fontSize: 14,
    color: "#999",
    marginRight: 8,
    lineHeight: 20,
  },
  noticeText: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
    flex: 1,
  },
});
