import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MyColor } from "../Utils/MyColors.js";
import { useFontsLoader } from "../Utils/MyFonts.jsx";
import HomeIcon from "../Components/HomeIcon.jsx";
import HomeSearch from "../Components/HomeSearch.jsx";
import HomeBanner from "../Components/HomeBanner.jsx";
import ProductTitles from "../Components/ProductsTitles.jsx";
import ProductCarousel from "../Components/ProductCarousel.jsx";
import { fruits as initialFruitsData } from "../Utils/Data.js";

const Home = () => {
  const [fontsLoaded] = useFontsLoader();

  const [searchTerm, setSearchTerm] = useState("");
  const [exclusiveOfferFruits, setExclusiveOfferFruits] =
    useState(initialFruitsData);
  const [bestSellingFruits, setBestSellingFruits] = useState(
    initialFruitsData.slice(0, 2)
  );

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    if (!lowercasedFilter) {
      setExclusiveOfferFruits(initialFruitsData);
      setBestSellingFruits(initialFruitsData.slice(0, 2));
    } else {
      const filtered = initialFruitsData.filter((fruit) =>
        fruit.name.toLowerCase().includes(lowercasedFilter)
      );
      setExclusiveOfferFruits(filtered);
      setBestSellingFruits(filtered.slice(0, 2));
    }
  }, [searchTerm]);

  const handleSearch = useCallback((text) => {
    setSearchTerm(text);
  }, []);

  const handleSeeAll = (category) => {
    console.log(`See all for ${category}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentContainer}>
              <HomeIcon />
              <HomeSearch onSearch={handleSearch} />
              <HomeBanner />
              <ProductTitles
                title="Exclusive Offer"
                onSeeAllPress={() => handleSeeAll("exclusive")}
              />
              <ProductCarousel data={exclusiveOfferFruits} />
              <ProductTitles
                title="Best Selling"
                onSeeAllPress={() => handleSeeAll("bestselling")}
              />
              <ProductCarousel data={bestSellingFruits} />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MyColor.secondary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  contentContainer: {
    gap: 20,
    paddingBottom: 20,
  },
});

export default Home;
