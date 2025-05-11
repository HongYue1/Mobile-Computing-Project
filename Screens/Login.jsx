import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authentication } from "../Firebase_config.js";
import { MyColor } from "../Utils/MyColors.js";
import CustomButton from "../Components/CustomButton.jsx";
import CustomTextInput from "../Components/CustomTextInput.jsx";
import { showAlert } from "../Utils/helpers.js";
import { INPUT_MAX_LENGTHS, VALIDATION_PATTERNS } from "../Utils/Constants.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const { width } = Dimensions.get("window");
  const navigation = useNavigation();

  const validateEmail = (text) => {
    if (!text) {
      setEmailError("Email is required");
      return false;
    }

    const isValid = VALIDATION_PATTERNS.EMAIL.test(text);
    if (!isValid) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    setEmailError("");
    return true;
  };

  const validatePassword = (text) => {
    if (!text) {
      setPasswordError("Password is required");
      return false;
    }

    const isValid = text.length >= VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH;
    if (!isValid) {
      setPasswordError(
        `Password must be at least ${VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH} characters`
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(authentication, email, password);
      navigation.replace("MainApp");
    } catch (error) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        showAlert(
          "Login Failed",
          "Incorrect email or password. Please try again."
        );
      } else {
        console.error("Login error:", error);
        showAlert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              style={[
                styles.logo,
                { height: width * 0.25, width: width * 0.25 },
              ]}
              source={require("../assets/logo.png")}
              accessibilityLabel="Harvest Hub logo"
            />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>
                Enter your email and password to log in
              </Text>

              <CustomTextInput
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) validateEmail(text);
                }}
                onBlur={() => validateEmail(email)}
                placeholder="example@email.com"
                keyboardType="email-address"
                maxLength={INPUT_MAX_LENGTHS.EMAIL}
                error={emailError}
                autoCapitalize="none"
              />

              <CustomTextInput
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                }}
                onBlur={() => validatePassword(password)}
                placeholder="Enter your password"
                secureTextEntry
                maxLength={INPUT_MAX_LENGTHS.PASSWORD}
                error={passwordError}
              />

              <TouchableOpacity
                onPress={() =>
                  showAlert(
                    "Forgot Password",
                    "Forgot password functionality is not yet implemented."
                  )
                }
                accessibilityLabel="Forgot password"
              >
                <Text style={styles.forgotPassword}>Forgot your password?</Text>
              </TouchableOpacity>

              <CustomButton
                title="Log in"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
              />

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Signup")}
                  accessibilityLabel="Sign up"
                >
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MyColor.secondary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === "ios" ? 30 : 50,
    paddingBottom: 20,
  },
  logo: {
    tintColor: MyColor.primary,
    alignSelf: "center",
    resizeMode: "contain",
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 10,
  },
  title: {
    color: MyColor.text,
    fontFamily: "LatoBold",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "LatoRegular",
    color: MyColor.neutral,
    marginBottom: 20,
    textAlign: "center",
  },
  forgotPassword: {
    marginTop: 5,
    fontSize: 14,
    color: MyColor.text,
    fontFamily: "LatoRegular",
    textAlign: "right",
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 20,
    height: 60,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 30,
    alignSelf: "center",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 16,
    fontFamily: "LatoRegular",
  },
  signupLink: {
    fontSize: 16,
    color: MyColor.primary,
    fontFamily: "LatoBold",
  },
});

export default Login;
