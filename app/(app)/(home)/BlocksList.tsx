import DefaultHeader from "@/components/DefaultHeader";
import { getBlocks } from "@/services/supabase";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SelectBlocksResponse } from "@/types/orm.types";

export default function BlocksList() {
  const [blocks, setBlocks] = useState<SelectBlocksResponse>([]);

  useEffect(() => {
    (async () => {
      const followData = await getBlocks();
      setBlocks(followData ?? []);
    })();
  }, []);

  return (
    <>
      <DefaultHeader title="차단 목록" />
      <View>
        {blocks.map((value) => (
          <Text key={value.dst_id}>{value.dst_name}</Text>
        ))}
      </View>
    </>
  );
}
