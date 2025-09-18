import { supabase } from "@/utils/supabase";

interface ILocation {
  latitude: number;
  longitude: number;
}

interface IOtherLocation {
  location: string;
  updated_at: string;
  user_id: string;
}

export const getNearbyWisps = async (user_id: string) => {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .neq("user_id", user_id);

    if (error) {
      console.error("Error fetching data:", error);
      return null;
    }

    console.log("All rows:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const addNewAvatar = (location: ILocation) => {};
// async (location: ILocation) => {
//   const {
//     data: { session },
//     error: sessionError,
//   } = await supabase.auth.getSession();

//   if (sessionError) {
//     console.error(sessionError);
//     return;
//   }

//   const id = session?.user.id;

//   const { error } = await supabase.from("location").insert({
//     id: id,
//     latitude: location!.latitude,
//     longitude: location!.longitude,
//   });

//   if (error) {
//     console.error(error);
//   }
// };

export const updateAvatarPosition = (location: ILocation) => {};
// async (location: ILocation) => {
//   const {
//     data: { session },
//     error: sessionError,
//   } = await supabase.auth.getSession();

//   if (sessionError) {
//     console.error(sessionError);
//     return;
//   }

//   const id = session?.user.id;

//   const { error } = await supabase
//     .from("location")
//     .update({ latitude: location!.latitude, longitude: location!.longitude })
//     .eq("id", id);
// };
