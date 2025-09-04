// import { useEffect } from "react";
// import { initializeKakaoSDK } from "@react-native-kakao/core";
// import { login } from "@react-native-kakao/user";
// import { supabase } from "@/lib/supabase";
// import { Alert, Button, SafeAreaView, View } from "react-native";

// export default function LogIn() {
//     console.log('asdf')
//     const kakaoNativeAppKey = process.env.EXPO_PUBLIC_NATIVE_APP_KEY || "";
//     useEffect(() => {
//         initializeKakaoSDK(kakaoNativeAppKey)
//     }, []);
//     const handleKakaoLogin =  async () => {
//         const response = await login();

//         if (!response.idToken) return;

//         try {
//             const { data, error } = await supabase.auth.signInWithIdToken({
//                 provider: "kakao",
//                 token: response.idToken,
//             });
//             if (error) throw error;
            
//             const {data: existingUser, error: userError} = await supabase
//                 .from('users')
//                 .select()
//                 .eq('id', data.user?.id)
//                 .single();
//             if (userError && userError.code !== "PGRST116") { // error code: no user found
//                 Alert.alert(
//                     "사용자 정보 조회 중 오류가 발생했습니다. 오류 코드: ", userError.toString()
//                 );
//                 console.log("사용자 정보 조회 중 오류가 발생했습니다. 오류 코드: ", userError.toString()); return;
//             }
//             if (!existingUser && data.user.id && data.user.email) {
//                 const { data: newUser } = await supabase
//                     .from('users')
//                     .upsert({
//                         id: data.user?.id,
//                         name: data.user?.user_metadata.name,
//                         email: data.user?.email,
//                     })
//                     .select();
//                 console.log("새로운 사용자 정보가 생성되었습니다.", newUser?.toString());
//             }
//         } catch (error) {
//             Alert.alert("카카오 로그인 중 에러가 발생했습니다. 오류 코드: ", error?.toString());
//             console.log("카카오 로그인 중 에러가 발생했습니다. 오류 코드: ", error?.toString());
//         }
//     };

//     return (
//         <SafeAreaView>
//             <View>
//                 <Button
//                     onPress={handleKakaoLogin}
//                     title="카카오 로그인"
//                 />
//             </View>
//         </SafeAreaView>
//     )
// }


import { Platform, View } from 'react-native'
import * as AppleAuthentication from 'expo-apple-authentication'
import { handleAppleLogin, GoogleLoginButton } from '@/utils/auth'


export default function LogIn() {
  if (Platform.OS === 'ios')
    return (
      <View>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={{ width: 200, height: 64 }}
          onPress={ handleAppleLogin }
        />
        <GoogleLoginButton/>
      </View>
    )
  return <><GoogleLoginButton/></>
}
