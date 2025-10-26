import { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
