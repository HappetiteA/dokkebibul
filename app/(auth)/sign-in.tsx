import { Platform, TouchableOpacity, View, Text, Alert } from 'react-native'
import { useAuthActions } from '@/utils/auth'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'


export default function SignIn() {
  const router = useRouter();
  const { loginWithGoogle, loginWithApple } = useAuthActions();

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity
          onPress={async () => {
            try {
              await loginWithGoogle();
            } catch (err: any) {
              Alert.alert("Login failed", err.message || JSON.stringify(err));
              console.error(err);
            }
          }}
        >
          <Text>Sign in With Google</Text>
        </TouchableOpacity>
        {(Platform.OS === 'ios') ? <TouchableOpacity
          onPress={async () => {
            try {
              await loginWithApple();
            } catch (err: any) {
              Alert.alert("Login failed", err.message || JSON.stringify(err));
              console.error(err);
            }
          }}
        >
          <Text>Sign in With Apple</Text>
        </TouchableOpacity> : null}
      </View>
    </SafeAreaView>
  )
}
