import React, { useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import CustomInput from "../atoms/CustomInput";
import CustomButton from "../atoms/CustomButton";

const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler uyuşmuyor.");
      return;
    }
    onRegister(username, email, password);
  };

  return (
    <View style={styles.formContainer}>
      <CustomInput
        placeholder="Kullanıcı adınızı girin"
        value={username}
        onChangeText={setUsername}
      />

      <CustomInput
        placeholder="E-posta adresinizi girin"
        value={email}
        onChangeText={setEmail}
      />
      <CustomInput
        placeholder="Şifrenizi girin"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <CustomInput
        placeholder="Şifrenizi tekrar girin"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />
      <CustomButton title="Kayıt Ol" onPress={handleRegister} />
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

export default RegisterForm;
