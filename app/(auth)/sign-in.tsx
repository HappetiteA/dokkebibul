import { Platform, TouchableOpacity, View, Text } from 'react-native'
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
            await loginWithGoogle();
            router.replace('/(app)/(tabs)/(home)');
          }}
        >
          <Text>Sign in With Google</Text>
        </TouchableOpacity>
        {(Platform.OS === 'ios') ? <TouchableOpacity
          onPress={async () => {
            await loginWithApple();
            router.replace('/(app)/(tabs)/(home)');
          }}
        >
          <Text>Sign in With Apple</Text>
        </TouchableOpacity> : null}
      </View>
    </SafeAreaView>
  )
}
