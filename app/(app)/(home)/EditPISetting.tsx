import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradientHeader } from "@/components/Headers";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { NoticeSection, PIFieldLayout } from "@/components/PIShared";
import { PillButton } from "@/components/style/Buttons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditPISetting() {
  const router = useRouter();
  const { profile } = useAuth();

  const [data, setData] = useState({
    age: "",
    job: "",
    notes: "",
    memory: "",
  });

  // Fetch logic ... (Same as before)
  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.user_id) return;
      const { data: personaData } = await supabase
        .from("personas")
        .select("age, job, memo")
        .eq("user_id", profile.user_id)
        .maybeSingle();

      if (personaData) {
        setData({
          age: personaData.age ? String(personaData.age) : "",
          job: personaData.job ?? "",
          notes: personaData.memo ?? "",
          memory: "",
        });
      }
    };
    fetchData();
  }, [profile?.user_id]);

  const onSave = async () => {
    // ... Save logic (Same as before)
    if (!profile?.user_id) return;
    const ageInt = data.age ? parseInt(data.age, 10) : null;
    const { error } = await supabase.from("personas").upsert({
      user_id: profile.user_id,
      age: ageInt,
      job: data.job,
      memo: data.notes,
    });
    if (!error) router.back();
  };

  const handleChange = (key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradientHeader title="개인정보 설정" />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        keyboardShouldPersistTaps={"handled"}
        enableResetScrollToCoords={false}
      >
        <NoticeSection />

        <InfoInputField
          label="나이"
          value={data.age}
          onChangeText={(t) => handleChange("age", t)}
          placeholder="예: 20대 후반"
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

        <View style={styles.footerContainer}>
          <PillButton
            text="저장"
            onPress={onSave}
            variant="blue"
            width={130}
            height={45}
          />
        </View>

        <View style={{ height: 40 }} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

function InfoInputField({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
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
        textAlignVertical="top"
        scrollEnabled={false} // Prevents infinite height expansion
      />
    </PIFieldLayout>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  textInput: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    minHeight: 24,
    // REMOVED: height: "100%" -> This caused the infinite loop
    paddingTop: 0,
    paddingBottom: 0,
  },
  footerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
