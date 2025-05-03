import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/Colors";
import SegmentedControlTab from "react-native-segmented-control-tab";
import ActiveGames from "./ActiveGames";
import FinishedGames from "./FinishedGames";

const MyGames = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleIndexChange = (index) => {
    setSelectedIndex(index);
  };

  return (
    <LinearGradient
      colors={[Colors.background, Colors.gradientEnd]}
      style={styles.container}
    >
      <View style={styles.segmentContainer}>
        <SegmentedControlTab
          values={["Aktif Oyunlar", "Geçmiş"]}
          selectedIndex={selectedIndex}
          onTabPress={handleIndexChange}
          tabsContainerStyle={styles.tabsContainer}
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.activeTabStyle}
          tabTextStyle={styles.tabTextStyle}
          activeTabTextStyle={styles.activeTabTextStyle}
        />
      </View>

      <View style={styles.contentContainer}>
        {selectedIndex === 0 ? <ActiveGames /> : <FinishedGames />}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    marginTop: 40,
  },
  tabsContainer: {
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.statCardBackground,
    borderWidth: 1,
    borderColor: Colors.statCardBorder,
  },
  tabStyle: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
  },
  activeTabStyle: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    margin: 2,
  },
  tabTextStyle: {
    color: Colors.textSecondary,
    fontFamily: "Roboto-Medium",
    fontSize: 14,
  },
  activeTabTextStyle: {
    color: Colors.textPrimary,
    fontFamily: "Roboto-Bold",
  },
  contentContainer: {
    flex: 1,
  },
});

export default MyGames;
