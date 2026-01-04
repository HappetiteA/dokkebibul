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
  const [unblockEnabled, setUnblockEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const blockData = await getBlocks();
      setBlocks(blockData ?? []);
    })();
  }, []);

  const handleUnblock = async (user_id: string) => {
    // setUnblockEnabled(false);

    // if (!profile) {
    //   setUnblockEnabled(true);
    //   return;
    // }

    // const { error } = await supabase
    //   .from("blocks")
    //   .delete()
    // if (error) {
    //   console.error(error);
    // }
    // setUnblockEnabled(true);
  };

  const renderItem: ListRenderItem<SelectBlocksResponse[0]> = ({
    item,
  }) => (
    <View style={styles.cardContainer}>
      <View
        style={styles.profileSection}
      >
        <Image
          source={require("@/assets/from_figma/icon-wisp-list.png")}
          style={styles.avatar}
        />
        <Text style={styles.nameText}>{item.dst_name}</Text>
      </View>

      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => handleUnblock(item.dst_id)}
        disabled={!unblockEnabled}
      >
        <Text style={styles.chatButtonText}>-</Text>
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
    backgroundColor: "#f9f9f9", // Slightly off-white background for the screen to make white cards pop
  },
  listContent: {
    padding: 16,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff", // White background
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 30, // Higher border radius for the fully rounded pill look
    marginBottom: 12,

    // --- SHADOW EFFECT ---
    boxShadow: "0px 0px 2px 2px #ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Essential for Android shadow
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#ffffff",
    marginRight: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  // --- BUTTON STYLES ---
  chatButton: {
    borderWidth: 1,
    borderColor: "#d1d1d1", // Light gray border
    borderRadius: 20, // Rounded pill shape
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
  },
  chatButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});
