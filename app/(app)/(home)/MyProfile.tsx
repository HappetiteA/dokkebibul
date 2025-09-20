import { Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import headerStyle from "@/components/style/headerStyle";
import { useAuth } from "@/utils/AuthContext";
import { useAuthActions } from "@/utils/auth";

export default function MyProfileScreen() {
  const { profile } = useAuth();
  const router = useRouter();

  return (
    <>
      <MyProfileScreenHeader />
      <View style={styles.container}>
        <View style={styles.profileImage}></View>
        <Text style={styles.nameText}>{profile?.name}</Text>

        <View style={styles.followView}>
          <TouchableOpacity
            style={styles.followViewBtn}
            onPress={() => {
              router.navigate("/FollowersList");
            }}
          >
            <Text>{102}</Text>
            <Text>팔로우</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.followViewBtn}
            onPress={() => {
              router.navigate("/FollowingsList");
            }}
          >
            <Text>{98}</Text>
            <Text>팔로잉</Text>
          </TouchableOpacity>
        </View>

        <Text>Description</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 108,
    height: 108,
    backgroundColor: "gray",
  },
  nameText: {
    margin: 10,
    fontSize: 20,
  },
  followView: {
    marginVertical: 10,
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  followViewBtn: {
    alignItems: "center",
  },
});

function MyProfileScreenHeader() {
  const router = useRouter();
  const onPressBackBtn = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const onProfileClick = () => {
    router.navigate("/(app)/(home)/MyProfile");
  };

  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        <View style={headerStyle.left}>
          <TouchableOpacity style={headerStyle.button} onPress={onPressBackBtn}>
            <Text>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={headerStyle.right}>
          <TouchableOpacity style={headerStyle.button} onPress={onProfileClick}>
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
