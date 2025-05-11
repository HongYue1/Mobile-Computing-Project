import React, { useState, memo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { dropdownData } from "../Utils/Data";

const DropdownItem = memo(({ item, isOpen, onToggle }) => {
  return (
    <View style={styles.dropdownItem}>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.dropdownHeader}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={item.title}
      >
        <Text style={styles.dropdownTitle}>{item.title}</Text>
        <AntDesign name={isOpen ? "down" : "right"} size={24} color="black" />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownContent}>
          <Text style={styles.dropdownText}>{item.content}</Text>
        </View>
      )}
    </View>
  );
});

const DropBox = ({ data = dropdownData }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleItem = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id || `dropdown-${item.title}`}
        renderItem={({ item, index }) => (
          <DropdownItem
            item={item}
            isOpen={activeIndex === index}
            onToggle={() => toggleItem(index)}
          />
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

DropBox.propTypes = {
  data: PropTypes.array,
};

DropdownItem.propTypes = {
  item: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  dropdownItem: {
    marginBottom: 5,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#E3E3E3",
    borderBottomWidth: 2,
    paddingVertical: 15,
  },
  dropdownTitle: {
    fontFamily: "LatoBold",
    fontSize: 16,
    color: "#333",
  },
  dropdownContent: {
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  dropdownText: {
    fontFamily: "LatoRegular",
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
});

export default memo(DropBox);
