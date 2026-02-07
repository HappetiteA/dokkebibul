import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function PersonalInfoScreen() {
  const router = useRouter();

  // Mock Data (Replace with your Context/DB data)
  const [data] = useState({
    age: "20대 후반\n남성",
    job: "대학생\n컴퓨터공학 전공",
    notes: "MBTI는 INTJ이고,\n조용한 카페에서 코딩하는 것을 좋아함.",
    memory: "사용자와의 이전 대화 기억...",
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- HEADER --- */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBtn}
          >
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>개인정보 설정</Text>

          {/* Edit Button -> Navigates to Edit Screen */}
          <TouchableOpacity
            onPress={() =>
              router.navigate("/(app)/(home)/PISetting/EditPISetting")
            }
            style={[
              styles.headerBtn,
              styles.editBtnCircle,
              styles.commonShadow,
            ]}
          >
            <Ionicons name="pencil" size={18} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Fade Gradient */}
        <LinearGradient
          colors={["#F8F9FA", "rgba(248, 249, 250, 0)"]}
          style={styles.headerFade}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <NoticeSection />

        <InfoDisplayField label="나이" value={data.age} />
        <InfoDisplayField label="직업" value={data.job} />
        <InfoDisplayField label="특이사항" value={data.notes} />
        <InfoDisplayField label="Memory" value={data.memory} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Sub-components for View Screen ---

function InfoDisplayField({ label, value }: { label: string, value: string }) {
  return (
    <View style={styles.fieldContainer}>
      <View style={[styles.labelPill, styles.commonShadow]}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <View style={[styles.contentBox, styles.commonShadow]}>
        <Text style={styles.contentText}>{value || "정보 없음"}</Text>
      </View>
    </View>
  );
}

function NoticeSection() {
  return (
    <View style={styles.noticeContainer}>
      <View style={styles.noticeRow}>
        <Ionicons name="information-circle-outline" size={16} color="#888" style={{ marginTop: 2 }} />
        <Text style={styles.noticeTitle}> 유의사항</Text>
      </View>
      <Text style={styles.noticeText}>• 이곳에서 설정한 개인정보는 도깨비불의 채팅 자동응답 생성에 활용됩니다.</Text>
      <Text style={styles.noticeText}>• Memory는 주기적으로 AI에 의해 업데이트 됩니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  
  // Header
  headerWrapper: { zIndex: 10, backgroundColor: "#F8F9FA" },
  headerContainer: {
    height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#000" },
  headerBtn: { padding: 5 },
  editBtnCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
  },
  headerFade: { position: 'absolute', bottom: -20, left: 0, right: 0, height: 20 },

  // Content
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  noticeContainer: { marginBottom: 30, paddingLeft: 4 },
  noticeRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  noticeTitle: { fontSize: 14, color: "#888", fontWeight: "600" },
  noticeText: { fontSize: 13, color: "#999", lineHeight: 20, marginBottom: 4, paddingLeft: 10 },

  // Fields
  fieldContainer: { marginBottom: 25 },
  labelPill: { alignSelf: "flex-start", paddingVertical: 6, paddingHorizontal: 16, borderRadius: 16, marginBottom: 10, backgroundColor: "#fff" },
  labelText: { fontSize: 15, fontWeight: "600", color: "#888" },
  contentBox: { backgroundColor: "#fff", borderRadius: 20, padding: 20, minHeight: 60, justifyContent: "center" },
  contentText: { fontSize: 16, color: "#333", lineHeight: 24 },

  // Shadow
  commonShadow: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
});
