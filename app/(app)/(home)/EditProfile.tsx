import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { getAvatarSource } from "@/utils/avatarColor";
import headerStyle from "@/components/style/commonStyle";
import { getAddressPublicity } from "@/services/geocode";
import { NeumorphicSwitch } from "@/components/style/Switch";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShadowStyle } from "@/components/style/Shadow";
import { updateMyProfile } from "@/services/supabase";
import { PillButton } from "@/components/style/Buttons";
import { ErrorModal } from "@/components/modals/ErrorModal";
import useModal from "@/hooks/useModal";

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
  const [canToggleLocation, setCanToggleLocation] = useState(false);

  const { open: openErrorModal, close: closeErrorModal } = useModal(ErrorModal);

  // Load initial location
  useEffect(() => {
    (async () => {
      const data = await getAddressPublicity();
      if (data) {
        setAddress(data.addr);
        setIsPublic(data.is_public);
        setCanToggleLocation(true);
      } else {
        setAddress("위치 정보 없음");
        setIsPublic(false);
      }
    })();
  }, []);

  const onSavePressed = async () => {
    if (!profile || !name) return;
    try {
      await updateMyProfile({
        p_is_public: isPublic,
        p_name: name,
        p_status_message: statusMessage,
      });
    } catch (err) {
      console.error(err);
      openErrorModal({
        onClose: closeErrorModal
      })
      return;
    }

    await refreshProfile();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={headerStyle.container}>
        <View style={headerStyle.content}>
          <View style={headerStyle.left}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color="#aaa" />
            </TouchableOpacity>
          </View>
          <View style={headerStyle.right} />
        </View>
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
              <View style={[styles.labelContainer, ShadowStyle.pill3d]}>
                <Text style={styles.labelText}>이름</Text>
              </View>
              <View style={[styles.inputContainer, ShadowStyle.pill3d]}>
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
              <View style={[styles.labelContainer, ShadowStyle.pill3d]}>
                <Text style={styles.labelText}>소개</Text>
              </View>
              <View
                style={[
                  styles.inputContainer,
                  styles.bioInputContainer,
                  ShadowStyle.pill3d,
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

            {/* --- LOCATION TOGGLE SECTION --- */}
            <View style={styles.locationContainer}>
              {/* ROW 1: Title + Switch (Aligned Center) */}
              <View style={styles.locationHeaderRow}>
                <Text style={styles.locationTitle}>도깨비불 공개</Text>

                <NeumorphicSwitch
                  width={54}
                  height={30}
                  padding={3}
                  value={isPublic}
                  onValueChange={() => setIsPublic((prev) => !prev)}
                  onColor="#99D8EE"
                  offColor="#D7D7E2"
                  disabled={!canToggleLocation}
                />
              </View>

              {/* ROW 2: Address (Below) */}
              <Text style={styles.locationAddress}>{address}</Text>
            </View>

            {/* Save Button */}
            <View style={styles.footerContainer}>
              <PillButton
                text="저장"
                onPress={onSavePressed}
                variant={name ? "blue" : "gray"}
                width={112}
                disabled={!name}
              />
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
  scrollContent: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
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
    borderRadius: 30,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 70,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8F8F9A",
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
    color: "#000000",
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
  locationContainer: {
    width: "85%",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 4,
  },

  // The Top Row (Title + Switch)
  locationHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // <--- Ensures Switch is centered with Title
    marginBottom: 4, // Spacing between Title and Address
  },

  locationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8F8F9A",
  },

  locationAddress: {
    fontSize: 14,
    color: "#8F8F9A",
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
    backgroundColor: "#99D8EE",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  saveButtonDisabled: {
    backgroundColor: "#E4E4EA",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
});
