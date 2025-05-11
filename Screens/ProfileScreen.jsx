import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { authentication, database } from "../Firebase_config";
import { MyColor } from "../Utils/MyColors";
import CustomButton from "../Components/CustomButton";
import { showAlert } from "../Utils/helpers";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(authentication.currentUser);

  const fetchUserData = async (currentUser) => {
    if (currentUser) {
      setLoading(true);
      try {
        const userDocRef = doc(database, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData({ id: userDocSnap.id, ...userDocSnap.data() });
        } else {
          console.log("No such user document! Using auth email as fallback.");
          setUserData({
            email: currentUser.email,
            username: currentUser.email?.split("@")[0] || "User",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        showAlert("Error", "Could not fetch user details.");
        setUserData({ email: currentUser.email, username: "User" });
      } finally {
        setLoading(false);
      }
    } else {
      setUserData(null);
      setLoading(false);
      navigation.replace("Login");
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      authentication,
      (currentUser) => {
        setUser(currentUser);
        if (!currentUser) {
          navigation.replace("Login");
        }
      }
    );
    return unsubscribeAuth;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchUserData(user);
      } else {
        setUserData(null);
        setLoading(false);
      }
    }, [user])
  );

  const handleLogout = async () => {
    try {
      await signOut(authentication);
    } catch (error) {
      console.error("Logout Error:", error);
      showAlert(
        "Logout Failed",
        "An error occurred while logging out. " + error.message
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={MyColor.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>
          User data not available. Please try logging in again.
        </Text>
        <CustomButton
          title="Go to Login"
          onPress={() => navigation.replace("Login")}
          style={{ width: "60%" }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.avatar}
              accessibilityLabel="User avatar placeholder"
            />
          </View>
          <Text style={styles.username}>{userData.username || "N/A"}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("LocationsTab")}
          >
            <Ionicons
              name="location-outline"
              size={24}
              color={MyColor.primary}
            />
            <Text style={styles.menuItemText}>Store Locations</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color={MyColor.neutral}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              showAlert(
                "Coming Soon",
                "Order history will be available in a future update."
              )
            }
          >
            <Ionicons
              name="receipt-outline"
              size={24}
              color={MyColor.primary}
            />
            <Text style={styles.menuItemText}>Order History</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color={MyColor.neutral}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              showAlert(
                "Coming Soon",
                "Account settings will be available soon."
              )
            }
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={MyColor.primary}
            />
            <Text style={styles.menuItemText}>Account Settings</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color={MyColor.neutral}
            />
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Log Out"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
          accessibilityLabel="Log out of your account"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColor.secondary,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "LatoRegular",
    fontSize: 16,
    color: MyColor.neutral,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 30 : 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: MyColor.neutral2,
    borderRadius: 15,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: MyColor.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: MyColor.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    tintColor: MyColor.primary,
  },
  username: {
    fontSize: 24,
    fontFamily: "LatoBold",
    color: MyColor.text,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    fontFamily: "LatoRegular",
    color: MyColor.neutral,
  },
  menuContainer: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MyColor.secondary,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: MyColor.neutral2,
  },
  menuItemText: {
    flex: 1,
    marginLeft: 20,
    fontSize: 17,
    fontFamily: "LatoRegular",
    color: MyColor.text,
  },
  logoutButton: {
    backgroundColor: MyColor.error,
    marginTop: 20,
    height: 55,
  },
  logoutButtonText: {
    color: MyColor.secondary,
    fontFamily: "LatoBold",
  },
  errorText: {
    fontSize: 16,
    color: MyColor.error,
    fontFamily: "LatoRegular",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default ProfileScreen;
