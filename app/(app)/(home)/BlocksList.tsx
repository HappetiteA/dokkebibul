import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradientHeader } from "@/components/Headers";
import { useAuth } from "@/contexts/AuthContext";
import { getBlocks } from "@/services/supabase";
import { supabase } from "@/lib/supabase";
import { SelectBlocksResponse } from "@/types/orm.types";
import { BGStyle } from "@/components/style/commonStyle";
import useModal from "@/hooks/useModal";
import {
  UnblockModal,
  UnblockSuccessModal,
  UnblockFailModal,
} from "@/components/modals/UnblockModals";

// Import Shared Components
import { UserListItem } from "@/components/user-list/UserListItem";
import { UnblockCircleButton } from "@/components/user-list/UserListButtons";

export default function BlocksList() {
  const { profile } = useAuth();
  const [blocks, setBlocks] = useState<SelectBlocksResponse>([]);
  const [unblockBtnEnabled, setUnblockBtnEnabled] = useState(true);

  // Modals
  const { open: openUnblockModal, close: closeUnblockModal } =
    useModal(UnblockModal);
  const { open: openUnblockSuccessModal, close: closeUnblockSuccessModal } =
    useModal(UnblockSuccessModal);
  const { open: openUnblockFailModal, close: closeUnblockFailModal } =
    useModal(UnblockFailModal);

  useEffect(() => {
    (async () => {
      const blockData = await getBlocks();
      setBlocks(blockData ?? []);
    })();
  }, []);

  const onUnblockBtnPressed = async (block_id: string, name: string) => {
    setUnblockBtnEnabled(false);
    if (!profile) {
      setUnblockBtnEnabled(true);
      return;
    }

    // Optimistic UI Update
    const previousBlocks = [...blocks];
    setBlocks((prev) => prev.filter((b) => b.id !== block_id));

    const { error } = await supabase.from("blocks").delete().eq("id", block_id);

    closeUnblockModal();
    setUnblockBtnEnabled(true);

    if (error) {
      setBlocks(previousBlocks); // Revert
      openUnblockFailModal({ onClose: closeUnblockFailModal });
    } else {
      openUnblockSuccessModal({ onClose: closeUnblockSuccessModal, name });
    }
  };

  const handleOpenUnblockModal = (item: SelectBlocksResponse[0]) => {
    openUnblockModal({
      onClose: closeUnblockModal,
      onUnblockBtnPressed: () => onUnblockBtnPressed(item.id, item.dst_name),
      unblockBtnEnabled: unblockBtnEnabled,
      name: item.dst_name,
    });
  };

  return (
    <SafeAreaView style={BGStyle.BG}>
      <LinearGradientHeader title="차단 목록" />
      <FlatList
        data={blocks}
        keyExtractor={(item) => item.dst_id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <UserListItem
            name={item.dst_name}
            colorCode={item.dst_color_code}
            // No onPressProfile for blocked users
            onPressProfile={undefined}
            RightComponent={
              <UnblockCircleButton
                onPress={() => handleOpenUnblockModal(item)}
              />
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 16 },
});
