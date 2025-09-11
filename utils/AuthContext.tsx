import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AppState, Platform } from "react-native";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { Profile, AuthContextType } from "@/utils/types";
import { getPushTokenAsync, sendTokenToDBAsync } from "./registerPushToken";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
      switch (_event) {
        case "INITIAL_SESSION":
          break;

        case "SIGNED_IN":
          console.log("User signed in:", newSession?.user?.id);
          break;

        case "SIGNED_OUT":
          console.log("User signed out or refresh token invalid");
          setProfile(null);
          break;

        case "TOKEN_REFRESHED":
          console.log("Token was refreshed successfully");
          break;
  ``
        case "USER_UPDATED":
          console.log("User profile updated:", newSession?.user);
          break;

        default:
          console.log("Unhandled event:", _event);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        if (error) console.error("getSession error:", error);

        setSession(initialSession ?? null);
        setUser(initialSession?.user ?? null);
      } catch (err) {
        console.error("Auth init error:", err);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Profile fetch error:", error);
          setProfile(null);
        } else if (!data) {
          console.log("Profile not initialized: redirecting to onboarding...")
          setProfile(null)
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error("Unexpected profile fetch error:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);


  useEffect(() => {
    if (Platform.OS === "web") return;

    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });

    return () => listener.remove();
  }, []);

  useEffect(() => {
    if (user && profile) {
      getPushTokenAsync()
        .then(token => 
          {
            token && sendTokenToDBAsync(user.id, token);
          }
        )
        .catch((err: any) => console.error("Push token error: ", err))
    }
  }, [user, profile]);


  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, setProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
