import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "./screens/OnboardingScreen";
import AuthScreen from "./screens/AuthScreen";
import TabNavigator from "./navigation/TabNavigator";
import NewGame from "./screens/NewGame";
import { Colors } from "./constants/Colors";
import { AuthProvider, useAuth } from "./services/AuthContext"; // useAuth ekledik
import GameScreen from "./screens/GameScreen";
import ActiveGames from "./screens/ActiveGames";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth(); // Auth durumunu kontrol ediyoruz
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const firstLaunch = await AsyncStorage.getItem("isFirstLaunch");
        if (firstLaunch === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem("isFirstLaunch", "false");
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.log("Error checking first launch", error);
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <Stack.Navigator>
      {isFirstLaunch && (
        <Stack.Screen
          name="OnboardingScreen"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
      )}
      {!isAuthenticated ? (
        <Stack.Screen
          name="AuthScreen"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NewGame"
            component={NewGame}
            options={{
              title: "Yeni Oyun",
              headerShown: true,
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: Colors.background,
              },
              headerTintColor: Colors.primary,
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="GameScreen"
            component={GameScreen}
            options={{
              title: "Oyun",
              headerShown: true,
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: Colors.background,
              },
              headerTintColor: Colors.primary,
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="ActiveGames"
            component={ActiveGames}
            options={{
              title: "Aktif Oyunlarım",
              headerShown: true,
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: Colors.background,
              },
              headerTintColor: Colors.primary,
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
