import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const TabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const tabIcons = {
    Home: { active: "home", inactive: "home-outline" },
    MyGames: {
      active: "game-controller",
      inactive: "game-controller-outline",
    },
    Profile: { active: "person", inactive: "person-outline" },
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBarWrapper}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const labelMap = {
            Home: "Ana Sayfa",
            MyGames: "Oyunlarım",
            Profile: "Profilim",
          };
          const label = labelMap[route.name] || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.8}
            >
              <View style={styles.tabContent}>
                <Ionicons
                  name={
                    isFocused
                      ? tabIcons[route.name].active
                      : tabIcons[route.name].inactive
                  }
                  size={26}
                  color={isFocused ? "#9966FF" : "#D9D9D9"} // Exact hex colors
                  style={styles.icon}
                />
                <Text style={[styles.label, isFocused && styles.activeLabel]}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  tabBarWrapper: {
    flexDirection: "row",
    backgroundColor: "#1A0033", // Dark purple background
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 20,
    height: 70,
    borderWidth: 1,
    borderColor: "#9966FF", // Light purple border
    shadowColor: "#9966FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingTop: 8,
  },
  icon: {
    marginBottom: 4,
  },

  label: {
    fontSize: 12,
    fontFamily: "Roboto-Medium",
    color: "#D9D9D9", // Inactive text color
  },
  activeLabel: {
    color: "#9966FF", // Active text color
    fontFamily: "Roboto-Bold",
  },
});

export default TabBar;
