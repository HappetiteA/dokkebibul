import { supabase } from "@/lib/supabase";
import {
  SelectNearbyUsersResponse,
  SelectFollowingsResponse,
  SelectFollowersResponse,
  SelectBlocksResponse,
  SelectMyLocationResponse,
} from "@/types/orm.types";

type Coords = {
  lat: number;
  lon: number;
};

export async function getNearbyUsers(
  lat: number | undefined,
  lon: number | undefined,
  maxDistance: number,
): Promise<SelectNearbyUsersResponse> {
  if (lat == null || lon == null) {
    console.error("Error fetching current location");
    return [];
  }
  const { data, error } = await supabase.rpc("select_nearby_users", {
    ref_lat: lat,
    ref_lon: lon,
    max_distance: maxDistance,
  });

  if (error) {
    console.error("Error fetching nearby users:", error);
    return [];
  }
  return data;
}

export async function getMyLocation() {
  const { data, error } = await supabase.rpc("select_my_location");
  if (error || !data || data.length === 0) return null;
  return data[0];
}

export async function getFollowings(): Promise<SelectFollowingsResponse> {
  try {
    const { data, error } = await supabase.rpc("select_followings");
    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }
    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return [];
  }
}

export async function getFollowers(): Promise<SelectFollowersResponse> {
  try {
    const { data, error } = await supabase.rpc("select_followers");
    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }
    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return [];
  }
}

export async function getBlocks(): Promise<SelectBlocksResponse> {
  try {
    const { data, error } = await supabase.rpc("select_blocks");
    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }
    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return [];
  }
}

export const getChatRooms = async () => {
  try {
    const { data, error } = await supabase.rpc("select_conversations");
    if (error) {
      console.error("Error fetching data:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const getProfileById = async (user_id: string) => {
  const { data, error } = await supabase.rpc("select_profile_by_user_id", {
    uid: user_id,
  });
  if (error) {
    console.error(error);
    return null;
  } else if (data == null) {
    console.log("Profile Data is Null");
    return null;
  } else {
    return data[0];
  }
};

export const getConversationIdbyUserId = async (id1: string, id2: string) => {
  const user1_id = id1 < id2 ? id1 : id2;
  const user2_id = id1 > id2 ? id1 : id2;
  const { data, error } = await supabase
    .from("conversations")
    .select("id")
    .eq("user1_id", user1_id)
    .eq("user2_id", user2_id)
    .single();
  if (error || !data) {
    console.log("no conversation id found");
    return undefined;
  }
  return data.id;
};

export const reverseGeocode = async (lat: number, lon: number) => {
  try {
    const { data, error } = await supabase.functions.invoke("reverse-geocode", {
      body: { lat: lat, lon: lon },
    });

    if (error) throw error;

    return data.address;
  } catch (err) {
    throw err;
  }
};
