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

import { FontAwesome6 } from '@expo/vector-icons';

import AuthContext from "../components/AuthContext";
import { globalStyles } from "../components/GlobalStyles";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth - 100; // 100 is the padding
const colorScheme = Appearance.getColorScheme();
const URI = process.env.EXPO_PUBLIC_NGROK_URL;

const AccountSelection = () => {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState("");
  const { user, setUser, isLoggedIn, setIsLoggedIn, userMode, setUserMode, hasBothRoles, setHasBothRoles } = useContext(AuthContext);
  const { container, image, headingText, text2, input, box, label, button, buttonText } = styles;

  const handleCustomerSelect = () => {
    setUserMode('customer');
    navigation.navigate('Tabs');
  };

  const handleCourierSelect = () => {
    setUserMode('courier');
    navigation.navigate('CourierDeliveries');
  };

  useEffect(() => {
    if (!hasBothRoles) {
      if (userMode === 'customer') {
        navigation.navigate('Tabs');
      } else if (userMode === 'courier') {
        navigation.navigate('CourierDeliveries');
      } else if (userMode !== 'both'){
        navigation.navigate('Authentication');
      }
    }
  }, [userMode, hasBothRoles, navigation]);

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

        <Text style={[headingText, globalStyles.oswaldMedium]}>Select Account Type</Text>
        <Text></Text>
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={handleCustomerSelect}>
            <FontAwesome6 name="user-large" size={100} color="#DA583B" />
            <Text style={[styles.cardText, globalStyles.arialNormal]}>Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={handleCourierSelect}>
            <FontAwesome6 name="taxi" size={100} color="black" />
            <Text style={[styles.cardText, globalStyles.arialNormal]}>Courier</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAwareScrollView>
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
  headingText: {
    fontSize: 20,
    // fontWeight: "bold",
    textAlign: "center",
  },
  text2: {
    fontSize: 15,
    // fontWeight: "bold",
    textAlign: "left",
    paddingBottom: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  card: {
    width: '45%', // Adjust as needed
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    alignItems: 'center',
  },
  cardText: {
    marginTop: 10,
    fontSize: 18,
    // fontWeight: 'bold',
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

export default AccountSelection;
