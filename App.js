import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Tabs from "./src/components/Tabs";
import TabsCourier from "./src/components/TabsCourier";
import * as Location from "expo-location";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthContext from "./src/components/AuthContext";
import Authentication from "./src/screens/Authentication";
import Restaurants from "./src/screens/Restaurants";
import RestaurantMenuOrder from "./src/screens/RestaurantMenuOrder";
import OrderHistory from "./src/screens/OrderHistory";
import AccountSelection from "./src/screens/AccountSelection";
import CourierDeliveries from "./src/screens/CourierDeliveries";
import CustomerAccount from "./src/screens/CustomerAccount";
import CourierAccount from "./src/screens/CourierAccount";
import Unauthorized from "./src/screens/Unauthorized";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [userMode, setUserMode] = useState(null);
  const [hasBothRoles, setHasBothRoles] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const Stack = createStackNavigator();

  const { container } = styles;

  const [fontsLoaded, fontError] = useFonts({
    Oswald: require("./assets/fonts/Oswald-Regular.ttf"),
    "Oswald-Bold": require("./assets/fonts/Oswald-Bold.ttf"),
    "Oswald-Light": require("./assets/fonts/Oswald-Light.ttf"),
    "Oswald-ExtraLight": require("./assets/fonts/Oswald-ExtraLight.ttf"),
    "Oswald-Medium": require("./assets/fonts/Oswald-Medium.ttf"),
    "Oswald-SemiBold": require("./assets/fonts/Oswald-SemiBold.ttf"),
    Arial: require("./assets/fonts/arial.ttf"),
    "Arial-Bold": require("./assets/fonts/arialbd.ttf"),
    "Arial-Italic": require("./assets/fonts/ariali.ttf"),
    "Arial-Bold-Italic": require("./assets/fonts/arialbi.ttf"),
  });

  // Used for persistant sign in
  useEffect(() => {
    const bootstrapAsync = async () => {
      let userData;

      try {
        userData = await AsyncStorage.getItem("user");
      } catch (e) {
        // Restoring token failed
      }

      if (userData) {
        userData = JSON.parse(userData);
        setUser(userData);
        setIsLoggedIn(true);

        if (userData.customer_id && userData.courier_id) {
          setUserMode("both");
        } else if (userData.customer_id) {
          setUserMode("customer");
        } else if (userData.courier_id) {
          setUserMode("courier");
        } else {
          setUserMode("unauthorized");
        }
      }
    };

    bootstrapAsync();
  }, []);

  // * Loaction services.  Left in place for future use.
  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setError("permission to access location was denied");
  //       return;
  //     }
  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);

  // if (location) {
  //   console.log(location);
  // }

  if (!fontsLoaded) {
    if (fontError) {
      console.error(fontError);
    }
    return null;
  }

  if (fontsLoaded) {
    SplashScreen.hideAsync();
  }


  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    setUser({});
    setIsLoggedIn(false);
    setUserMode("unauthorized");
  };

  return (
    <AuthContext.Provider // * This is where data is set into the AuthContext
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        handleLogout,
        userMode,
        setUserMode,
        hasBothRoles,
        setHasBothRoles,
      }}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Authentication">
          <Stack.Screen
            name="Authentication"
            component={Authentication}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AccountSelection"
            component={AccountSelection}
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
          <Stack.Screen
            name="OrderHistory"
            component={OrderHistory}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CustomerAccount"
            component={AccountSelection}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TabsCourier"
            component={TabsCourier}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CourierDeliveries"
            component={CourierDeliveries}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CourierAccount"
            component={CustomerAccount}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Unauthorized"
            component={Unauthorized}
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
