import { Database } from "./database.types";

export type SelectNearbyUsersRequest = Database["public"]["Functions"]["select_nearby_users"]["Args"];
export type SelectNearbyUsersResponse = Database["public"]["Functions"]["select_nearby_users"]["Returns"]

export type SelectFollowingsRequest = Database["public"]["Functions"]["select_followings"]["Args"];
export type SelectFollowingsResponse = Database["public"]["Functions"]["select_followings"]["Returns"];

export type SelectFollowersRequest =
  Database["public"]["Functions"]["select_followers"]["Args"];
export type SelectFollowersResponse =
  Database["public"]["Functions"]["select_followers"]["Returns"];

export type SelectBlocksRequest =
  Database["public"]["Functions"]["select_blocks"]["Args"];
export type SelectBlocksResponse =
  Database["public"]["Functions"]["select_blocks"]["Returns"];

export type SelectMyLocationRequest =
  Database["public"]["Functions"]["select_my_location"]["Args"];
export type SelectMyLocationResponse =
  Database["public"]["Functions"]["select_my_location"]["Returns"];

export type UpdateMyProfileRequest = Database["public"]["Functions"]["update_user_profile_and_location"]["Args"];
