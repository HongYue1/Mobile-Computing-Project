import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import { MyColor } from "../Utils/MyColors";

const CustomButton = ({
  title,
  onPress,
  style,
  textStyle,
  loading = false,
  disabled = false,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        disabled || loading ? styles.disabledButton : {},
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={MyColor.secondary} />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

CustomButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  accessibilityLabel: PropTypes.string,
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: MyColor.primary,
    borderRadius: 10,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    color: MyColor.secondary,
    fontSize: 18,
    fontFamily: "LatoBold",
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default CustomButton;
