import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Appearance,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AuthContext from "../components/AuthContext";
import { globalStyles } from "../components/GlobalStyles";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth - 100; // 100 is the padding
const colorScheme = Appearance.getColorScheme();
const URI = process.env.EXPO_PUBLIC_NGROK_URL;

const Authentication = () => {
  const navigation = useNavigation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { container, image, text, text2, input, box, label, button, buttonText } = styles;

  const handleLogin = async () => {
    const response = await fetch(`${URI}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setUser(data);
      setIsLoggedIn(true);
      setEmail(""); // Reset email
      setPassword(""); // Reset password
      navigation.navigate("Tabs");
    } else {
      setErrorMessage("Invalid email or password");
    }
  };

  // ! For testing purposes only - remove before production
  useEffect(() => {
    setEmail("erica.ger@gmail.com");
    setPassword("password");
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate("Tabs");
    }
  }, [isLoggedIn, navigation]);

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={true}
    >
      <View style={container}>
        <StatusBar
          barStyle={colorScheme === "dark" ? "dark-content" : "light-content"}
        />
        <Image
          style={image}
          source={require("../../assets/Images/AppLogoV2.png")}
          resizeMode="contain"
        />
        <View style={box}>
          <Text style={[text, globalStyles.arialBold]}>Welcome Back</Text>
          <Text style={[text2, globalStyles.arialBold]}>Login to begin</Text>
          <Text style={[label, globalStyles.arialBold]}>Email</Text>
          <TextInput
            style={[input, globalStyles.arialNormal]}
            onChangeText={setEmail}
            value={email}
            placeholder="Enter your primary email here"
            keyboardType="email-address"
          />
          <Text style={[label, globalStyles.arialBold]}>Password</Text>
          <TextInput
            style={[input, globalStyles.arialNormal]}
            onChangeText={setPassword}
            value={password}
            placeholder="************"
            secureTextEntry
          />
          <Text></Text>
          {errorMessage ? (
            <Text style={{ color: "#DA583B", marginBottom: 5 }}>{errorMessage}</Text>
          ) : null}
          <View>
            <TouchableOpacity style={button} onPress={handleLogin}>
              <Text style={[buttonText, globalStyles.arialBold]}>LOG IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: imageSize,
    height: imageSize,
    alignSelf: "center",
  },
  text: {
    fontSize: 20,
    // fontWeight: "bold",
    textAlign: "left",
  },
  text2: {
    fontSize: 15,
    // fontWeight: "bold",
    textAlign: "left",
    paddingBottom: 10,
  },
  button: {
    backgroundColor: "#DA583B",
    padding: 3,
    borderRadius: 5,
    marginHorizontal: 0,
  },
  buttonText: {
    fontSize: 20,
    color: "#FFF",
    // fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "stretch",
  },
  box: {
    borderWidth: 0,
    borderColor: "gray",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 12,
    // fontWeight: "bold",
    marginTop: 20,
  },
});

export default Authentication;
