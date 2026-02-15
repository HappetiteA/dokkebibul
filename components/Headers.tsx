import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import headerStyle from "@/components/style/commonStyle";
import { BackIcon } from "./style/Icons";
import { LinearGradient } from "expo-linear-gradient";

type Prop = {
  title?: string;
  rightComponent?: React.ReactNode;
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

export function LinearGradientHeader({ title, rightComponent }: Prop) {
  return (
    <View style={headerStyle.headerWrapper}>
      <DefaultHeader title={title} rightComponent={rightComponent} />

      {/* Fade Gradient */}
      <LinearGradient
        colors={["#F8F9FA", "rgba(248, 249, 250, 0)"]}
        style={headerStyle.headerFade}
      />
    </View>
  );
}
