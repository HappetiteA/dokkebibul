import { useEffect, useMemo, useRef, useState } from "react";
import { GlobalSettingContext } from "./GlobalSettingContext";
import { GlobalSetting } from "@/components/interfaces";
import { useAuth } from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";

export function GlobalSettingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useAuth();
  const initRef = useRef(false);
  const snapshotRef = useRef<GlobalSetting | null>(null);
  const [globalSetting, setGlobalSetting] = useState<GlobalSetting>();

  useEffect(() => {
    if (!profile) {
      console.log("Cannot load setting data : user not authenticated");
      return;
    }

    (async () => {
      try {
        const storageData = await AsyncStorage.getItem(
          `GlobalSetting:${profile.user_id}`,
        );
        if (storageData == null) {
          const globalSetting: GlobalSetting = {
            ai_enabled: profile.is_ai_enabled,
            noti_enabled: true /* profile?.noti_enabled */,
          };

          try {
            await AsyncStorage.setItem(
              `GlobalSetting:${profile.user_id}`,
              JSON.stringify(globalSetting),
            );
            setGlobalSetting(globalSetting);
            initRef.current = true;
          } catch (err: any) {
            Alert.alert("Asyncstorage Error", err.message);
          }
          return;
        }

        try {
          let globalSettingFromStorage = JSON.parse(
            storageData,
          ) as GlobalSetting;
          setGlobalSetting(globalSettingFromStorage);
          initRef.current = true;
        } catch (err: any) {
          Alert.alert("ChatRoomData parsing error", err.message);
        }
      } catch (err: any) {}
    })();
  }, [profile]);

  useEffect(() => {
    if (!initRef.current) return;
    if (!profile) return;
    if (!globalSetting) return;

    (async () => {
      try {
        await AsyncStorage.setItem(
          `GlobalSetting:${profile.user_id}`,
          JSON.stringify(globalSetting),
        );
      } catch {
        console.error("AsyncStorage Error : cannot save chat room data");
      }
    })();
  }, [globalSetting]);

  const setAIenabled = (value: boolean) => {
    if (!globalSetting) {
      console.error(`GlobalSetting does not exists`);
      return;
    }
    snapshotRef.current = globalSetting;

    const toServer = {
      ...globalSetting,
      ai_enabled: value,
    };

    setGlobalSetting((c) => {
      if (!c) return c;

      return {
        ...c,
        ai_enabled: value,
      };
    });

    patchGlobalSettingOnServer(toServer).catch((e: any) => {
      const status = e?.status;
      if (typeof status === "number" && status >= 400 && status < 500) {
        const snap = snapshotRef.current;
        if (snap) setGlobalSetting(snap);
      } else {
        // 네트워크/5xx는 롤백 안 하고 두는 쪽이 일반적
        // (원하면 여기서 Alert 정도만)
        console.warn(
          "Warning : network error occured when patching conversation setting",
        );
      }
    });
  };

  const setNotiEnabled = (value: boolean) => {
    /*
    if (!globalSetting) {
      console.error(`GlobalSetting does not exists`);
      return;
    }
    snapshotRef.current = globalSetting;

    const toServer = {
      ...globalSetting,
      noti_enabled: value,
    };

    setGlobalSetting((c) => {
      if (!c) return c;

      return {
        ...c,
        noti_enabled: value,
      };
    });

    
    patchGlobalSettingOnServer(toServer).catch((e: any) => {
      const status = e?.status;
      if (typeof status === "number" && status >= 400 && status < 500) {
        const snap = snapshotRef.current;
        if (snap) setGlobalSetting(snap);
      } else {
        // 네트워크/5xx는 롤백 안 하고 두는 쪽이 일반적
        // (원하면 여기서 Alert 정도만)
        console.warn(
          "Warning : network error occured when patching conversation setting",
        );
      }
    });*/
  };

  const patchGlobalSettingOnServer = async (newData: GlobalSetting) => {
    if (!newData) return;
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        is_ai_enabled: newData.ai_enabled,
        /* noti_enabled : newData.noti_enabled */
      })
      .eq("user_id", profile.user_id);
    if (error) throw error;
  };

  const value = useMemo(
    () => ({
      globalSetting,
      setGlobalSetting,
      setAIenabled,
      setNotiEnabled,
    }),
    [globalSetting],
  );
  return (
    <GlobalSettingContext.Provider value={value}>
      {children}
    </GlobalSettingContext.Provider>
  );
}
