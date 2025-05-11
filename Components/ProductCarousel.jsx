import React, { memo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";
import { MyColor } from "../Utils/MyColors";
import {
  capitalizeFirstLetter,
  formatPrice,
  showAlert,
} from "../Utils/helpers";
import { useCart } from "../Context/CartContext";

const ProductCard = memo(({ item, onPress }) => {
  const { addToCart } = useCart();

  const handleAddToCartPress = (product) => {
    // Ensure product has an id
    if (!product.id) {
      showAlert("Error", "Product ID is missing. Cannot add to cart.");
      return;
    }
    addToCart(product, 1);
    showAlert(
      "Added to Cart",
      `${capitalizeFirstLetter(product.name)} has been added to your cart.`
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.card}
      accessibilityLabel={`${item.name} product card`}
      accessibilityRole="button"
    >
      <Image
        style={styles.productImage}
        source={{ uri: item.img }}
        accessibilityLabel={item.name}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {capitalizeFirstLetter(item.name)}
        </Text>
        <Text style={styles.productWeight} numberOfLines={1}>
          {item.weight || "1 Kilogram"}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
          <TouchableOpacity
            onPress={() => handleAddToCartPress(item)}
            accessibilityLabel={`Add ${item.name} to cart`}
            style={styles.addToCartButton}
          >
            <FontAwesome name="plus-square" size={30} color={MyColor.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ProductCarousel = ({ data = [] }) => {
  const navigation = useNavigation();

  const handleProductPress = (item) => {
    navigation.navigate("Details", {
      main: item,
    });
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={
        (item) =>
          item.id || `product-${item.name}-${item.price}-${Math.random()}` // Make key more unique
      }
      renderItem={({ item }) => (
        <ProductCard item={item} onPress={() => handleProductPress(item)} />
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

ProductCarousel.propTypes = {
  data: PropTypes.array,
};

ProductCard.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 15,
    paddingLeft: 5,
    minHeight: responsiveHeight(28) + 30,
  },
  card: {
    height: responsiveHeight(28),
    width: responsiveWidth(45),
    marginRight: 15,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: MyColor.neutral2,
    borderRadius: 15,
    backgroundColor: MyColor.secondary,
    shadowColor: MyColor.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    height: 110,
    width: "90%",
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: 10,
    marginBottom: 5,
  },
  productInfo: {
    paddingHorizontal: 12,
    paddingTop: 5,
    flex: 1,
    justifyContent: "space-around",
  },
  productName: {
    fontSize: 17,
    fontFamily: "LatoBold",
    color: MyColor.text,
  },
  productWeight: {
    color: MyColor.neutral,
    fontFamily: "LatoRegular",
    fontSize: 13,
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontFamily: "LatoBold",
    color: MyColor.text,
  },
  addToCartButton: {
    padding: 5,
  },
});

export default memo(ProductCarousel);
