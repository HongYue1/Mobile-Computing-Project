import React, { memo, useRef } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MyColor } from "../Utils/MyColors";

const MapScreen = () => {
  const mapRef = useRef(null);

  const initialRegion = {
    latitude: 29.851227037153528,
    longitude: 31.342152839606864,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Store locations
  const storeLocations = [
    {
      id: "store-1",
      coordinate: { latitude: 29.851227, longitude: 31.34215 },
      title: "Helwan Store",
      description: "Our main location with full product selection.",
    },
    {
      id: "store-2",
      coordinate: { latitude: 29.861227, longitude: 31.35215 },
      title: "Helwan 2 Market Store",
      description: "Specializing in organic produce.",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      <View style={styles.customHeader}>
        <Text style={styles.headerTitle}>Store Locations</Text>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        accessibilityLabel="Map showing store locations"
      >
        {storeLocations.map((store) => (
          <Marker
            key={store.id}
            coordinate={store.coordinate}
            title={store.title}
            description={store.description}
            pinColor={MyColor.primary}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColor.secondary,
  },
  customHeader: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: MyColor.secondary,
    borderBottomWidth: 0.5,
    borderBottomColor: MyColor.neutral2,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "LatoBold",
    color: MyColor.text,
    textAlign: "center",
  },
  map: {
    flex: 1,
  },
});

export default memo(MapScreen);
