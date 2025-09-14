import { Database } from "./database.types";
import { supabase } from "./supabase";

export type Profile = Database['public']['Tables']['profiles']['Row'];
