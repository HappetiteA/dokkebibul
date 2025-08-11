import DefaultHeader from "@/components/DefaultHeader";
import { Text, TouchableOpacity, View } from "react-native";
import useCurrentLocation from "@/utils/useCurrentLocation";
import { useState } from "react";
import * as Location from "expo-location";

interface ILocation {
  latitude: number;
  longitude: number;
}

interface IUseCurrentLocation {
  location: ILocation | null;
  errorMsg: string | null;
}

export default function AvatarScreen() {
  //const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { location, errorMsg } = useCurrentLocation();

  const PlaceAvatar = () => {
    console.log(location);
  };

  return (
    <>
      <DefaultHeader title="Avatar"></DefaultHeader>
      <View>
        <Text>Hello Avatar</Text>
        <TouchableOpacity onPress={PlaceAvatar}>
          <Text>Place Avatar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
