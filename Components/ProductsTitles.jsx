import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { MyColor } from "../Utils/MyColors";

const ProductTitles = ({ title, onSeeAllPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        onPress={onSeeAllPress}
        accessibilityLabel={`See all ${title}`}
      >
        <Text style={styles.seeAll}>See all</Text>
      </TouchableOpacity>
    </View>
  );
};

ProductTitles.propTypes = {
  title: PropTypes.string.isRequired,
  onSeeAllPress: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: MyColor.text,
    fontFamily: "LatoBold",
  },
  seeAll: {
    fontSize: 16,
    color: MyColor.primary,
    fontFamily: "LatoRegular",
  },
});

export default memo(ProductTitles);
