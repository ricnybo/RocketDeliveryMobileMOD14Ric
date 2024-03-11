import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AuthContext from "../components/AuthContext";
import { useContext } from "react";

import { globalStyles } from "../components/GlobalStyles";

const NavBar = () => {
  const navigation = useNavigation();
  const { handleLogout, setUser, setIsLoggedIn } = useContext(AuthContext);
  const { container, image, button, buttonText } = styles;

  const onLogout = async () => {
    handleLogout();
    navigation.navigate("Authentication");
  };

  return (
    <View style={container}>
      <Image
        style={image}
        source={require("../../assets/Images/AppLogoV1.png")}
        resizeMode="contain"
      />
      <TouchableOpacity style={button} onPress={onLogout}>
        <Text style={buttonText}>LOG OUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 65,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 5,
  },
  image: {
    width: 175,
    height: 65,
    alignSelf: "center",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 0,
  },
  button: {
    backgroundColor: "#DA583B",
    height: 40,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: globalStyles.oswaldBold.fontFamily,
    color: "#FFF",
    textAlign: "center",
  },
});

export default NavBar;
