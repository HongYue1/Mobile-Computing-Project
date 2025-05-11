import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { MyColor } from "../Utils/MyColors";
import CustomButton from "../Components/CustomButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatPrice } from "../Utils/helpers";

const OrderConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, totalAmount } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Ionicons
            name="checkmark-circle-outline"
            size={120}
            color={MyColor.success}
            style={styles.icon}
          />
          <Text style={styles.title}>Order Confirmed!</Text>
          {orderId && (
            <Text style={styles.message}>
              Your order <Text style={styles.orderIdText}>#{orderId}</Text> has
              been placed successfully.
            </Text>
          )}
          {typeof totalAmount === "number" && (
            <Text style={styles.totalMessage}>
              Total Amount: {formatPrice(totalAmount)}
            </Text>
          )}
          <Text style={styles.subMessage}>
            Thank you for shopping with Harvest Hub! You will receive an email
            confirmation shortly (if applicable). Our team will contact you for
            delivery arrangements.
          </Text>
          <CustomButton
            title="Continue Shopping"
            onPress={() => navigation.replace("MainApp", { screen: "HomeTab" })}
            style={styles.button}
          />
          <CustomButton
            title="View My Profile"
            onPress={() =>
              navigation.navigate("MainApp", { screen: "ProfileTab" })
            }
            style={[styles.button, styles.secondaryButton]}
            textStyle={styles.secondaryButtonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColor.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    textAlign: "center",
    backgroundColor: MyColor.secondary,
    borderRadius: 10,
    padding: 30,
    shadowColor: MyColor.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "LatoBold",
    color: MyColor.text,
    marginBottom: 15,
  },
  message: {
    fontSize: 17,
    fontFamily: "LatoRegular",
    color: MyColor.neutral,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 24,
  },
  orderIdText: {
    fontFamily: "LatoBold",
    color: MyColor.primary,
  },
  totalMessage: {
    fontSize: 18,
    fontFamily: "LatoBold",
    color: MyColor.text,
    textAlign: "center",
    marginBottom: 15,
  },
  subMessage: {
    fontSize: 15,
    fontFamily: "LatoRegular",
    color: MyColor.neutral,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    marginTop: 15,
    width: "100%",
    height: 55,
  },
  secondaryButton: {
    backgroundColor: MyColor.neutral2,
    borderColor: MyColor.primary,
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    color: MyColor.primary,
    fontFamily: "LatoBold",
  },
});

export default OrderConfirmationScreen;
