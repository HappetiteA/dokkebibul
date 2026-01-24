import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getAvatarSource } from "@/utils/avatarColor";
import { getAddressPublicity } from "@/services/geocode";
import { NeumorphicSwitch } from "@/components/style/Switch";

export default function ProfileEditScreen() {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();

  // State
  const [name, setName] = useState(profile?.name ?? "");
  const [statusMessage, setStatusMessage] = useState(
    profile?.status_message ?? "",
  );
  const [isPublic, setIsPublic] = useState(false);
  const [address, setAddress] = useState("위치 정보 불러오는 중...");

  // Load initial location
  useEffect(() => {
    (async () => {
      const data = await getAddressPublicity();
      if (data) {
        setAddress(data.addr);
        setIsPublic(data.is_public);
      } else {
        setAddress("위치 정보 없음");
        setIsPublic(false);
      }
    })();
  }, []);

  const onSavePressed = async () => {
    if (!profile || !name) return;

    const { error } = await supabase
      .from("locations")
      .update({ is_public: isPublic })
      .eq("user_id", profile.user_id);

    const { error: error2 } = await supabase
      .from("profiles")
      .update({ name: name, status_message: statusMessage })
      .eq("user_id", profile.user_id);

    if (error || error2) return;

    await refreshProfile();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#aaa" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.scrollContent}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <Image
                source={getAvatarSource(profile?.color_code)}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>

            {/* Name Input */}
            <View style={styles.inputRow}>
              <View style={[styles.labelContainer, styles.commonShadow]}>
                <Text style={styles.labelText}>이름</Text>
              </View>
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
                    <Ionicons name="close" size={18} color="#aaa" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Bio Input */}
            <View style={styles.inputRow}>
              <View style={[styles.labelContainer, styles.commonShadow]}>
                <Text style={styles.labelText}>소개</Text>
              </View>
              <View
                style={[
                  styles.inputContainer,
                  styles.bioInputContainer,
                  styles.commonShadow,
                ]}
              >
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={statusMessage}
                  onChangeText={setStatusMessage}
                  placeholder="자기소개를 입력하세요"
                  placeholderTextColor="#ccc"
                  multiline
                  textAlignVertical="top"
                />
                {statusMessage.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setStatusMessage("")}
                    style={{ marginTop: 4 }}
                  >
                    <Ionicons name="close" size={18} color="#aaa" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* --- LOCATION TOGGLE ROW (FIXED) --- */}
            <View style={styles.locationRow}>
              {/* Text Container: Uses flex: 1 to push against the switch but wrap text */}
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationTitle}>도깨비불 공개</Text>
                <Text style={styles.locationAddress}>{address}</Text>
              </View>

              {/* Switch: Remains fixed size on the right */}
              <NeumorphicSwitch
                width={54}
                height={30}
                padding={3}
                value={isPublic}
                onValueChange={() => setIsPublic((prev) => !prev)}
                onColor="#87CEFA"
                offColor="#D7D7E2"
              />
            </View>

            {/* Save Button */}
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={[styles.commonShadow, styles.saveButton]}
                onPress={onSavePressed}
              >
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  commonShadow: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 40,
    marginTop: 20,
  },
  avatarImage: {
    width: 120,
    height: 120,
  },
  inputRow: {
    flexDirection: "row",
    width: "85%",
    marginBottom: 20,
    alignItems: "flex-start",
  },
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
    paddingVertical: 0,
  },
  bioInputContainer: {
    height: 100,
    alignItems: "flex-start",
    paddingTop: 14,
  },
  multilineInput: {
    height: "100%",
    textAlignVertical: "top",
  },

  // --- UPDATED LOCATION STYLES ---
  locationRow: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Keeps switch vertically centered with the text block
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  locationTextContainer: {
    flex: 1, // Takes all width except what the Switch needs
    marginRight: 20, // Adds gap so text doesn't touch the switch
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: "#aaa",
    // No explicit width needed here; 'flex: 1' on parent handles the wrapping
  },

  footerContainer: {
    marginTop: 80,
    width: "100%",
    alignItems: "center",
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    backgroundColor: "#E4E4EA",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
});
