import DefaultHeader from "@/components/DefaultHeader";
import ShadowWrap from "@/components/style/Shadow";
import { NeumorphicSwitch } from "@/components/style/Switch";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ChatSettings() {
  const params = useLocalSearchParams();
  const conversation_id = params.id as string;

  return (
    <>
      <DefaultHeader title={"채팅 설정"} />
      <View style={styles.container}>
        <View>
          <View style={styles.settingListElement}>
            <Text>채팅 알림</Text>
            <NeumorphicSwitch
              width={60}
              height={30}
              padding={5}
              value={false}
              onValueChange={() => {}}
              onColor="#93D7EA"
              offColor="#D7D7E2"
            />
          </View>
          <View style={styles.settingListElement}>
            <Text>채팅 알림</Text>
            <NeumorphicSwitch
              width={60}
              height={30}
              padding={5}
              value={false}
              onValueChange={() => {}}
              onColor="#93D7EA"
              offColor="#D7D7E2"
            />
          </View>
          <View style={styles.settingListElement}>
            <Text>채팅 알림</Text>
            <NeumorphicSwitch
              width={60}
              height={30}
              padding={5}
              value={false}
              onValueChange={() => {}}
              onColor="#93D7EA"
              offColor="#D7D7E2"
            />
          </View>
        </View>

        <View>
          <ShadowWrap>
            <TouchableOpacity>
              <View style={styles.button}>
                <Text style={styles.buttonText}>신고하기</Text>
              </View>
            </TouchableOpacity>
          </ShadowWrap>
          <ShadowWrap>
            <TouchableOpacity>
              <View style={styles.button}>
                <Text style={styles.buttonText}>차단하기</Text>
              </View>
            </TouchableOpacity>
          </ShadowWrap>
          <ShadowWrap>
            <TouchableOpacity>
              <View style={styles.button}>
                <Text style={styles.buttonText}>채팅방 나가기</Text>
              </View>
            </TouchableOpacity>
          </ShadowWrap>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  settingListElement: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    marginHorizontal: "auto",
    marginVertical: 10,
    justifyContent: "space-evenly",
  },

  button: {
    backgroundColor: "#F8F8FA",
    borderRadius: 30,
    marginVertical: 10,
    width: 180,
    marginHorizontal: "auto",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  buttonText: { textAlign: "center", fontSize: 20, color: "#8F8F9A" },
});
