import React from "react";
import {
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Colors } from "../../constants/Colors";

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 100,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 20,
    backgroundColor: "white",
    width: "100%",
    lineHeight: 20,
    fontSize: 13,
    textAlignVertical: "top",
    fontFamily: "roboto",
  },
});

export default CustomInput;
