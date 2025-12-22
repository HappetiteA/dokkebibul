import DefaultHeader from "@/components/DefaultHeader";
import { Text, TouchableOpacity, View } from "react-native";
import { addNewAvatar, updateAvatarPosition } from "@/services/supabase";
import useCurrentLocation from "@/hooks/useCurrentLocation";

export default function AvatarScreen() {
  const { location, errorMsg, refreshLocation } = useCurrentLocation();
  const PlaceAvatar = () => {
    refreshLocation();
    if (location != null) {
      addNewAvatar(location);
    }
  };

  const UpdateAvatar = () => {
    refreshLocation();
    if (location != null) {
      updateAvatarPosition(location);
    }
  };

  return (
    <>
      <DefaultHeader title="Avatar"></DefaultHeader>
      <View>
        <Text>
          Hello Avatar at lat : {location?.latitude}, lon :{" "}
          {location?.longitude}
        </Text>
        <TouchableOpacity onPress={PlaceAvatar}>
          <Text>Place Avatar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={UpdateAvatar}>
          <Text>Update Avatar Position</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
