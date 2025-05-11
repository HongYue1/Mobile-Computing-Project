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
  Linking,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { authentication, database } from "../Firebase_config.js";
import { MyColor } from "../Utils/MyColors.js";
import CustomButton from "../Components/CustomButton.jsx";
import CustomTextInput from "../Components/CustomTextInput.jsx";
import { showAlert } from "../Utils/helpers.js";
import { INPUT_MAX_LENGTHS, VALIDATION_PATTERNS } from "../Utils/Constants.js";

const Signup = () => {
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateUsername = (text) => {
    if (!text) {
      setUsernameError("Username is required");
      return false;
    }
    if (text.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }
    const isValid = VALIDATION_PATTERNS.USERNAME.test(text);
    if (!isValid) {
      setUsernameError("Username must contain only letters and numbers");
      return false;
    }
    setUsernameError("");
    return true;
  };

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

  const handleSignUp = async () => {
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        authentication,
        email,
        password
      );
      const user = userCredential.user;

      // Use user.uid as the document ID in Firestore
      await setDoc(doc(database, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
      });

      showAlert(
        "Operation Successful",
        "User account created! Please log in.",
        () => {
          navigation.replace("Login");
        }
      );
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showAlert("Sign Up Failed", "That email address is already in use!");
      } else if (error.code === "auth/invalid-email") {
        showAlert("Sign Up Failed", "That email address is invalid!");
      } else if (error.code === "auth/weak-password") {
        showAlert("Sign Up Failed", "Password is too weak.");
      } else {
        console.error("Signup error:", error);
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
              <Text style={styles.title}>Sign Up</Text>
              <Text style={styles.subtitle}>
                Enter your credentials to continue
              </Text>

              <CustomTextInput
                label="Username"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (usernameError) validateUsername(text);
                }}
                onBlur={() => validateUsername(username)}
                placeholder="Letters & numbers, min 3, max 20"
                maxLength={INPUT_MAX_LENGTHS.USERNAME}
                error={usernameError}
                autoCapitalize="none"
              />

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
                placeholder="Minimum 6 characters"
                secureTextEntry
                maxLength={INPUT_MAX_LENGTHS.PASSWORD}
                error={passwordError}
              />

              <Text style={styles.termsText}>
                By continuing you agree to our{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => Linking.openURL("https://www.google.com")} // Replace with actual URL
                  accessibilityLabel="Terms of Service"
                >
                  Terms Of Service
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => Linking.openURL("https://www.google.com")} // Replace with actual URL
                  accessibilityLabel="Privacy Policy"
                >
                  Privacy Policy
                </Text>
              </Text>

              <CustomButton
                title="Sign Up"
                onPress={handleSignUp}
                loading={loading}
                style={styles.signupButton}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.replace("Login")}
                  accessibilityLabel="Login"
                >
                  <Text style={styles.loginLink}>Login</Text>
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
  termsText: {
    marginTop: 10,
    fontSize: 13,
    color: MyColor.text,
    letterSpacing: 0.5,
    lineHeight: 22,
    opacity: 0.8,
    fontFamily: "LatoRegular",
    textAlign: "center",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  termsLink: {
    fontFamily: "LatoBold",
    color: MyColor.primary,
  },
  signupButton: {
    marginTop: 10,
    height: 60,
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 30,
    alignSelf: "center",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 16,
    fontFamily: "LatoRegular",
  },
  loginLink: {
    fontSize: 16,
    color: MyColor.primary,
    fontFamily: "LatoBold",
  },
});

export default Signup;
