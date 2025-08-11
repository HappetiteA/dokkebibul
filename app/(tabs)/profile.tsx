import DefaultHeader from "@/components/DefaultHeader";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { handleLogout } from "@/utils/auth";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  return (
    <>
      <ProfileScreenHeader></ProfileScreenHeader>
      <View>
        <View></View>
        <Text>Name</Text>
        <Text>Location</Text>
        <Text>Description</Text>

        <Text>Account Info</Text>

        <TouchableOpacity onPress={handleLogout}>
          <Text>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

function ProfileScreenHeader() {
  const router = useRouter();
  const onPressBackBtn = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const onProfileClick = () => {
    router.navigate("/(tabs)/profile");
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onPressBackBtn}
          >
            <Text>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onProfileClick}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: "#bdc3c7",
  },
  headerContent: {
    marginTop: 50,
    height: 50,
    flexDirection: "row",
    textAlignVertical: "center",
    justifyContent: "space-between",
  },
  headerRight: {
    flexDirection: "row",
    marginRight: 20,
  },
  headerLeft: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  headerButton: {
    width: 48,
    height: 48,
    backgroundColor: "#95a5a6",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  headerTitle: {
    marginLeft: 5,
  },
});
