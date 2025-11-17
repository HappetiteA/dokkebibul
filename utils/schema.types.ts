import { Database } from "./database.types";

export type SelectNearbyUsersRequest = Database["public"]["Functions"]["select_nearby_users"]["Args"];
export type SelectNearbyUsersResponse = Database["public"]["Functions"]["select_nearby_users"]["Returns"]
