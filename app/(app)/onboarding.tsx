import { useState } from "react";
import { StyleSheet, Text, View, Button, Alert, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type QuestionProps = {
  question: string;
  value: string;
  onChangeText: (text: string) => void;
  onNext: () => void;
  isLast: boolean;
};

const Question = ({
  question,
  value,
  onChangeText,
  onNext,
  isLast,
}: QuestionProps) => {
  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{question}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type your answer..."
      />
      <Button
        title={isLast ? "Submit" : "Next"}
        onPress={onNext}
        disabled={!value.trim()}
      />
    </View>
  );
};

const Onboarding = () => {
  const questions = [
    { key: "name", label: "What is your name?" },
    { key: "age", label: "How old are you?" },
    { key: "color", label: "What is your favorite color?" },
  ];

  const { session, user, profile, refreshProfile } = useAuth();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

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
      const { error } = await supabase.from("profiles").insert({
        user_id: user.id,
        name: answers["name"]?.trim(),
      });
      if (error) {
        console.error(error);
        Alert.alert(`Failed to insert profile to DB: ${error.message}`);
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

  const currentQuestion = questions[currentIndex];

  return (
    <View style={styles.container}>
      <Question
        question={currentQuestion.label}
        value={answers[currentQuestion.key] || ""}
        onChangeText={(text: string) =>
          handleAnswerChange(currentQuestion.key, text)
        }
        onNext={handleNext}
        isLast={currentIndex === questions.length - 1}
      />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
  },
});
