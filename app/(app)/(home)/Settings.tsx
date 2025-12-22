import DefaultHeader from "@/components/DefaultHeader";
import { IAIenabled } from "@/components/interfaces";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";

export default function Settings() {
  const { logout } = useAuthActions();
  const { profile } = useAuth();
  const user_id = profile?.user_id as string;
  const [isOn, setIsOn] = useState(false);

  const updateGlobalAISetting = (value: boolean) => {
    setIsOn(value);

    (async () => {
      await updateStorageData(value);
      const { error } = await supabase
        .from("profiles")
        .update({ is_ai_enabled: value })
        .eq("user_id", user_id);

      if (error) {
        console.log(error);
      }
    })();
  };

  const loadDataFromServer = () => {
    if (profile == null) {
      return false;
    }
    return profile.is_ai_enabled;
  };

  const insertStorageData = async (aiEnabled: boolean) => {
    const newData: IAIenabled = {
      global: {
        enabled: aiEnabled,
        last_fetched: Date.now(),
      },
    };
    const jsonStr = JSON.stringify(newData);
    await AsyncStorage.setItem("AIenabled", jsonStr);
  };

  const updateStorageData = async (aiEnabled: boolean) => {
    const aiEnableDataFromStorage = await AsyncStorage.getItem("AIenabled");
    if (aiEnableDataFromStorage == null) {
      return;
    }

    const aiEnabledData = JSON.parse(aiEnableDataFromStorage) as IAIenabled;
    aiEnabledData["global"] = {
      enabled: aiEnabled,
      last_fetched: Date.now(),
    };
    const jsonStr = JSON.stringify(aiEnabledData);
    await AsyncStorage.setItem("AIenabled", jsonStr);
  };

  const resetStorageData = async () => {
    await AsyncStorage.removeItem("AIenabled");
  };

  useEffect(() => {
    (async () => {
      const aiEnableDataFromStorage = await AsyncStorage.getItem("AIenabled");
      if (aiEnableDataFromStorage == null) {
        // load data from server and save at local storage
        // need to make new key value pair
        const dataFromServer = loadDataFromServer();
        insertStorageData(dataFromServer);
        setIsOn(dataFromServer);
        return;
      }

      const aiEnabledData = JSON.parse(aiEnableDataFromStorage) as IAIenabled;
      const ONE_DAY = 24 * 60 * 60 * 1000;
      // do not exist or expired
      if (
        aiEnabledData["global"] == null ||
        aiEnabledData["global"].last_fetched < Date.now() - ONE_DAY
      ) {
        // load data from server and save at local storage
        // need to add new row
        const dataFromServer = loadDataFromServer();
        updateStorageData(dataFromServer);
        setIsOn(dataFromServer);
        return;
      }

      // can use asyncstorage data
      setIsOn(aiEnabledData["global"].enabled);
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
            updateGlobalAISetting(!isOn);
          }}
        ></Switch>
        <TouchableOpacity
          onPress={() => {
            resetStorageData();
          }}
        >
          <Text>RESET Asyncstorage</Text>
        </TouchableOpacity>
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
