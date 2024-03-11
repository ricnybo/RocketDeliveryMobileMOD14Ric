import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, FontAwesome6, FontAwesome5 } from "@expo/vector-icons";

import CourierDeliveries from "../screens/CourierDeliveries";
import CourierAccount from "../screens/CourierAccount";

const TabCourier = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="CourierDeliveries" component={CourierDeliveries} />
      {/* <HomeStack.Screen
        name="CourierDeliveries"
        component={RestaurantMenuOrder}
      /> */}
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

const TabsCourier = () => {
  return (
    <TabCourier.Navigator
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
      <TabCourier.Screen
        name={"Deliveries"}
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIcon : styles.icon}>
              <FontAwesome5 name="history" size={13} color="black" />
            </View>
          ),
        }}
      />
      <TabCourier.Screen
        name={"Account"}
        component={CourierAccount}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIcon : styles.icon}>
              <FontAwesome6 name="user-large" size={13} color='black' />
            </View>
          ),
        }}
      />
    </TabCourier.Navigator>
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
    paddingHorizontal: 9,
  },
});

export default TabsCourier;
