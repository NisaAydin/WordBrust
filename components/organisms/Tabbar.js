import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";

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
          const label = options.tabBarLabel || options.title || route.name;
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
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tab}
            >
              <View style={[styles.tabContent, isFocused && styles.activeTab]}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={
                      isFocused
                        ? tabIcons[route.name].active
                        : tabIcons[route.name].inactive
                    }
                    size={28}
                    color={isFocused ? Colors.primary : Colors.gray}
                  />
                  {isFocused && <View style={styles.activeIndicator} />}
                </View>
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
    backgroundColor: Colors.secondary,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 30,
    height: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  activeTab: {
    // Aktif tab özel stil
  },
  iconContainer: {
    position: "relative",
    marginBottom: 4,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: "500",
  },
  activeLabel: {
    color: Colors.primary,
    fontWeight: "600",
  },
});

export default TabBar;
