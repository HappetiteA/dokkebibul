import DefaultHeader from "@/components/DefaultHeader";
import { useAuthActions } from "@/utils/auth";
import { Alert, Text } from "react-native";
import { TouchableOpacity } from "react-native";

export default function Settings() {
  const { logout } = useAuthActions();

  return (
    <>
      <DefaultHeader title="Settings" />
      <TouchableOpacity
        onPress={async () => {
          try {
            await logout();
          } catch (err: any) {
            Alert.alert("Logout Error", err.message);
          }
        }}
      >
        <Text>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Delete Account</Text>
      </TouchableOpacity>
    </>
  );
}
