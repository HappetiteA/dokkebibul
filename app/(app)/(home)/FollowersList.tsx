import DefaultHeader from "@/components/DefaultHeader";
import { getFollowers } from "@/services/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SelectFollowersResponse } from "@/types/orm.types";

export default function FollowerList() {
  const router = useRouter();
  const [followers, setFollowers] = useState<SelectFollowersResponse>([]);

  useEffect(() => {
    (async () => {
      const followData = await getFollowers();
      setFollowers(followData ?? []);
    })();
  }, []);

  useEffect(() => {
    console.log(followers)
  }, [followers])

  const MoveToOtherProfile = (user_id: string) => {
    router.navigate({
      pathname: "/(app)/(home)/OtherProfile",
      params: { user_id: user_id },
    });
  };

  return (
    <>
      <DefaultHeader title="팔로우 목록" />
      <View>
        {followers.map((value) => (
          <TouchableOpacity
            key={value.src_id}
            onPress={() => {
              MoveToOtherProfile(value.src_id);
            }}
          >
            <Text>{value.src_name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
