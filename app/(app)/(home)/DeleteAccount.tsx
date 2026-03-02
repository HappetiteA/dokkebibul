import ChatBubbleText from "@/components/style/ChatBubbleText";
import { ShadowStyle } from "@/components/style/Shadow";
import { useAuthActions } from "@/hooks/useAuthActions";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/Text";
import { PillButton } from "@/components/style/Buttons";

export default function DeleteAccount() {
  const { logout } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const amplitude = useSharedValue(5);
  const periodSec = 1.6;
  const theta = useSharedValue(0);

  useEffect(() => {
    theta.value = withRepeat(
      withTiming(Math.PI * 2, {
        duration: Math.max(1, periodSec * 1000),
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => cancelAnimation(theta);
  }, [periodSec, theta]);

  const animStyle = useAnimatedStyle(() => {
    const y = amplitude.value * Math.sin(theta.value);
    return {
      transform: [{ translateY: y }],
    };
  }, [amplitude]);

  const onPressDeleteAccount = async () => {
    setLoading(true);
    const { error } = await supabase.rpc("delete_me");
    if (error) {
      Alert.alert(`회원탈퇴 도중 오류가 발생했습니다. 다시 시도해주세요`);
      setLoading(false);
      return;
    }
    setLoading(false);
    await logout();
  };

  const onPressCancel = () => {
    router.back();
  };

  return (
    <>
      <View style={styles.container}>
        <ChatBubbleText text={"정말 탈퇴하실건가요?"} bubbleColor="#E4E4EA" />
        <Animated.Image
          source={require("@/assets/from_figma/icon-wisp-list.png")} // Placeholder
          style={[styles.avatarImage, animStyle]}
          resizeMode="contain"
        />
        <View style={[styles.alertView, ShadowStyle.pill3d]}>
          <Text style={{ textAlign: "center" }}>
            {
              "회원 탈퇴 시,\n대화내역을 포함한 모든 개인정보가 \n즉시 삭제되며 복구가 불가능합니다."
            }
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            bottom: "10%",
            justifyContent: "space-between",
            width: "75%",
          }}
        >
          <PillButton
            text="예"
            onPress={onPressDeleteAccount}
            variant="blue"
            width={140}
            height={50}
            disabled={loading}
          />
          <PillButton
            text="아니오"
            onPress={onPressCancel}
            variant="gray"
            width={140}
            height={50}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
  },

  avatarImage: {
    position: "absolute",
    bottom: "50%",
    width: 150,
    height: 150,
  },

  // "Touch Screen" text design
  alertView: {
    position: "absolute",
    width: 302,
    height: 113,
    borderRadius: 40,
    bottom: "30%",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  // Button Design
  button: {
    marginHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 30,
    // CHANGED: Gray background with thick white border
    borderWidth: 3,
    borderColor: "#FFFFFF",
    width: 120,
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#555", // Slightly darker gray text
  },
});
