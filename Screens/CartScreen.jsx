import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../Context/CartContext";
import { MyColor } from "../Utils/MyColors";
import {
  formatPrice,
  capitalizeFirstLetter,
  showAlert,
} from "../Utils/helpers";
import CustomButton from "../Components/CustomButton";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    loadingCart,
    clearCart,
    cartItemCount,
  } = useCart();
  const navigation = useNavigation();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showAlert("Empty Cart", "Your cart is empty! Add some items to proceed.");
      return;
    }
    navigation.navigate("Checkout");
  };

  const confirmClearCart = () => {
    if (cartItems.length === 0) return;
    showAlert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, Clear", onPress: clearCart, style: "destructive" },
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.img }}
        style={styles.itemImage}
        accessibilityLabel={item.name}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{capitalizeFirstLetter(item.name)}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
        <Text style={styles.itemMeta}>
          {item.weight || "N/A"} {item.pieces ? `- ${item.pieces}` : ""}
        </Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
          style={styles.quantityButton}
        >
          <Ionicons
            name="remove-circle-outline"
            size={28}
            color={MyColor.primary}
          />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
          style={styles.quantityButton}
        >
          <Ionicons
            name="add-circle-outline"
            size={28}
            color={MyColor.primary}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => removeFromCart(item.id)}
        style={styles.removeButton}
      >
        <Ionicons name="trash-outline" size={24} color={MyColor.error} />
      </TouchableOpacity>
    </View>
  );

  if (loadingCart) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={MyColor.primary} />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart ({cartItemCount})</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={confirmClearCart}>
            <Text style={styles.clearCartText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={100} color={MyColor.neutral} />
          <Text style={styles.emptyCartText}>Your cart is empty.</Text>
          <Text style={styles.emptyCartSubText}>
            Looks like you haven't added anything to your cart yet.
          </Text>
          <CustomButton
            title="Start Shopping"
            onPress={() => navigation.navigate("HomeTab")}
            style={styles.shopButton}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Subtotal:</Text>
              <Text style={styles.totalAmount}>{formatPrice(cartTotal)}</Text>
            </View>
            <CustomButton
              title="Proceed to Checkout"
              onPress={handleCheckout}
              disabled={cartItems.length === 0}
            />
          </View>
        </>
      )}
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
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "LatoRegular",
    fontSize: 16,
    color: MyColor.neutral,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 15 : 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: MyColor.neutral2,
    backgroundColor: MyColor.secondary,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "LatoBold",
    color: MyColor.text,
  },
  clearCartText: {
    fontSize: 14,
    fontFamily: "LatoRegular",
    color: MyColor.primary,
  },
  listContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 150,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: MyColor.neutral2,
    backgroundColor: MyColor.secondary,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: "contain",
    backgroundColor: MyColor.neutral2,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    fontFamily: "LatoBold",
    color: MyColor.text,
    marginBottom: 3,
  },
  itemPrice: {
    fontSize: 15,
    fontFamily: "LatoRegular",
    color: MyColor.primary,
    marginBottom: 3,
  },
  itemMeta: {
    fontSize: 12,
    fontFamily: "LatoRegular",
    color: MyColor.neutral,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    fontSize: 16,
    fontFamily: "LatoBold",
    color: MyColor.text,
    marginHorizontal: Platform.OS === "ios" ? 12 : 8,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyCartText: {
    fontSize: 20,
    fontFamily: "LatoBold",
    color: MyColor.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyCartSubText: {
    fontSize: 16,
    fontFamily: "LatoRegular",
    color: MyColor.neutral,
    textAlign: "center",
    marginBottom: 30,
  },
  shopButton: {
    width: "80%",
    height: 50,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: MyColor.neutral2,
    backgroundColor: MyColor.secondary,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  totalText: {
    fontSize: 18,
    fontFamily: "LatoRegular",
    color: MyColor.neutral,
  },
  totalAmount: {
    fontSize: 22,
    fontFamily: "LatoBold",
    color: MyColor.text,
  },
});

export default CartScreen;
