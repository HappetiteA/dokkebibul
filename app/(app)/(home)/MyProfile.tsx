import { Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import headerStyle from "@/components/style/headerStyle";
import { useAuth } from "@/utils/AuthContext";
import { useAuthActions } from "@/utils/auth";

export default function MyProfileScreen() {
  const { logout } = useAuthActions();
  const { profile } = useAuth();
  const router = useRouter();

  return (
    <>
      <MyProfileScreenHeader />
      <View>
        <View></View>
        <Text>{profile?.name}</Text>
        <Text>Location</Text>
        <Text>Description</Text>
        <Text>Account Info</Text>

        <View>
          <TouchableOpacity
            onPress={() => {
              router.navigate("/FollowersList");
            }}
          >
            <Text>{102}</Text>
            <Text>팔로우</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.navigate("/FollowingsList");
            }}
          >
            <Text>{98}</Text>
            <Text>팔로잉</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={async () => {
            try {
              await logout();
            } catch (err: any) {
              Alert.alert("Logout Error", err.message);
            }
          }}
        >
          <Text>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});

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
