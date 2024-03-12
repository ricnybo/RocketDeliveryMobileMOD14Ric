// Purpose: This file contains the screen for unauthorized access to the app. 
// It is displayed when a user tries to access a page without being logged in.
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../components/GlobalStyles";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth - 100; // 100 is the padding

// The Unauthorized component displays a message to the user when they 
// try to access a page without being logged in.
const Unauthorized = () => {
  const navigation = useNavigation();
  const { container, image, text, box, button, buttonText } = styles;

  return (
    <View style={container}>
      <Image
        style={image}
        source={require("../../assets/Images/AppLogoV2.png")}
        resizeMode="contain"
      />
      <View style={box}>
        <Text style={[text, globalStyles.arialBold]}>Unauthorized Access</Text>
        <TouchableOpacity
          style={button}
          onPress={() => navigation.navigate("Authentication")}
        >
          <Text style={[buttonText, globalStyles.arialBold]}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
  image: {
    width: imageSize,
    height: imageSize,
    alignSelf: "center",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
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
    textAlign: "center",
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
});

export default Unauthorized;
