// Purpose: Provide a screen for the customer to view a list of nearby 
// restaurants and filter the list based on rating and price range.
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Appearance,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import fetch from "node-fetch";
import { useState, useEffect, useContext } from "react";

import { AntDesign, FontAwesome } from "@expo/vector-icons";

import AuthContext from "../components/AuthContext";
import { globalStyles } from "../components/GlobalStyles";
import NavBar from "../components/NavBar";
import RestaurantCard from "../components/RestaurantCard";

const URI = process.env.EXPO_PUBLIC_NGROK_URL;
const colorScheme = Appearance.getColorScheme();

const Restaurants = ({ navigation }) => {
  const {
    container,
    subContainer,
    headingText,
    button,
    buttonText,
    buttonContainer,
    buttonPair,
    label,
    restaurantContainer,
  } = styles;

  const [list, setList] = useState([]);
  const [rating, setRating] = useState("-- Select --");
  const [ratingLabel, setRatingLabel] = useState("-- Select --");
  const [priceRange, setPriceRange] = useState("-- Select --");
  const [priceRangeLabel, setPriceRangeLabel] = useState("-- Select --");
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);
  const [isPriceRangeModalVisible, setPriceRangeModalVisible] = useState(false);
  const {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    userMode,
    setUserMode,
    hasBothRoles,
    setHasBothRoles,
  } = useContext(AuthContext);

  // Create an array of objects to represent the ratings.  Each object has a
  // label and a value.  The label is a string of stars and the value is the
  // number of stars.  The value is used to filter the list of restaurants.
  const ratings = [
    { label: "-- Select --", value: "-- Select --" },
    { label: "*", value: 1 },
    { label: "**", value: 2 },
    { label: "***", value: 3 },
    { label: "****", value: 4 },
    { label: "*****", value: 5 },
  ].map((item) => {
    if (item.value !== "-- Select --") {
      const starCount = item.label.length;
      const stars = [...Array(starCount)].map((_, i) => (
        <FontAwesome key={i} name="star" size={14} color="black" />
      ));
      return { ...item, label: stars };
    } else {
      return item;
    }
  });

  // Create an array of objects to represent the price ranges.  Each object has
  // a label and a value.  The label is a string of dollar signs and the value
  // is the number of dollar signs.  The value is used to filter the list of
  // restaurants.
  const priceRanges = [
    { label: "-- Select --", value: "-- Select --" },
    { label: "$", value: 1 },
    { label: "$$", value: 2 },
    { label: "$$$", value: 3 },
  ];

  // Fetch the list of restaurants from the server.  The query parameters are
  // based on the state of the component.  The query parameters are added to the
  // URI as a query string.  The query string is then used to fetch the list of
  // restaurants from the server.
  const fetchList = async () => {
    const queryParams = {};

    // Add query parameters to the object if they are not the default value.
    if (rating !== "-- Select --") {
      queryParams.rating = parseInt(rating);
    }
    if (priceRange !== "-- Select --") {
      queryParams.price_range = parseInt(priceRange);
    }

    // Convert the object to a query string.  This allows for the inclusion or
    // omission of query parameters based on the state of the component.
    const queryString = Object.keys(queryParams)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(queryParams[key])
      )
      .join("&");
    const response = await fetch(`${URI}/api/restaurants?${queryString}`)
      .then((response) => response.json())
      .then((data) => setList(data))
      .catch((error) => console.error(error));
  };

  // Fetch the list of restaurants when the component mounts.  This will fetch
  // the list of restaurants with the default query parameters.
  useEffect(() => {
    fetchList();
  }, [rating, priceRange]);

  // If the user is not logged in or does not have both roles, redirect to the
  // Authentication screen.  If the user is a courier, redirect to the
  // CourierDeliveries screen.
  useEffect(() => {
    if (userMode === "courier") {
      navigation.navigate("CourierDeliveries");
    } else if (userMode !== "customer") {
      navigation.navigate("Authentication");
    }
  }, [userMode, navigation]);

  // Handle the selection of a rating.  If the rating is the default value,
  // set the rating and rating label to the default value.  Otherwise, set the
  // rating and rating label to the selected value.  Then, close the rating
  // modal.
  const handleSelectRating = (rating, label) => {
    if (rating === "-- Select --") {
      setRating(rating);
      setRatingLabel(label);
    } else {
      const starCount = label.length;
      const stars = [...Array(starCount)].map((_, i) => (
        <StarIcon key={i} color="black" />
      ));
      setRating(rating);
      setRatingLabel(stars);
    }
    handleCloseRatingModal();
  };

  // Handle the selection of a price range.  If the price range is the default
  // value, set the price range and price range label to the default value.
  // Otherwise, set the price range and price range label to the selected value.
  // Then, close the price range modal.
  const handleSelectPriceRange = (priceRange, label) => {
    setPriceRange(priceRange);
    setPriceRangeLabel(label);
    handleClosePriceRangeModal();
  };

  const handleOpenRatingModal = () => {
    setRatingModalVisible(true);
  };

  const handleCloseRatingModal = () => {
    setRatingModalVisible(false);
  };

  const handleOpenPriceRangeModal = () => {
    setPriceRangeModalVisible(true);
  };

  const handleClosePriceRangeModal = () => {
    setPriceRangeModalVisible(false);
  };

  // Create a component to represent a star icon.  The component takes a color
  // prop to set the color of the star icon.
  const StarIcon = ({ color }) => (
    <FontAwesome name="star" size={14} color={color} />
  );

  return (
    <View style={container}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "dark-content" : "light-content"}
      />
      <NavBar navigation={navigation} />
      <ScrollView style={subContainer}>
        <Text style={headingText}>NEARBY RESTAURANTS</Text>
        <View style={buttonContainer}>
          <View style={buttonPair}>
            <Text style={label}>Rating</Text>
            <TouchableOpacity style={button} onPress={handleOpenRatingModal}>
              <Text style={buttonText}>
                {Array.isArray(ratingLabel)
                  ? ratingLabel.map((star, i) =>
                      React.cloneElement(star, { color: "white", key: i })
                    )
                  : ratingLabel}{" "}
                <AntDesign name="caretdown" size={15} color="white" />
              </Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isRatingModalVisible}
              onRequestClose={handleCloseRatingModal}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={ratings}
                    keyExtractor={(item) => item.label}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          handleSelectRating(item.value, item.label, "#000")
                        }
                      >
                        <Text style={styles.modalText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </Modal>
          </View>
          <View style={buttonPair}>
            <Text style={label}>Price</Text>
            <TouchableOpacity
              style={button}
              onPress={handleOpenPriceRangeModal}
            >
              <Text style={buttonText}>
                {priceRangeLabel}{" "}
                <AntDesign name="caretdown" size={15} color="white" />
              </Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isPriceRangeModalVisible}
              onRequestClose={handleClosePriceRangeModal}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={priceRanges}
                    keyExtractor={(item) => item.label}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          handleSelectPriceRange(item.value, item.label)
                        }
                      >
                        <Text style={styles.modalText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </Modal>
          </View>
        </View>
        <Text style={headingText}>RESTAURANTS</Text>
        <View style={restaurantContainer}>
          {list.map((restaurant, index) => (
            <RestaurantCard key={index} restaurant={restaurant} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#F0F0F0",
  },
  subContainer: {
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: "center",
  },
  headingText: {
    fontSize: 18,
    fontFamily: globalStyles.oswaldMedium.fontFamily,
    textAlign: "left",
    marginVertical: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  buttonPair: {
    alignItems: "left",
  },
  button: {
    backgroundColor: "#DA583B",
    padding: 0,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginHorizontal: 5,
    alignSelf: "stretch",
    width: 165,
    height: 50,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: globalStyles.arialNormal.fontFamily,
    color: "#FFF",
    textAlign: "center",
  },
  label: {
    fontSize: 20,
    fontFamily: globalStyles.oswaldMedium.fontFamily,
    marginTop: 20,
    marginHorizontal: 5,
  },
  restaurantContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  picker: {
    height: 50,
    width: 150,
    backgroundColor: "#DA583B",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
  },
  pickerItem: {
    height: 50,
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "95%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    width: "95%",
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "normal",
    color: "white",
  },
  modalCloseButton: {
    fontSize: 24,
    color: "white",
  },
  modalHeadingText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 10,
    marginHorizontal: 20,
  },
  modalText: {
    fontFamily: globalStyles.arialNormal.fontFamily,
    color: "black",
    fontSize: 18,
    padding: 10,
  },
  modalBody: {
    alignItems: "flex-start",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#DA583B",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Restaurants;
