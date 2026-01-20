import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function ProfileEditScreen() {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();

  // State for inputs
  const [name, setName] = useState(profile ? profile.name : "");
  const [bio, setBio] = useState(profile ? profile?.status_message : "");

  const onSavePressed = async () => {
    if (!profile) return;
    if (!name) return;
    const { error } = await supabase
      .from("profiles")
      .update({ name: name, status_message: bio })
      .eq("user_id", profile?.user_id);
    if (error) {
      console.error(error);
    }
    console.log("Saved:", name, bio);
    await refreshProfile();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Keyboard Handling Wrapper */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Avatar Section */}
            <View style={styles.avatarContainer}>
              <Image
                source={require("@/assets/from_figma/icon-wisp-list.png")}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>

            {/* --- NAME INPUT ROW --- */}
            <View style={styles.inputRow}>
              {/* Label */}
              <View style={[styles.labelContainer, styles.commonShadow]}>
                <Text style={styles.labelText}>이름</Text>
              </View>

              {/* Input Field */}
              <View style={[styles.inputContainer, styles.commonShadow]}>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="이름을 입력하세요"
                  placeholderTextColor="#ccc"
                />
                {name.length > 0 && (
                  <TouchableOpacity onPress={() => setName("")}>
                    {/* CHANGED: Simple gray cross icon */}
                    <Ionicons name="close" size={18} color="#aaa" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* --- BIO INPUT ROW (Multiline) --- */}
            <View style={styles.inputRow}>
              {/* Label */}
              <View style={[styles.labelContainer, styles.commonShadow]}>
                <Text style={styles.labelText}>소개</Text>
              </View>

              {/* Input Field */}
              <View
                style={[
                  styles.inputContainer,
                  styles.bioInputContainer,
                  styles.commonShadow,
                ]}
              >
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="자기소개를 입력하세요"
                  placeholderTextColor="#ccc"
                  multiline
                  textAlignVertical="top" // Android fix for multiline
                />
                {bio.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setBio("")}
                    style={{ marginTop: 4 }}
                  >
                    {/* CHANGED: Simple gray cross icon */}
                    <Ionicons name="close" size={18} color="#aaa" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* --- SAVE BUTTON --- */}
            <View style={styles.footerContainer}>
              <TouchableOpacity
                // CHANGED: Removed commonShadow, applied specific styles
                style={[styles.commonShadow, styles.saveButton]}
                onPress={onSavePressed}
              >
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    height: 50,
    paddingHorizontal: 16,
    justifyContent: "center",
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },

  // --- REUSABLE SHADOW (For Inputs only now) ---
  commonShadow: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },

  // Avatar
  avatarContainer: {
    marginBottom: 40,
    marginTop: 20,
  },
  avatarImage: {
    width: 120,
    height: 120,
  },

  // Input Rows
  inputRow: {
    flexDirection: "row",
    width: "85%",
    marginBottom: 20,
    alignItems: "flex-start",
  },

  // Label Styling (Left side)
  labelContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 70,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  // Input Box Styling (Right side)
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginRight: 8,
    paddingVertical: 0, // Fix alignment issues on Android
  },

  // Specific styles for Bio (Multiline)
  bioInputContainer: {
    height: 100,
    alignItems: "flex-start",
    paddingTop: 14,
  },
  multilineInput: {
    height: "100%",
    textAlignVertical: "top",
  },

  // Footer / Save Button
  footerContainer: {
    // CHANGED: Increased margin to push it further down
    marginTop: 120,
    width: "100%",
    alignItems: "center",
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    // CHANGED: Gray background with thick white border
    backgroundColor: "#E4E4EA",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555", // Slightly darker gray text
  },
});
