import React, { useEffect, memo } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { authentication } from "../Firebase_config";
import { MyColor } from "../Utils/MyColors";
import { useFontsLoader } from "../Utils/MyFonts";

const Splash = () => {
  const [fontsLoaded, fontError] = useFontsLoader();
  const navigation = useNavigation();

  useEffect(() => {
    let timer;
    let unsubscribeAuth;

    if (fontsLoaded) {
      unsubscribeAuth = onAuthStateChanged(authentication, (user) => {
        timer = setTimeout(() => {
          if (user) {
            navigation.replace("MainApp");
          } else {
            navigation.replace("Login");
          }
        }, 2000);
      });
    } else if (fontError) {
      console.warn("Font loading error:", fontError);
      timer = setTimeout(() => {
        navigation.replace("Login");
      }, 2000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, [navigation, fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={MyColor.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.logoContainer} accessibilityRole="image">
        <Image
          style={styles.logo}
          source={require("../assets/logo.png")}
          accessibilityLabel="Harvest Hub logo"
        />

        <View>
          <Text style={styles.appName}>Harvest Hub</Text>
          <Text style={styles.tagline}>Online Farm</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: MyColor.primary,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: MyColor.primary,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    tintColor: MyColor.secondary,
    height: 125,
    width: 125,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 35,
    fontFamily: "pacifico",
    color: MyColor.secondary,
  },
  tagline: {
    fontSize: 19,
    fontFamily: "delius",
    color: MyColor.secondary,
    textAlign: "left",
    letterSpacing: 1,
  },
});

export default memo(Splash);
