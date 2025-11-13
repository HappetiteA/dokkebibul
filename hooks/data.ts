import { supabase } from "@/utils/supabase";
import { SelectNearbyUsersResponse } from "@/utils/schema.types";


export async function getNearbyUsers(
  lat: number | undefined,
  lon: number | undefined,
  maxDistance: number
): Promise<SelectNearbyUsersResponse> {
  if (!lat || !lon) {
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

export const getFollowings = async () => {
  try {
    let { data, error } = await supabase.rpc("select_followings");
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

export const getChatRooms = async () => {
  try {
    let { data, error } = await supabase.rpc("select_conversations");
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
  let { data, error } = await supabase.rpc("select_profile_by_user_id", {
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

