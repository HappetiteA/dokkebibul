import DefaultHeader from "@/components/DefaultHeader";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function FollowersList() {
  const router = useRouter();
  const [followers, setFollowers] = useState(["a", "b", "c", "d"]);

  useEffect(() => {}, []);

  const MoveToOtherProfile = (user_id: string) => {
    router.navigate({
      pathname: "/(app)/(home)/OtherProfile",
      params: { user_id: user_id },
    });
  };

  return (
    <>
      <DefaultHeader title="팔로잉 목록" />
      <View>
        {followers.map((value, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              MoveToOtherProfile("uuid from database HERE");
            }}
          >
            <Text>Profile : {value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
