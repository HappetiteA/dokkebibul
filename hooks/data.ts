import { supabase } from "@/utils/supabase";

interface ILocation {
  latitude: number;
  longitude: number;
}

export const addNewAvatar = async (location: ILocation) => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error(sessionError);
    return;
  }

  const id = session?.user.id;

  const { error } = await supabase.from("location").insert({
    id: id,
    latitude: location!.latitude,
    longitude: location!.longitude,
  });

  if (error) {
    console.error(error);
  }
};

export const updateAvatarPosition = async (location: ILocation) => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error(sessionError);
    return;
  }

  const id = session?.user.id;

  const { error } = await supabase
    .from("location")
    .update({ latitude: location!.latitude, longitude: location!.longitude })
    .eq("id", id);
};
