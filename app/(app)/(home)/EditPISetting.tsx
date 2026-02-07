import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import DefaultHeader from "@/components/DefaultHeader";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { NoticeSection, PIFieldLayout, piStyles } from "@/components/PIShared";

export default function EditPISetting() {
  const router = useRouter();
  const { profile } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    age: "",
    job: "",
    notes: "",
    memory: "",
  });

  // 1. Fetch Existing Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.user_id) return;
      setLoading(true);

      const { data: personaData, error } = await supabase
        .from("personas")
        .select("age, job, memo")
        .eq("user_id", profile.user_id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching persona:", error);
      } else if (personaData) {
        setData({
          age: personaData.age ? String(personaData.age) : "",
          job: personaData.job ?? "",
          notes: personaData.memo ?? "",
          memory: "", // Keeping memory blank as per instructions, or load it if you want
        });
      }
      setLoading(false);
    };

    fetchData();
  }, [profile?.user_id]);

  // 2. Handle Text Change
  const handleChange = (key: keyof typeof data, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // 3. Save to Supabase
  const onSave = async () => {
    if (!profile?.user_id) return;

    // Convert age back to number (handle empty string safely)
    const ageInt = data.age ? parseInt(data.age, 10) : null;

    const { error } = await supabase.from("personas").upsert({
      user_id: profile.user_id,
      age: ageInt,
      job: data.job,
      memo: data.notes,
    });

    if (error) {
      console.error("Save error:", error);
      Alert.alert("저장 실패", "데이터를 저장하는 중 문제가 발생했습니다.");
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- HEADER --- */}
      <View style={styles.headerWrapper}>
        <DefaultHeader
          title="개인정보 설정"
          // No Right Component in Edit Mode
        />
        <LinearGradient
          colors={["#F8F9FA", "rgba(248, 249, 250, 0)"]}
          style={styles.headerFade}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <NoticeSection />

            <InfoInputField
              label="나이"
              value={data.age}
              onChangeText={(t) => handleChange("age", t)}
              placeholder="예: 20대 후반"
              keyboardType="numeric"
            />
            <InfoInputField
              label="직업"
              value={data.job}
              onChangeText={(t) => handleChange("job", t)}
              placeholder="예: 대학생"
            />
            <InfoInputField
              label="특이사항"
              value={data.notes}
              onChangeText={(t) => handleChange("notes", t)}
              placeholder="예: MBTI는 INTJ..."
            />
            <InfoInputField
              label="Memory"
              value={data.memory}
              onChangeText={(t) => handleChange("memory", t)}
              placeholder="내용 입력..."
            />

            {/* Save Button */}
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={onSave}
              >
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InfoInputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <PIFieldLayout label={label}>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#ccc"
        multiline
        textAlignVertical="center"
        keyboardType={keyboardType}
      />
    </PIFieldLayout>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerWrapper: {
    zIndex: 10,
    backgroundColor: "#F8F9FA",
  },
  headerFade: {
    position: "absolute",
    bottom: -20,
    left: 0,
    right: 0,
    height: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  // Input specific style
  textInput: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    // Ensure input takes up space even if empty
    minHeight: 24,
  },
  // Footer
  footerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    backgroundColor: "#99D8EE",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333", // Or #fff depending on preference
  },
});
