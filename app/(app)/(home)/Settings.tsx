import { useRouter } from "expo-router";
import DefaultHeader from "@/components/DefaultHeader";
import { IGlobalSetting } from "@/components/interfaces";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Switch, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import ShadowWrap from "@/components/style/Shadow";
import { NeumorphicSwitch } from "@/components/style/Switch";

type SettingData = Omit<IGlobalSetting, "last_fetched">;

export default function Settings() {
  const { logout } = useAuthActions();
  const router = useRouter();
  const { profile } = useAuth();
  const user_id = profile?.user_id as string;
  const [settingData, setSettingData] = useState<SettingData>();
  const [isOn, setIsOn] = useState(false);

  const updateGlobalSetting = async (value: SettingData) => {
    setIsOn(value.AIenabled);

    const { error } = await supabase
      .from("profiles")
      .update({ is_ai_enabled: value.AIenabled })
      .eq("user_id", user_id);

    if (error) {
      console.error("Error while updating global setting", error.message);
      setIsOn(!value.AIenabled);
      return;
    }

    const failed = await updateStorageData(value);
    if (failed) {
      console.warn("Server updated but local cache write failed");
      return;
    }

    setSettingData(value);
  };

  const loadDataFromServer = () => {
    if (profile == null) {
      return false;
    }
    return profile.is_ai_enabled;
  };

  const updateStorageData = async (data: SettingData) => {
    try {
      const json: IGlobalSetting = {
        ...data,
        last_fetched: Date.now(),
      };
      const jsonStr = JSON.stringify(json);
      await AsyncStorage.setItem("GlobalSetting", jsonStr);
      return false;
    } catch (err: any) {
      Alert.alert("Asyncstorage Error", err.message);
      return true;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const storageData = await AsyncStorage.getItem("GlobalSetting");
        if (storageData == null) {
          // load data from server and save at local storage
          // need to make new key value pair
          const dataFromServer = loadDataFromServer();
          const failed = await updateStorageData({ AIenabled: dataFromServer });
          if (!failed) {
            setSettingData({ AIenabled: dataFromServer });
            setIsOn(dataFromServer);
          }
          return;
        }

        const GlobalSettingFromStorage = JSON.parse(
          storageData
        ) as IGlobalSetting;
        const ONE_DAY = 24 * 60 * 60 * 1000;
        // do not exist or expired
        if (
          GlobalSettingFromStorage == null ||
          GlobalSettingFromStorage.last_fetched < Date.now() - ONE_DAY
        ) {
          // load data from server and save at local storage
          // need to add new row
          const dataFromServer = loadDataFromServer();
          const failed = await updateStorageData({
            AIenabled: dataFromServer,
          });
          if (!failed) {
            setSettingData({ AIenabled: dataFromServer });
            setIsOn(dataFromServer);
          }
          return;
        }

        // can use asyncstorage data
        const { last_fetched, ...data } = GlobalSettingFromStorage;
        setSettingData(data);
        setIsOn(data.AIenabled);
      } catch (err: any) {
        console.error("Asyncstorage error", err.message);
      }
    })();
  }, [profile]);

  return (
    <>
      <DefaultHeader title="Settings" />
      <View style={styles.container}>
        <View>
          <View style={[styles.settingListElement, { marginTop: 40 }]}>
            <Text style={styles.h1}>기기 설정</Text>
          </View>
          <View style={styles.settingListElement}>
            <Text style={styles.h2}>푸시 알림</Text>
            <NeumorphicSwitch
              width={60}
              height={30}
              padding={5}
              value={isOn}
              onValueChange={() => {
                updateGlobalSetting({ AIenabled: !isOn });
              }}
              onColor="#93D7EA"
              offColor="#D7D7E2"
            />
          </View>
          <View style={styles.settingListElement}>
            <Text style={styles.h2}>위치 접근 허용</Text>
            <NeumorphicSwitch
              width={60}
              height={30}
              padding={5}
              value={isOn}
              onValueChange={() => {
                updateGlobalSetting({ AIenabled: !isOn });
              }}
              onColor="#93D7EA"
              offColor="#D7D7E2"
            />
          </View>
          <View style={styles.settingListElement}>
            <Text style={styles.h2}>앱 사용 중 알림</Text>
            <NeumorphicSwitch
              width={60}
              height={30}
              padding={5}
              value={isOn}
              onValueChange={() => {
                updateGlobalSetting({ AIenabled: !isOn });
              }}
              onColor="#93D7EA"
              offColor="#D7D7E2"
            />
          </View>

          <View style={[styles.settingListElement, { marginTop: 40 }]}>
            <Text style={styles.h1}>채팅 설정</Text>
          </View>
          <View style={styles.settingListElement}>
            <Text style={styles.h2}>백그라운드 AI 채팅</Text>
            <NeumorphicSwitch
              width={60}
              height={30}
              padding={5}
              value={isOn}
              onValueChange={() => {
                updateGlobalSetting({ AIenabled: !isOn });
              }}
              onColor="#93D7EA"
              offColor="#D7D7E2"
            />
          </View>

          <View style={[styles.settingListElement, { marginTop: 40 }]}>
            <Text style={styles.h1}>차단 목록 관리</Text>
            <TouchableOpacity
              onPress={() => {
                router.navigate("/BlocksList");
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.textButton, { marginRight: 10 }]}>
                  {" "}
                  30{" "}
                </Text>
                <Image
                  style={{ width: 16, height: 25 }}
                  resizeMode="contain"
                  source={require("../../../assets/from_figma/right_arrow.png")}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.settingListElement}>
            <Text style={styles.h1}>계정 관리</Text>
            <TouchableOpacity>
              <Text style={styles.textButton}>회원탈퇴</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 40 }}>
            <ShadowWrap>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  try {
                    await logout();
                  } catch (err: any) {
                    Alert.alert("Logout Error", err.message);
                  }
                }}
              >
                <Text style={styles.innerButtonText}>로그아웃</Text>
              </TouchableOpacity>
            </ShadowWrap>
          </View>

          <View
            style={[
              styles.settingListElement,
              { justifyContent: "space-evenly", marginTop: 20 },
            ]}
          >
            <TouchableOpacity>
              <Text style={styles.legalLinkText}>이용 약관</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.legalLinkText}>개인정보처리방침</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
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
    fontSize: 24,
    color: "#8F8F9A",
    fontWeight: "bold",
  },
  h2: {
    fontSize: 24,
    paddingHorizontal: 5,
    color: "#8F8F9A",
  },
  textButton: {
    fontSize: 20,
    color: "#B4B4B8",
  },
  legalLinkText: {
    fontSize: 15,
    color: "#B4B4B8",
  },
  innerButtonText: { textAlign: "center", fontSize: 20, color: "#8F8F9A" },
});
