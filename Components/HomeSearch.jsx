import React, { memo } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { AntDesign } from "@expo/vector-icons";
import { MyColor } from "../Utils/MyColors";

const HomeSearch = ({ onSearch }) => {
  return (
    <View style={styles.container}>
      <AntDesign name="search1" size={24} color="black" />
      <TextInput
        style={styles.input}
        placeholder="Search store"
        placeholderTextColor={MyColor.neutral}
        onChangeText={onSearch}
        accessibilityLabel="Search products"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: MyColor.neutral2,
    height: responsiveHeight(6.5),
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: "LatoRegular",
    fontSize: 16,
  },
});

export default memo(HomeSearch);
