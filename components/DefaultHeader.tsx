import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
interface Prop {
  title?: string;
}

export default function DefaultHeader({ title }: Prop) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <Button
          title="Back"
          onPress={() => {
            router.back();
          }}
        ></Button>
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
    textAlignVertical: "center",
  },
  title: {
    marginLeft: 10,
    marginVertical: "auto",
    fontSize: 24,
  },
});
