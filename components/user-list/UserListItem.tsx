import React, { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { ShadowStyle } from "@/components/style/Shadow";
import { getAvatarSource } from "@/utils/avatarColor";

interface UserListItemProps {
  name: string;
  colorCode: number | undefined | null;
  onPressProfile?: () => void; // Optional: BlocksList doesn't navigate
  RightComponent: ReactNode;
}

export function UserListItem({
  name,
  colorCode,
  onPressProfile,
  RightComponent,
}: UserListItemProps) {
  // Render profile part as Touchable if onPress is provided, else View
  const ProfileContainer = onPressProfile ? TouchableOpacity : View;

  return (
    <View style={[styles.cardContainer, ShadowStyle.pill3d]}>
      {/* Left Section: Avatar + Name */}
      <ProfileContainer
        style={styles.profileSection}
        onPress={onPressProfile}
        activeOpacity={onPressProfile ? 0.7 : 1}
      >
        <Image
          source={getAvatarSource(colorCode)}
          style={styles.avatar}
          resizeMode="contain"
        />
        <Text style={styles.nameText} numberOfLines={1}>
          {name}
        </Text>
      </ProfileContainer>

      {/* Right Section: Action Button */}
      <View style={styles.rightSection}>{RightComponent}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f8fa",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 40,
    marginBottom: 15,
    height: 60,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  rightSection: {
    // Container for the button
  },
  avatar: {
    width: 50,
    height: 50,
    marginVertical: -10,
    marginRight: 8,
    marginLeft: -8,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    flexShrink: 1, // Prevents text from overlapping button
  },
});
