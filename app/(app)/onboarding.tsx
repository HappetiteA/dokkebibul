import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Dimensions,
  ListRenderItem,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import ChatBubbleText from "@/components/style/ChatBubbleText";
import headerStyle, {
  BGStyle,
  headerHeight,
} from "@/components/style/commonStyle";
import { BackIcon, SendIcon } from "@/components/style/Icons";
import ShadowWrap from "@/components/style/Shadow";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { getAvatarSource } from "@/utils/avatarColor";
import { SafeAreaView } from "react-native-safe-area-context";

type NoInputProps = {
  topic: string;
  question: string;
  value: string;
  onNext: () => void;
};

type QuestionProps = {
  topic: string;
  question: string;
  value: string;
  onChangeText: (text: string) => void;
  onNext: () => void;
};

type ColorPickerProps = {
  topic: string;
  question: string;
  value: number;
  setValue: (text: number) => void;
  onNext: () => void;
};

const NoInput = ({ topic, question, value, onNext }: NoInputProps) => {
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

  return (
    <>
      <View style={styles.questionContainer}>
        <ChatBubbleText text={question} bubbleColor="#E4E4EA" />
        <Animated.Image
          source={require("@/assets/from_figma/icon-wisp-list.png")} // Placeholder
          style={[styles.avatarImage, animStyle]}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: "center",
        }}
        onPress={onNext}
      >
        <Text style={styles.screenTouchText}>화면을 터치해주세요</Text>
      </TouchableOpacity>
    </>
  );
};

