import React, { useState, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import DropBox from "../Components/DropBox";
import { MyColor } from "../Utils/MyColors";
import {
  formatPrice,
  capitalizeFirstLetter,
  showAlert,
} from "../Utils/helpers";
import CustomButton from "../Components/CustomButton";
import { useCart } from "../Context/CartContext";

const Details = () => {
  const route = useRoute();
  const { main: product } = route.params;
  const { id, name, pieces, price, img, weight } = product; // Added id
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItems } = useCart();

  const handleAddToCart = () => {
    if (!product.id) {
      showAlert("Error", "Product ID is missing. Cannot add to cart.");
      return;
    }
    addToCart(product, quantity);
    showAlert(
      "Added to Basket",
      `${quantity} x ${capitalizeFirstLetter(
        name
      )} has been successfully added to your basket.`
    );
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const itemInCart = cartItems.find((item) => item.id === product.id);
  const buttonTitle = itemInCart
    ? `Add More (${itemInCart.quantity} in cart)`
    : "Add to Basket";

  const handleShare = () => {
    showAlert("Share", "Sharing functionality to be implemented!");
  };

  const handleFavorite = () => {
    showAlert("Favorite", "Favorite functionality to be implemented!");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            style={styles.productImage}
            source={{ uri: img }}
            accessibilityLabel={`${name} product image`}
          />
        </View>

        <View
          style={[
            styles.headerButtons,
            { top: Platform.OS === "ios" ? 45 : 15 },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={MyColor.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShare}
            accessibilityLabel="Share this product"
            accessibilityRole="button"
          >
            <Feather name="share" size={22} color={MyColor.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.productTitle}>
              {capitalizeFirstLetter(name)}
            </Text>
            <TouchableOpacity
              onPress={handleFavorite}
              accessibilityLabel="Add to favorites"
              accessibilityRole="button"
            >
              <MaterialIcons
                name="favorite-border"
                size={30}
                color={MyColor.text}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.productInfo}>
            {weight || "1 Kilogram"}, {pieces || "N/A pieces"}
          </Text>

          <View style={styles.priceQuantityContainer}>
            <Text style={styles.productPrice}>{formatPrice(price)}</Text>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decreaseQuantity}
                accessibilityLabel="Decrease quantity"
                accessibilityRole="button"
                disabled={quantity <= 1}
              >
                <Text
                  style={[
                    styles.quantityButtonText,
                    quantity <= 1 && styles.disabledQuantityButtonText,
                  ]}
                >
                  -
                </Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={increaseQuantity}
                accessibilityLabel="Increase quantity"
                accessibilityRole="button"
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <DropBox />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <CustomButton
          title={buttonTitle}
          onPress={handleAddToCart}
          accessibilityLabel={`Add ${quantity} ${capitalizeFirstLetter(
            name
          )} to basket`}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColor.neutral2,
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: MyColor.secondary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 20,
    alignItems: "center",
    minHeight: 300,
    justifyContent: "center",
  },
  productImage: {
    height: 250,
    width: "80%",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: "100%",
    paddingHorizontal: 20,
  },
  iconButton: {
    backgroundColor: MyColor.secondary,
    borderRadius: 25,
    padding: 10,
    shadowColor: MyColor.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: MyColor.neutral2,
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 26,
    color: MyColor.text,
    fontFamily: "LatoBold",
    flex: 1,
    marginRight: 10,
  },
  productInfo: {
    marginBottom: 15,
    fontSize: 16,
    color: MyColor.neutral,
    fontFamily: "LatoRegular",
  },
  productPrice: {
    fontSize: 30,
    color: MyColor.primary,
    fontFamily: "LatoBold",
  },
  priceQuantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MyColor.secondary,
    borderWidth: 1,
    borderColor: MyColor.neutral2,
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  quantityButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 22,
    fontFamily: "LatoBold",
    color: MyColor.primary,
  },
  disabledQuantityButtonText: {
    color: MyColor.neutral,
  },
  quantityText: {
    fontSize: 18,
    fontFamily: "LatoBold",
    paddingHorizontal: 18,
    color: MyColor.text,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: MyColor.neutral2,
    backgroundColor: MyColor.secondary,
  },
});

export default memo(Details);
