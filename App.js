import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthScreen from "./screens/AuthScreen";
import TabNavigator from "./navigation/TabNavigator";
import NewGame from "./screens/NewGame";
import { Colors } from "./constants/Colors";
import { AuthProvider, useAuth } from "./services/AuthContext";
import GameScreen from "./screens/GameScreen";
import ActiveGames from "./screens/ActiveGames";
import FinishedGames from "./screens/FinishedGames";
import { StatusBar } from "react-native";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <Stack.Navigator>
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
              options={{ headerShown: false, headerBackTitle: "Geri" }}
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
                headerTintColor: "white",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
                headerBackTitle: "Back",
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
                headerTintColor: "white",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
                headerBackTitle: "Back",
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
                headerTintColor: "white",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
                headerBackTitle: "Back",
              }}
            />
            <Stack.Screen
              name="FinishedGames"
              component={FinishedGames}
              options={{
                title: "Biten Oyunlarım",
                headerShown: true,
                headerTitleAlign: "center",
                headerStyle: {
                  backgroundColor: Colors.background,
                },
                headerTintColor: "white",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
                headerBackTitle: "Back",
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
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
