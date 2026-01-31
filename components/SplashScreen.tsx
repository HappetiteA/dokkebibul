import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Animated, Image } from "react-native";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";

// 1. Import your separated assets
// Ensure these are two separate transparent PNGs of the same dimensions
import IMG_LOGO from "@/assets/images/logo.png"; // Just the text
import IMG_SHADOW from "@/assets/images/logo_shadow.png"; // Just the shadow

export function AnimatedSplashScreen({ isAppReady, children }: any) {
  const [isAnimationComplete, setAnimationComplete] = useState(false);
  const [isSplashVisible, setSplashVisible] = useState(true);

  // Animation Values
  // Logo starts invisible (0)
  const logoOpacity = useRef(new Animated.Value(0)).current;
  // Shadow starts invisible (0)
  const shadowOpacity = useRef(new Animated.Value(0)).current;
  // Shadow starts at 0,0 (directly behind the text)
  const shadowTranslate = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const runAnimation = async () => {
      // Hide Native Splash immediately
      // (If native splash is blank, screen stays blank here)
      await SplashScreen.hideAsync();

      // Sequence:
      // 1. Fade In Logo
      // 2. Fade In Shadow + Move Shadow
      Animated.sequence([
        // Step A: Logo appears from blank
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Step B: Shadow appears and drifts out
        Animated.parallel([
          Animated.timing(shadowOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(shadowTranslate, {
            toValue: { x: 4, y: 4 }, // Move shadow down-right by 10px
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Ensure minimal view time
      setTimeout(() => {
        setAnimationComplete(true);
      }, 2000);
    };

    runAnimation();
  }, []);

  // Exit Logic: Fade out container when App is Ready AND Animation is Done
  useEffect(() => {
    if (isAppReady && isAnimationComplete) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setSplashVisible(false));
    }
  }, [isAppReady, isAnimationComplete]);

  return (
    <View style={{ flex: 1 }}>
      {/* App Content (Always mounted to prevent flicker) */}
      {children}

      {/* Splash Overlay */}
      {isSplashVisible && (
        <Animated.View
          style={[styles.container, { opacity: containerOpacity }]}
        >
          <StatusBar style="dark" />

          <View style={styles.logoContainer}>
            {/* LAYER 1: The Shadow (Starts hidden + behind) */}
            <Animated.Image
              source={IMG_SHADOW}
              resizeMode="contain"
              style={[
                styles.logoImage,
                {
                  opacity: shadowOpacity,
                  transform: [
                    { translateX: shadowTranslate.x },
                    { translateY: shadowTranslate.y },
                  ],
                },
              ]}
            />

            {/* LAYER 2: The Logo (Starts hidden) */}
            <Animated.Image
              source={IMG_LOGO}
              resizeMode="contain"
              style={[
                styles.logoImage,
                {
                  position: "absolute", // Locks it on top of shadow
                  opacity: logoOpacity,
                },
              ]}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff", // Ensure this matches Native Splash background
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  logoContainer: {
    width: 250,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
});
