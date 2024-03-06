import React, { useState, useEffect } from "react";
import {
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Tabs from "./src/components/Tabs";
import * as Location from "expo-location";

import Authentication from "./src/screens/Authentication";
import Restaurants from "./src/screens/Restaurants";
import AuthContext from "./src/components/AuthContext";
import RestaurantMenuOrder from "./src/screens/RestaurantMenuOrder";

const App = () => {
  const { container } = styles;
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const Stack = createStackNavigator();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  if (location) {
    console.log(location);
  }

  const handleLogout = () => {
    setUser({});
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn, handleLogout }}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Authentication">
          <Stack.Screen
            name="Authentication"
            component={Authentication}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Restaurants"
            component={Restaurants}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RestaurantMenuOrder"
            component={RestaurantMenuOrder}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

export default App;