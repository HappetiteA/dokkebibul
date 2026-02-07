import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import headerStyle from "@/components/style/commonStyle";
import { BackIcon } from "./style/Icons";

type Prop = {
  title?: string;
  rightComponent?: React.ReactNode; // <--- Add this
};

export default function DefaultHeader({ title, rightComponent }: Prop) {
  const router = useRouter();
  const onPressBackBtn = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        {/* Left Side: Back + Title */}
        <View style={headerStyle.left}>
          <TouchableOpacity onPress={onPressBackBtn}>
            <BackIcon />
            {/* Ensure BackIcon is imported or replaced with <Ionicons name="chevron-back" ... /> */}
          </TouchableOpacity>
          {title != null ? (
            <Text style={headerStyle.title}>{title}</Text>
          ) : (
            <></>
          )}
        </View>

        {/* Right Side: Optional Component (Edit Button) */}
        {rightComponent && (
          <View style={headerStyle.right}>{rightComponent}</View>
        )}
      </View>
    </View>
  );
}