const Question = ({
  topic,
  question,
  value,
  onChangeText,
  onNext,
}: QuestionProps) => {
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

  return (
    <>
      <View style={styles.questionContainer}>
        <ChatBubbleText text={question} bubbleColor="#E4E4EA" />
        <Animated.Image
          source={require("@/assets/from_figma/icon-wisp-list.png")} // Placeholder
          style={[styles.avatarImage, animStyle]}
          resizeMode="contain"
        />
      </View>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: "column-reverse",
          marginBottom: "55%",
        }}
        behavior={Platform.OS == "ios" ? "padding" : undefined}
      >
        <View>
          <ShadowWrap>
            <View style={styles.textInputView}>
              <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder="Type your answer..."
                style={{ flex: 5, fontSize: 20 }}
              />
              <TouchableOpacity onPress={onNext} disabled={!value.trim()}>
                <SendIcon />
              </TouchableOpacity>
            </View>
          </ShadowWrap>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const ColorPicker = ({
  question,
  value,
  setValue,
  onNext,
}: ColorPickerProps) => {
  const { width: W, height: H } = Dimensions.get("window");
  const IMAGE_SIZE = 150;
  const scrollRef = useRef<FlatList>(null);

  useEffect(() => {
    scrollRef.current?.scrollToOffset({ offset: value * W });
  }, [scrollRef]);

  const renderItem: ListRenderItem<number> = ({ item }) => {
    return (
      <View
        style={{
          width: W,
          height: 0.35 * H,
          alignItems: "center",
        }}
      >
        <Image
          source={getAvatarSource(item)}
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
          }}
          resizeMode="stretch"
        />
      </View>
    );
  };

  return (
    <View style={styles.questionContainer}>
      <ChatBubbleText text={question} bubbleColor="#E4E4EA" />
      <FlatList
        ref={scrollRef}
        horizontal
        snapToAlignment="center"
        snapToInterval={W}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        style={{
          position: "absolute",
          bottom: H * 0.3,
        }}
        scrollEventThrottle={16}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const idx = Math.round(x / W);
          setValue(idx);
        }}
        data={[0, 1, 2, 3, 4, 5, 6]}
        keyExtractor={(item) => item.toString()}
        renderItem={renderItem}
        getItemLayout={(_, i) => ({
          length: W,
          offset: W * i,
          index: i,
        })}
      ></FlatList>

      <View
        style={{ position: "absolute", bottom: "42%", flexDirection: "row" }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((v) => (
          <View
            key={v}
            style={[
              {
                width: 12,
                height: 12,
                borderRadius: 6,
                marginHorizontal: 3,
                backgroundColor: value == v ? "#9DD8ED" : "#D9D9D9",
              },
              value == v
                ? {
                    shadowColor: "#3BA6C9",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.7,
                    shadowRadius: 4,
                    elevation: 4,
                  }
                : {},
            ]}
          ></View>
        ))}
      </View>

      <View style={{ position: "absolute", bottom: "30%" }}>
        <TouchableOpacity
          style={[styles.commonShadow, styles.saveButton]}
          onPress={onNext}
        >
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Onboarding = () => {
  const { session, user, profile, refreshProfile } = useAuth();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [avatarColor, setAvatarColor] = useState<number>();

  const questions = [
    { key: "no_input", label: "안녕! 만나서 반가워." },
    { key: "no_input", label: "난 너의 도깨비불이야." },
    {
      key: "no_input",
      label: "나는 너에 대해 배우고, 너를 따라하는 존재야.",
    },
    {
      key: "no_input",
      label: "네가 원한다면 언제든 너인 척해줄 수 있지!",
    },
    {
      key: "no_input",
      label: "물론 처음엔 좀 어색할거야..!",
    },
    { key: "no_input", label: "그치만 점점 너에 대해 알아갈 수록" },
    { key: "no_input", label: "너를 더 잘 따라하게 될거야!" },
    { key: "no_input", label: "그럼 지금부터..." },
    { key: "no_input", label: "너에 대해 먼저 소개해줄래?" },
    { key: "no_input", label: "널 따라하려면 너에 대해 알아야 하거든!" },
    { key: "name", label: "넌 이름이 뭐야?" },
    { key: "no_input", label: `${answers["name"]}! 반가워!` },
    { key: "age", label: "넌 몇 살이야?" },
    { key: "job", label: "너는 무슨 일을 해?" },
    { key: "hobby", label: "취미는 뭐야?" },
    {
      key: "memo",
      label: "마지막으로... 너에 대해 꼭 알아줬으면 하는 게 있어?",
    },
    {
      key: "no_input",
      label: "좋아! 이제 다 끝났어!",
    },
    {
      key: "no_input",
      label: "아 맞다! 진짜 마지막으로...",
    },
    {
      key: "color",
      label: "내가 무슨 색이면 좋을 것 같아?",
    },
  ];

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (answers: Record<string, string>) => {
    if (!user || !user.id || !session) {
      console.error("User session missing");
      Alert.alert("User session missing, please sign in again");
      router.replace("/(auth)/sign-in");
      return;
    }
    if (profile) {
      console.error("User profile already exists in DB");
      Alert.alert("User profile already exists");
      router.replace("/(app)/(home)");
      return;
    }
    try {
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: user.id,
        name: answers["name"]?.trim(),
        color_code: avatarColor,
      });
      if (profileError) {
        console.error(profileError);
        Alert.alert(`Failed to insert profile to DB: ${profileError.message}`);
        return;
      }

      let age = Number(answers["age"]?.trim());
      if (Number.isNaN(age)) {
        age = 0;
      }

      const { error: personaError } = await supabase.from("personas").insert({
        user_id: user.id,
        name: answers["name"]?.trim(),
        age: age,
        job: answers["job"]?.trim(),
        hobby: answers["hobby"]?.trim(),
        memo: answers["memo"]?.trim(),
      });

      if (personaError) {
        console.error(personaError);
        Alert.alert(`Failed to insert persona to DB: ${personaError.message}`);
        return;
      }

      await refreshProfile();
      router.replace("/(app)/(home)");
    } catch (err: any) {
      console.error(err);
      Alert.alert(`Failed to insert profile to DB: ${err}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit(answers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <SafeAreaView style={BGStyle.BG}>
      {currentIndex > 0 ? (
        <View style={headerStyle.container}>
          <View style={headerStyle.content}>
            <View style={headerStyle.left}>
              <TouchableOpacity onPress={handlePrevious}>
                <BackIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={headerStyle.container}>
          <View style={headerStyle.content}></View>
        </View>
      )}
      {currentQuestion.key == "color" ? (
        <ColorPicker
          topic={currentQuestion.key}
          question={currentQuestion.label}
          value={avatarColor ?? 0}
          setValue={(value: number) => {
            setAvatarColor(value);
          }}
          onNext={handleNext}
        />
      ) : currentQuestion.key == "no_input" ? (
        <NoInput
          topic={currentQuestion.key}
          question={currentQuestion.label}
          value={answers[currentQuestion.key] || ""}
          onNext={handleNext}
        />
      ) : (
        <Question
          topic={currentQuestion.key}
          question={currentQuestion.label}
          value={answers[currentQuestion.key] || ""}
          onChangeText={(text: string) =>
            handleAnswerChange(currentQuestion.key, text)
          }
          onNext={handleNext}
        />
      )}
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  questionContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
  },

  // Text & Character
  textBubble: {
    flex: 1,
    position: "relative",
    overflow: "visible", // 꼬리가 밖으로 나오게
  },
  textTail: {
    position: "absolute",
    transform: [{ rotate: "45deg" }],
  },
  avatarImage: {
    position: "absolute",
    bottom: "50%",
    width: 150,
    height: 150,
  },

  // "Touch Screen" text design
  screenTouchText: {
    textAlign: "center",
    fontSize: 20,
    color: "#B4B4B8",
    position: "absolute",
    bottom: "30%",
  },

  // Input field design
  textInputView: {
    flexDirection: "row",
    backgroundColor: "#F8F8FA",
    borderRadius: 30,
    marginHorizontal: 40,
    paddingVertical: 5,
    paddingLeft: 15,
    paddingRight: 5,
  },

  // Button Design
  commonShadow: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    // CHANGED: Gray background with thick white border
    backgroundColor: "#E4E4EA",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555", // Slightly darker gray text
  },
});
