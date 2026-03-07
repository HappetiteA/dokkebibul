import { useRouter, useFocusEffect } from "expo-router";
import DefaultHeader from "@/components/Headers";
import { useAuthActions } from "@/hooks/useAuthActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Linking, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { ShadowStyle } from "@/components/style/Shadow";
import { NeumorphicSwitch } from "@/components/style/Switch";
import { getBlocks } from "@/services/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { BGStyle } from "@/components/style/commonStyle";
import { useGlobalSetting } from "@/contexts/GlobalSettingContext";
import { Text } from "@/components/Text";
import { PRIVACY_URL, USE_URL } from "@/dev/constants";

export default function Settings() {
  const { logout } = useAuthActions();
  const router = useRouter();
  const { globalSetting, setAIenabled, setNotiEnabled } = useGlobalSetting();
  const [blockNum, setBlockNum] = useState<number>();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const blockData = await getBlocks();
        setBlockNum(blockData?.length);
      })();
    }, []),
  );

  return (
    <SafeAreaView style={BGStyle.BG}>
      <DefaultHeader title="설정" />
      <View style={styles.container}>
        {globalSetting ? (
          <View style={{ height: "100%" }}>
            <View style={[styles.settingListElement, { marginTop: 40 }]}>
              <Text weight="bold" style={styles.h1}>
                알림 설정
              </Text>
            </View>
            <View style={styles.settingListElement}>
              <Text style={styles.h2}>푸시 알림</Text>
              <NeumorphicSwitch
                width={54}
                height={30}
                padding={3}
                value={globalSetting.noti_enabled}
                onValueChange={() => {
                  setNotiEnabled(!globalSetting.noti_enabled);
                }}
                onColor="#93D7EA"
                offColor="#D7D7E2"
              />
            </View>

            <View style={[styles.settingListElement, { marginTop: 40 }]}>
              <Text weight="bold" style={styles.h1}>
                채팅 설정
              </Text>
            </View>
            <View style={styles.settingListElement}>
              <Text style={styles.h2}>백그라운드 AI 채팅</Text>
              <NeumorphicSwitch
                width={54}
                height={30}
                padding={3}
                value={globalSetting.ai_enabled}
                onValueChange={() => {
                  setAIenabled(!globalSetting.ai_enabled);
                }}
                onColor="#93D7EA"
                offColor="#D7D7E2"
              />
            </View>

            <View style={[styles.settingListElement, { marginTop: 40 }]}>
              <Text weight="bold" style={styles.h1}>
                차단 목록 관리
              </Text>
              <TouchableOpacity
                onPress={() => {
                  router.navigate("/BlocksList");
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={[styles.textButton, { marginRight: 10 }]}>
                    {blockNum}
                  </Text>
                  <Image
                    style={{ width: 12, height: 22 }}
                    resizeMode="contain"
                    source={require("@/assets/from_figma/right_arrow.png")}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.settingListElement, { marginTop: 10 }]}>
              <Text weight="bold" style={styles.h1}>
                개인 정보 설정
              </Text>
              <TouchableOpacity
                onPress={() => {
                  router.navigate("/PISetting");
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{ width: 12, height: 22 }}
                    resizeMode="contain"
                    source={require("@/assets/from_figma/right_arrow.png")}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.settingListElement}>
              <Text weight="bold" style={styles.h1}>
                계정 관리
              </Text>
              <TouchableOpacity
                onPress={() => {
                  router.navigate("/(app)/(home)/DeleteAccount");
                }}
              >
                <Text style={styles.textButton}>회원탈퇴</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: "absolute",
                justifyContent: "space-between",
                bottom: "20%",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <TouchableOpacity
                style={[styles.button, ShadowStyle.pill3d]}
                onPress={async () => {
                  try {
                    await logout();
                  } catch (err: any) {
                    Alert.alert("Logout Error", err.message);
                    return;
                  }
                  try {
                    await AsyncStorage.clear();
                  } catch (err: any) {
                    console.warn("AsyncStorage clear failed", err.message);
                  }
                }}
              >
                <Text style={styles.innerButtonText}>로그아웃</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.settingListElement,
                {
                  position: "absolute",
                  justifyContent: "space-between",
                  bottom: "10%",
                  alignItems: "center",
                  width: "50%",
                  alignSelf: "center",
                },
              ]}
            >
              <TouchableOpacity onPress={() => Linking.openURL(USE_URL)}>
                <Text style={styles.legalLinkText}>이용 약관</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_URL)}>
                <Text style={styles.legalLinkText}>개인정보처리방침</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8FA",
    height: "100%",
  },
  settingListElement: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    marginHorizontal: "auto",
    marginVertical: 10,
    justifyContent: "space-between",
  },

  button: {
    backgroundColor: "#F8F8FA",
    borderRadius: 30,
    marginVertical: 10,
    width: 180,
    marginHorizontal: "auto",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  h1: {
    fontSize: 20,
    color: "#8F8F9A",
  },
  h2: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: "#8F8F9A",
  },
  textButton: {
    fontSize: 18,
    color: "#B4B4B8",
  },
  legalLinkText: {
    fontSize: 15,
    color: "#B4B4B8",
  },
  innerButtonText: { textAlign: "center", fontSize: 18, color: "#535361" },
});
