import { useRouter } from "expo-router";
import DefaultHeader from "@/components/DefaultHeader";
import { IGlobalSetting } from "@/components/interfaces";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";

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
      <View>
        <Text>Global AI Enable</Text>
        <Switch
          value={isOn}
          onChange={() => {
            updateGlobalSetting({ AIenabled: !isOn });
          }}
        ></Switch>
        <TouchableOpacity
          onPress={async () => {
            try {
              await logout();
            } catch (err: any) {
              Alert.alert("Logout Error", err.message);
            }
          }}
        >
          <Text>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.navigate("/BlocksList");
          }}
        >
          <Text>차단 목록 관리</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
