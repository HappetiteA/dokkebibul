import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import headerStyle from "@/components/style/commonStyle";
import { BackIcon } from "./style/Icons";
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
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        <View style={headerStyle.left}>
          <TouchableOpacity onPress={onPressBackBtn}>
            <BackIcon />
          </TouchableOpacity>
          {title != null ? (
            <Text style={headerStyle.title}>{title}</Text>
          ) : (
            <></>
          )}
        </View>
      </View>
    </View>
  );
}
