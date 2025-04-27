import React, { use, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import CustomInput from "../atoms/CustomInput";
import CustomButton from "../atoms/CustomButton";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    console.log("Sign In clicked");
    if (!username || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    } else {
      console.log(username);
      console.log(password);
      onLogin(username, password);
    }
  };

  return (
    <View style={styles.formContainer}>
      <CustomInput
        placeholder="Enter your user name"
        value={username}
        onChangeText={setUsername}
      />

      <CustomInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <CustomButton title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});
export default LoginForm;
