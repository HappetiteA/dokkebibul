import DefaultHeader from "@/components/DefaultHeader";
import { getBlocks } from "@/services/supabase";
import { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import { SelectBlocksResponse } from "@/types/orm.types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function BlocksList() {
  const { profile } = useAuth();
  const [blocks, setBlocks] = useState<SelectBlocksResponse>([]);
  // We can track specific IDs being unblocked if needed, but a global lock works too
  const [unblockEnabled, setUnblockEnabled] = useState(true);

  useEffect(() => {
    (async () => {
      const blockData = await getBlocks();
      setBlocks(blockData ?? []);
    })();
  }, []);

  const handleUnblock = async (block_id: string) => {
    if (!profile) return;
    setUnblockEnabled(false);

    // 1. Optimistic Update: Immediately remove from UI
    const previousBlocks = [...blocks];
    setBlocks((prev) => prev.filter((b) => b.id !== block_id));

    // 2. Perform API Call
    const { error } = await supabase.from("blocks").delete().eq("id", block_id);

    if (error) {
      console.error("Unblock failed:", error);
      // Revert if API fails
      setBlocks(previousBlocks);
      alert("차단 해제에 실패했습니다.");
    }

    setUnblockEnabled(true);
  };

  const renderItem: ListRenderItem<SelectBlocksResponse[0]> = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.profileSection}>
        <Image
          source={require("@/assets/from_figma/icon-wisp-list.png")}
          style={styles.avatar}
          resizeMode="contain"
        />
        <Text style={styles.nameText}>{item.dst_name}</Text>
      </View>

      {/* Minus Button: Gray Circle */}
      <TouchableOpacity
        style={styles.unblockButtonCircle}
        onPress={() => handleUnblock(item.id)}
        disabled={!unblockEnabled}
      >
        {/* The White Rounded Minus Sign */}
        <View style={styles.minusSign} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <DefaultHeader title="차단 목록" />
      <View style={styles.container}>
        <FlatList
          data={blocks}
          renderItem={renderItem}
          keyExtractor={(item) => item.dst_id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  listContent: {
    padding: 16,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginBottom: 12,

    // --- SHADOW EFFECT ---
    shadowColor: "#000",
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  // --- MINUS BUTTON STYLES ---
  unblockButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16, // Perfect circle
    backgroundColor: "#D7D7E2", // Gray color from image
    justifyContent: "center",
    alignItems: "center",
  },
  minusSign: {
    width: 18,
    height: 4, // Thickness of the minus line
    borderRadius: 2, // Rounded corners for the rectangle
    backgroundColor: "#ffffff", // White icon
  },
});
