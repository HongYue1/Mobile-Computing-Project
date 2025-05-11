import React, { memo } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import { MyColor } from "../Utils/MyColors";
import PropTypes from "prop-types";

const HomeIcon = ({ size = 0.18 }) => {
  const { width } = Dimensions.get("window");
  const iconSize = width * size;

  return (
    <View style={styles.container}>
      <Image
        style={[styles.image, { height: iconSize, width: iconSize }]}
        source={require("../assets/logo.png")}
        accessibilityLabel="Harvest Hub logo"
      />
    </View>
  );
};

HomeIcon.propTypes = {
  size: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    tintColor: MyColor.primary,
    resizeMode: "contain",
  },
});

export default memo(HomeIcon);
