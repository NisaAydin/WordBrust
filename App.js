import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "./screens/OnboardingScreen";
import AuthScreen from "./screens/AuthScreen";
import TabNavigator from "./navigation/TabNavigator"; // TabNavigator'ı import ettik
import NewGame from "./screens/NewGame";
import { Colors } from "./constants/Colors";
import { AuthProvider } from "./services/AuthContext";
import GameScreen from "./screens/GameScreen";

const Stack = createStackNavigator();
const App = () => {
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
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isFirstLaunch === true ? (
            <Stack.Screen
              name="OnboardingScreen"
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="AuthScreen"
              component={AuthScreen}
              options={{ headerShown: false }}
            />
          )}
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

              cardOverlayEnabled: true,
              cardStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen
            name="GameScreen"
            component={GameScreen} // GameScreen'i buraya ekleyeceğiz
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
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
