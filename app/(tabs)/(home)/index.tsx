import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import NearbyUserViewer from "@/components/NearbyUserViewer";

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <NearbyUserViewer />
      <Link href={"/chat/list"} asChild>
        <Text>Show Chat Room List</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    alignItems: "center",
  },
});
