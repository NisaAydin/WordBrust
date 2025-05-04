import React, { use, useState } from "react";
import { View, Text, StyleSheet, Alert, Switch } from "react-native";
import CustomInput from "../atoms/CustomInput";
import CustomButton from "../atoms/CustomButton";
import { Colors } from "../../constants/Colors";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = () => {
    console.log("Sign In clicked");
    if (!username || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    } else {
      console.log(username);
      console.log(password);
      console.log(rememberMe);
      onLogin(username, password, rememberMe);
    }
  };

  return (
    <View style={styles.formContainer}>
      <CustomInput
        placeholder="Kullanıcı adınızı girin"
        value={username}
        onChangeText={setUsername}
      />

      <CustomInput
        placeholder="Şifrenizi girin"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <View style={styles.rememberMeContainer}>
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
          thumbColor={rememberMe ? Colors.secondaryButtonBorder : "#ffffff"}
          trackColor={{
            false: "#E0E0E0",
            true: Colors.secondaryButtonBackground,
          }}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
        <Text style={styles.rememberMeText}>Beni hatırla</Text>
      </View>
      <CustomButton title="Giriş Yap" onPress={handleSignIn} />
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
  formContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rememberMeText: {
    fontSize: 13,
    marginLeft: 5,
    color: "#333",
  },
});
export default LoginForm;
