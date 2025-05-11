import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Screen imports
import Splash from "./Screens/Splash";
import Login from "./Screens/Login";
import Signup from "./Screens/Signup";
import Home from "./Screens/Home";
import MapScreen from "./Screens/MapScreen";
import Details from "./Screens/Details";
import ProfileScreen from "./Screens/ProfileScreen";
import CartScreen from "./Screens/CartScreen"; // New screen
import CheckoutScreen from "./Screens/CheckoutScreen"; // New screen
import OrderConfirmationScreen from "./Screens/OrderConfirmationScreen"; // New screen

import { MyColor } from "./Utils/MyColors";
import { CartProvider, useCart } from "./Context/CartContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Bottom Tab Navigator for the main application sections
 */
function AppTabs() {
  const { cartItemCount } = useCart(); // Get cart item count for badge

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: MyColor.primary,
        tabBarInactiveTintColor: MyColor.neutral,
        tabBarStyle: {
          backgroundColor: MyColor.secondary,
          borderTopWidth: Platform.OS === "ios" ? 0.3 : 0.5,
          borderTopColor: MyColor.neutral2,
          height: Platform.OS === "ios" ? 90 : 65,
          paddingBottom: Platform.OS === "ios" ? 30 : 5,
          paddingTop: 5,
          elevation: 5, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontFamily: "LatoRegular",
          fontSize: 12,
          marginBottom: Platform.OS === "android" ? 5 : 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "LocationsTab") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "CartTab") {
            // New Cart Tab
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          if (!iconName) {
            iconName = "help-circle-outline";
          }
          return (
            <Ionicons
              name={iconName}
              size={focused ? size + 3 : size} // Slightly larger focused icon
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="LocationsTab"
        component={MapScreen}
        options={{ tabBarLabel: "Locations" }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: "Cart",
          tabBarBadge: cartItemCount > 0 ? cartItemCount : null,
          tabBarBadgeStyle: {
            backgroundColor: MyColor.error,
            color: MyColor.secondary,
            fontSize: 10,
          },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            navigationBarColor: MyColor.primary,
            contentStyle: { backgroundColor: MyColor.secondary },
          }}
        >
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="MainApp" component={AppTabs} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen
            name="OrderConfirmation"
            component={OrderConfirmationScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
