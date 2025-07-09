import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <View>
        <Text>Neighbor Searching</Text>
      </View>
      <Link href={"/chat/list"} asChild>
        <Text>Show Chat Room List</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
