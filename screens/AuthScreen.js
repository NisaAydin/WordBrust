import React, { use, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Colors } from "../constants/Colors";
import Circle from "../components/atoms/Circle";
import LoginForm from "../components/organisms/LoginForm";
import RegisterForm from "../components/organisms/RegisterForm";
import { AuthService } from "../services/AuthService";
import { useAuth } from "../services/AuthContext";

const { height } = Dimensions.get("window");

const AuthScreen = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleLogin = async (username, password, rememberMe) => {
    setLoading(true);
    console.log(rememberMe);
    try {
      const response = await login(username, password, rememberMe);
      if (response.status === 200) {
        Alert.alert("Giriş başarılı.");
      }
    } catch (error) {
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      await register(username, email, password);
      Alert.alert("Başarılı", "Giriş ekranına yönlendiriliyorsunuz.");
      setSelectedIndex(0);
    } catch (error) {
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    if (selectedIndex === 0) {
      return (
        <>
          <Text style={styles.headerText}>Giriş Yap</Text>
          <Text style={styles.subheaderText}>Tekrar hoş geldin.</Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.headerText}>Kayıt Ol</Text>
          <Text style={styles.subheaderText}>
            Başlamak için yeni bir hesap oluştur.
          </Text>
        </>
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Circle size={200} position={{ left: -20, top: -100 }} />
          <Circle size={200} position={{ left: -100, top: -50 }} />

          <View style={styles.segmentedControlContainer}>
            <SegmentedControlTab
              values={["Giriş Yap", "Kayıt Ol"]}
              selectedIndex={selectedIndex}
              onTabPress={(index) => setSelectedIndex(index)}
              tabsContainerStyle={styles.tabsContainer}
              tabStyle={styles.tabStyle}
              activeTabStyle={styles.activeTabStyle}
              tabTextStyle={styles.tabTextStyle}
            />
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}

          <View style={styles.headerContainer}>{renderHeader()}</View>

          <View style={styles.formContainer}>
            {selectedIndex === 0 ? (
              <LoginForm onLogin={handleLogin} />
            ) : (
              <RegisterForm onRegister={handleRegister} />
            )}
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {selectedIndex === 0
                ? "Hesabın yok mu?"
                : "Zaten bir hesabın var mı?"}
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedIndex(selectedIndex === 0 ? 1 : 0)}
            >
              <Text style={styles.textButton}>
                {selectedIndex === 0 ? "Kayıt Ol" : "Giriş Yap"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light,
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
    paddingBottom: 40,
  },
  segmentedControlContainer: {
    width: "100%",
    marginTop: height / 4,
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tabStyle: {
    borderColor: "#A1A1A1",
    borderWidth: 1,
  },
  activeTabStyle: {
    backgroundColor: Colors.primary,
  },
  tabTextStyle: {
    color: Colors.primary,
    fontSize: 14,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "flex-start",
    width: "90%",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  subheaderText: {
    fontSize: 14,
    color: "black",
  },
  formContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#333",
  },
  textButton: {
    marginLeft: 3,
    color: Colors.primary,
    fontWeight: "bold",
  },
});

export default AuthScreen;
