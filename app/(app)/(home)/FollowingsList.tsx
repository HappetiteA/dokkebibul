import DefaultHeader from "@/components/DefaultHeader";
import { getFollowings } from "@/services/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SelectFollowingsResponse } from "@/types/orm.types";

export default function FollowingsList() {
  const router = useRouter();
  const [followings, setFollowings] = useState<SelectFollowingsResponse>([]);

  useEffect(() => {
    (async () => {
      const followData = await getFollowings();
      setFollowings(followData ?? []);
    })();
  }, [followings]);

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
        {followings.map((value) => (
          <TouchableOpacity
            key={value.dst_id}
            onPress={() => {
              MoveToOtherProfile(value.dst_id);
            }}
          >
            <Text>{value.dst_name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
