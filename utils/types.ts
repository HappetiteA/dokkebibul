import type { Dispatch, SetStateAction } from "react";
import { Session, User } from "@supabase/supabase-js";

export type Profile = {
    user_id: string;
    coins: number;
    name: string;
    is_ai_enabled: boolean;
}

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  setProfile: Dispatch<SetStateAction<Profile | null>>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};
