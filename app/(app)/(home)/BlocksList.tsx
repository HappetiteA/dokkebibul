import DefaultHeader from "@/components/DefaultHeader";
import { getBlocks } from "@/services/supabase";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SelectBlocksResponse } from "@/types/orm.types";

export default function FollowingsList() {
  const [blocks, setBlocks] = useState<SelectBlocksResponse>([]);

  useEffect(() => {
    (async () => {
      const followData = await getBlocks();
      setBlocks(followData ?? []);
    })();
  }, [blocks]);

  return (
    <>
      <DefaultHeader title="차단 목록" />
      <View>
        {blocks.map((value) => (
            <Text>{value.dst_name}</Text>
        ))}
      </View>
    </>
  );
}
