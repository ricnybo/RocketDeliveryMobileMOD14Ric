import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import Restaurants from "../screens/Restaurants";
import OrderHistory from "../screens/OrderHistory";
import RestaurantMenuOrder from "../screens/RestaurantMenuOrder";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="RestaurantsHome" component={Restaurants} />
      <HomeStack.Screen
        name="RestaurantMenuOrder"
        component={RestaurantMenuOrder}
      />
    </HomeStack.Navigator>
  );
}

const TabBarButton = ({ accessibilityState, children, ...props }) => {
  const selected = accessibilityState.selected;

  return (
    <TouchableOpacity
      {...props}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ borderRadius: 10, padding: 5 }}>{children}</View>
    </TouchableOpacity>
  );
};

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#222126",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
        },
        tabBarButton: (props) => <TabBarButton {...props} />,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={"Restaurants"}
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIcon : styles.icon}>
              <Feather name="home" size={13} color="black" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={"Order History"}
        component={OrderHistory}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIcon : styles.icon}>
              <Feather
                name="clock"
                size={13}
                color={focused ? "#222126" : "black"}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 0,
  },
  activeIcon: {
    padding: 5,
    backgroundColor: "lightgrey",
    borderRadius: 15,
    paddingHorizontal: 20,
  },
});

export default Tabs;
