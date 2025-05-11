import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useCart } from "../Context/CartContext";
import { MyColor } from "../Utils/MyColors";
import {
  formatPrice,
  capitalizeFirstLetter,
  showAlert,
} from "../Utils/helpers";
import CustomButton from "../Components/CustomButton";
import CustomTextInput from "../Components/CustomTextInput";
import { useNavigation } from "@react-navigation/native";
import { authentication, database } from "../Firebase_config";
import { doc, setDoc, writeBatch, serverTimestamp } from "firebase/firestore";

const CheckoutScreen = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [cityError, setCityError] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");

  const validateForm = () => {
    let isValid = true;
    if (!name.trim()) {
      setNameError("Full name is required.");
      isValid = false;
    } else {
      setNameError("");
    }
    if (!phone.trim()) {
      setPhoneError("Phone number is required.");
      isValid = false;
    } else if (!/^\d{10,15}$/.test(phone.trim())) {
      setPhoneError("Enter a valid phone number.");
      isValid = false;
    } else {
      setPhoneError("");
    }
    if (!address.trim()) {
      setAddressError("Street address is required.");
      isValid = false;
    } else {
      setAddressError("");
    }
    if (!city.trim()) {
      setCityError("City is required.");
      isValid = false;
    } else {
      setCityError("");
    }
    if (!postalCode.trim()) {
      setPostalCodeError("Postal code is required.");
      isValid = false;
    } else {
      setPostalCodeError("");
    }
    return isValid;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const currentUser = authentication.currentUser;
    if (!currentUser) {
      showAlert(
        "Authentication Error",
        "You must be logged in to place an order.",
        () => navigation.navigate("Login")
      );
      return;
    }

    if (cartItems.length === 0) {
      showAlert("Empty Cart", "Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const orderId = `ORD-${currentUser.uid.substring(0, 5)}-${Date.now()}`;
      const orderRef = doc(database, "orders", orderId);
      const userCartRef = doc(
        database,
        "users",
        currentUser.uid,
        "cart",
        "currentCart"
      );

      const orderData = {
        orderId,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          img: item.img,
        })),
        totalAmount: cartTotal,
        shippingDetails: {
          name,
          phone,
          address,
          city,
          postalCode,
        },
        status: "Placed",
        orderDate: serverTimestamp(),
        paymentMethod: "Cash on Delivery",
      };

      const batch = writeBatch(database);
      batch.set(orderRef, orderData);
      batch.set(userCartRef, { items: [] });

      await batch.commit();

      clearCart(); // Clear local cart state
      navigation.replace("OrderConfirmation", {
        orderId: orderData.orderId,
        totalAmount: orderData.totalAmount,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      showAlert(
        "Order Failed",
        "Could not place your order. Please try again. Details: " +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.headerTitle}>Checkout</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Details</Text>
            <CustomTextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              error={nameError}
              onBlur={() =>
                !name.trim() && setNameError("Full name is required.")
              }
            />
            <CustomTextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g. 1234567890"
              keyboardType="phone-pad"
              error={phoneError}
              onBlur={() =>
                !phone.trim() && setPhoneError("Phone number is required.")
              }
            />
            <CustomTextInput
              label="Street Address"
              value={address}
              onChangeText={setAddress}
              placeholder="123 Main St, Apt 4B"
              error={addressError}
              onBlur={() =>
                !address.trim() &&
                setAddressError("Street address is required.")
              }
            />
            <CustomTextInput
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="Anytown"
              error={cityError}
              onBlur={() => !city.trim() && setCityError("City is required.")}
            />
            <CustomTextInput
              label="Postal Code"
              value={postalCode}
              onChangeText={setPostalCode}
              placeholder="A1B 2C3 or 12345"
              error={postalCodeError}
              onBlur={() =>
                !postalCode.trim() &&
                setPostalCodeError("Postal code is required.")
              }
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.summaryItem}>
                <Text style={styles.summaryItemName} numberOfLines={1}>
                  {capitalizeFirstLetter(item.name)} (x{item.quantity})
                </Text>
                <Text style={styles.summaryItemPrice}>
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            ))}
            <View style={styles.summaryTotal}>
              <Text style={styles.summaryTotalText}>Total:</Text>
              <Text style={styles.summaryTotalAmount}>
                {formatPrice(cartTotal)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <Text style={styles.paymentPlaceholder}>
              Cash on Delivery (Default)
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <CustomButton
          title={`Place Order (${formatPrice(cartTotal)})`}
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={cartItems.length === 0 || loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColor.secondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "LatoBold",
    color: MyColor.text,
    textAlign: "center",
    marginVertical: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: MyColor.secondary,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: MyColor.neutral2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "LatoBold",
    color: MyColor.text,
    marginBottom: 10,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryItemName: {
    fontSize: 15,
    fontFamily: "LatoRegular",
    color: MyColor.text,
    flex: 3,
    marginRight: 10,
  },
  summaryItemPrice: {
    fontSize: 15,
    fontFamily: "LatoBold",
    color: MyColor.text,
    flex: 1,
    textAlign: "right",
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: MyColor.neutral2,
  },
  summaryTotalText: {
    fontSize: 18,
    fontFamily: "LatoBold",
    color: MyColor.text,
  },
  summaryTotalAmount: {
    fontSize: 18,
    fontFamily: "LatoBold",
    color: MyColor.primary,
  },
  paymentPlaceholder: {
    fontSize: 15,
    fontFamily: "LatoRegular",
    color: MyColor.neutral,
    paddingVertical: 10,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: MyColor.neutral2,
    backgroundColor: MyColor.secondary,
  },
});

export default CheckoutScreen;
