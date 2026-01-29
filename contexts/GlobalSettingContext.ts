import { ChatRoomVM, GlobalSetting } from "@/components/interfaces";
import { createContext, useContext } from "react";

export type GlobalSettingContextValue = {
  globalSetting?: GlobalSetting;
  setGlobalSetting: React.Dispatch<
    React.SetStateAction<GlobalSetting | undefined>
  >;
  setAIenabled: (value: boolean) => void;
  setNotiEnabled: (value: boolean) => void;
};

export const GlobalSettingContext =
  createContext<GlobalSettingContextValue | null>(null);

export function useGlobalSetting() {
  const ctx = useContext(GlobalSettingContext);
  if (!ctx)
    throw new Error(
      "useGlobalSetting must be used within GlobalSettingContext",
    );
  return ctx;
}
