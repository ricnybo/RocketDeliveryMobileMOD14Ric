import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { FontAwesome } from '@expo/vector-icons';

import cuisineGreek from "../../assets/Images/Restaurants/cuisineGreek.jpg";
import cuisineJapanese from "../../assets/Images/Restaurants/cuisineJapanese.jpg";
import cuisinePasta from "../../assets/Images/Restaurants/cuisinePasta.jpg";
import cuisinePizza from "../../assets/Images/Restaurants/cuisinePizza.jpg";
import cuisineSoutheast from "../../assets/Images/Restaurants/cuisineSoutheast.jpg";
import cuisineViet from "../../assets/Images/Restaurants/cuisineViet.jpg";

const screenWidth = Dimensions.get("window").width;
const columnWidth = screenWidth / 2;

const RestaurantCard = ({ restaurant }) => {
  const navigation = useNavigation();
  const priceRange = "$".repeat(restaurant.price_range);
  // const rating = "*".repeat(restaurant.rating);
  const rating = [...Array(restaurant.rating)].map((_, i) => <FontAwesome key={i} name="star" size={14} color="black" />);

  let image;
  switch (restaurant.id) {
    case 1:
      image = cuisineJapanese;
      break;
    case 2:
      image = cuisinePasta;
      break;
    case 3:
      image = cuisineViet;
      break;
    case 4:
      image = cuisinePizza;
      break;
    case 5:
      image = cuisineJapanese;
      break;
    case 6:
      image = cuisineSoutheast;
      break;
    case 7:
      image = cuisineGreek;
      break;
    case 8:
      image = cuisinePasta;
      break;
    default:
      image = cuisinePizza;
  }

  const handlePress = () => {
    navigation.navigate("RestaurantMenuOrder", {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantRating: restaurant.rating,
      restaurantPriceRange: restaurant.price_range,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.restaurantCard}>
        <Image source={image} style={styles.restaurantImage} />
        <Text style={styles.restaurantName}>
          {restaurant.name} ({priceRange})
        </Text>
        <Text style={styles.restaurantDetails}>({rating})</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  restaurantContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  restaurantCard: {
    borderWidth: 0.5,
    borderColor: "#222126",
    backgroundColor: "#fff",
    padding: 0,
    marginBottom: 15,
    width: columnWidth - 40,
    height: 225,
    borderRadius: 5,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: "bold",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  restaurantDetails: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  restaurantImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
});

export default RestaurantCard;
