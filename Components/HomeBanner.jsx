import React, { memo } from "react";
import { View, Image, StyleSheet } from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";

const HomeBanner = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.bannerImage}
        source={require("../assets/banner3.png")}
        accessibilityLabel="Promotional banner"
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  bannerImage: {
    height: responsiveHeight(15),
    width: "100%",
    borderRadius: 10,
  },
});

export default memo(HomeBanner);
