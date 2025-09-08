import { Session, User } from "@supabase/supabase-js";

export type Profile = {
    id: string;
    is_initialized: boolean;
}

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  signOut: () => Promise<void>;
};
