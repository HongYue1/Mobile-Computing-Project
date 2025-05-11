import { useFonts } from "expo-font";

/**
 * Custom hook to load application fonts
 * @returns {[boolean, Error | null]} - Array containing [fontsLoaded, error]
 */
export const useFontsLoader = () => {
  const [loaded, error] = useFonts({
    LatoBold: require("../assets/Fonts/Lato-Bold.ttf"),
    LatoRegular: require("../assets/Fonts/Lato-Regular.ttf"),
    pacifico: require("../assets/Fonts/Pacifico-Regular.ttf"),
    delius: require("../assets/Fonts/Delius-Regular.ttf"),
  });

  return [loaded, error];
};
