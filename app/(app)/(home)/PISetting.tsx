import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradientHeader } from "@/components/Headers";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { NoticeSection, PIFieldLayout } from "@/components/PIShared";
import { ShadowStyle } from "@/components/style/Shadow";
import { SafeAreaView } from "react-native-safe-area-context";
import { EditIcon } from "@/components/style/Icons";
import { Text } from "@/components/Text";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { profile } = useAuth();

  const [data, setData] = useState({
    age: "",
    job: "",
    notes: "",
    memory: "",
  });

  // Fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        if (!profile?.user_id) return;

        const { data: personaData, error } = await supabase
          .from("personas")
          .select("age, job, memo")
          .eq("user_id", profile.user_id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching persona:", error);
        }

        if (isActive && personaData) {
          setData({
            age: personaData.age ? String(personaData.age) : "",
            job: personaData.job ?? "",
            notes: personaData.memo ?? "",
            memory: "", // Keeping blank as requested
          });
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [profile?.user_id]),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- HEADER --- */}
      <LinearGradientHeader
        title="개인정보 설정"
        rightComponent={
          <TouchableOpacity
            onPress={() => router.navigate("/(app)/(home)/EditPISetting")}
            style={[styles.editBtnCircle, ShadowStyle.pill3d]}
          >
            <EditIcon />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Shared Notice Section */}
        <NoticeSection />

        {/* Display Fields using Shared Layout */}
        <InfoDisplayField label="나이" value={data.age} />
        <InfoDisplayField label="직업" value={data.job} />
        <InfoDisplayField label="특이사항" value={data.notes} />
        <InfoDisplayField label="Memory" value={data.memory} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Sub-components ---

function InfoDisplayField({ label, value }: { label: string; value: string }) {
  return (
    <PIFieldLayout label={label}>
      <Text style={styles.contentText}>{value || "정보 없음"}</Text>
    </PIFieldLayout>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  // --- Header Styles ---
  headerWrapper: {
    zIndex: 10,
    backgroundColor: "#F8F9FA",
  },
  editBtnCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerFade: {
    position: "absolute",
    bottom: -20,
    left: 0,
    right: 0,
    height: 20,
  },

  // --- Content Styles ---
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // Text specific style (Layout wrapper handles the box and label)
  contentText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    fontWeight: "500",
  },
});
