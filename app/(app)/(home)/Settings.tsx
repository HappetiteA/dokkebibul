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
  const { profile } = useAuth();
  const user_id = profile?.user_id as string;
  const [settingData, setSettingData] = useState<SettingData>();
  const [isOn, setIsOn] = useState(false);

  const updateGlobalAISetting = (value: SettingData) => {
    (async () => {
      await updateStorageData(value);
      const { error } = await supabase
        .from("profiles")
        .update({ is_ai_enabled: value.AIenabled })
        .eq("user_id", user_id);

      if (error) {
        console.log(error);
      }
    })();
    setSettingData(value);
    setIsOn(value.AIenabled);
  };

  const loadDataFromServer = () => {
    if (profile == null) {
      return false;
    }
    return profile.is_ai_enabled;
  };

  const updateStorageData = async (data: SettingData) => {
    const json: IGlobalSetting = {
      ...data,
      last_fetched: Date.now(),
    };
    const jsonStr = JSON.stringify(json);
    try {
      await AsyncStorage.setItem("GlobalSetting", jsonStr);
    } catch {
      console.error("Error : updateStorageData");
    }
  };

  useEffect(() => {
    (async () => {
      const storageData = await AsyncStorage.getItem("GlobalSetting");
      if (storageData == null) {
        // load data from server and save at local storage
        // need to make new key value pair
        const dataFromServer = loadDataFromServer();
        updateStorageData({ AIenabled: dataFromServer });
        setSettingData({ AIenabled: dataFromServer });
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
        updateStorageData({ AIenabled: dataFromServer });
        setSettingData({ AIenabled: dataFromServer });
        setIsOn(dataFromServer);

        return;
      }

      // can use asyncstorage data
      const { last_fetched, ...data } = GlobalSettingFromStorage;
      setSettingData(data);
      setIsOn(data.AIenabled);
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
            updateGlobalAISetting({ AIenabled: !isOn });
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
        <TouchableOpacity>
          <Text>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
