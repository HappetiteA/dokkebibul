import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
interface Prop {
  title?: string;
}

export default function DefaultHeader({ title }: Prop) {
  const router = useRouter();
  const onPressBackBtn = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onPressBackBtn}>
          <Text>Back</Text>
        </TouchableOpacity>
        {title != null ? <Text style={styles.title}>{title}</Text> : <></>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: "gray",
  },
  container: {
    marginTop: 50,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    marginLeft: 10,
  },
});
