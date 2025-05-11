import { Alert, Platform } from "react-native";

export const showAlert = (title, message, onOkPress = null) => {
  Alert.alert(title, message, [{ text: "OK", onPress: onOkPress }], {
    cancelable: false,
  });
};

export const formatPrice = (price, currency = "$") => {
  return `${currency}${parseFloat(price).toFixed(2)}`;
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};
