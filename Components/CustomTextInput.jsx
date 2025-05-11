import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Entypo } from "@expo/vector-icons";
import { MyColor } from "../Utils/MyColors";

const CustomTextInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  maxLength,
  autoCapitalize = "none",
  error,
  editable = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          secureTextEntry && styles.passwordContainer,
        ]}
      >
        <TextInput
          style={[styles.input, !editable && styles.disabledInput]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={MyColor.neutral}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          editable={editable}
          accessibilityLabel={label}
        />

        {secureTextEntry && (
          <Entypo
            name={isPasswordVisible ? "eye" : "eye-with-line"}
            size={24}
            color={MyColor.text}
            onPress={togglePasswordVisibility}
            accessibilityLabel={
              isPasswordVisible ? "Hide password" : "Show password"
            }
          />
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

CustomTextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  keyboardType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  maxLength: PropTypes.number,
  autoCapitalize: PropTypes.string,
  error: PropTypes.string,
  editable: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "LatoBold",
    color: MyColor.text,
    marginBottom: 10,
  },
  inputContainer: {
    borderBottomWidth: 2,
    borderColor: "#E3E3E3",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  inputContainerFocused: {
    borderColor: MyColor.primary,
  },
  inputContainerError: {
    borderColor: MyColor.error,
  },
  passwordContainer: {
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "LatoRegular",
    color: MyColor.text,
  },
  disabledInput: {
    opacity: 0.7,
  },
  errorText: {
    color: MyColor.error,
    fontSize: 12,
    marginTop: 5,
    fontFamily: "LatoRegular",
  },
});

export default CustomTextInput;
