import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { CheckBox } from "react-native-elements";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Appearance,
  TextInput,
  Modal,
} from "react-native";

import { AntDesign, Ionicons, Octicons, FontAwesome } from "@expo/vector-icons";

import { globalStyles } from "../components/GlobalStyles";
import NavBar from "../components/NavBar";
import AuthContext from "../components/AuthContext";

const URI = process.env.EXPO_PUBLIC_NGROK_URL;
const colorScheme = Appearance.getColorScheme();

const Product = ({ product, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    onQuantityChange(product.id, newQuantity);
  };

  return (
    <View style={styles.productItem}>
      <Image
        source={require("../../assets/Images/Restaurants/RestaurantMenu.jpg")}
        style={styles.image}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.productNameText}>{product.name}</Text>
        <Text style={styles.productPriceText}>
          ${Number(product.cost / 100).toFixed(2)}
        </Text>
        <Text style={styles.text}>Lorem ipsum dolor sit amet.</Text>
      </View>
      <AntDesign
        name="minuscircle"
        size={24}
        color="black"
        onPress={() => handleQuantityChange(Math.max(0, quantity - 1))}
      />
      <TextInput
        value={String(quantity)}
        style={styles.input}
        editable={false}
      />
      <AntDesign
        name="pluscircle"
        size={24}
        color="black"
        onPress={() => handleQuantityChange(quantity + 1)}
      />
    </View>
  );
};

const RestaurantMenuOrder = ({ route }) => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [orderStatus, setOrderStatus] = useState("idle");
  const [emailChecked, setEmailChecked] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(false);
  const { restaurantId } = route.params;
  const { restaurantName } = route.params;
  const { restaurantRating } = route.params;
  const { restaurantPriceRange } = route.params;
  const priceRange = "$".repeat(restaurantPriceRange);
  const rating = [...Array(restaurantRating)].map((_, i) => (
    <FontAwesome key={i} name="star" size={14} color="black" />
  ));
  const { user, isLoggedIn, userMode } = useContext(AuthContext);
  const customerId = user.customer_id;

  useEffect(() => {
    if (user) {
      fetch(`${URI}/api/products?restaurant=${restaurantId}`)
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error(error));
    }
  }, [restaurantId, user]);

  useEffect(() => {
    if (userMode === "courier") {
      navigation.navigate("CourierDeliveries");
    } else if (userMode !== "customer") {
      navigation.navigate("Authentication");
    }
  }, [userMode, navigation]);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const isOrderButtonDisabled = Object.values(quantities).every(
    (quantity) => quantity === 0
  );

  const handleCreateOrderPress = () => {
    setModalVisible(true);
  };

  const handleConfirmOrderPress = () => {
    if (user) {
      setOrderStatus("processing");

      setTimeout(() => {
        const orderData = {
          restaurant_id: restaurantId,
          customer_id: customerId,
          products: Object.entries(quantities).map(([id, quantity]) => ({
            id: Number(id),
            quantity,
          })),
        };

        fetch(`${URI}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })
          .then((response) => response.json())
          .then((data) => {
            setOrderStatus("success");
          })
          .catch((error) => {
            console.error("Error:", error);
            setOrderStatus("failure");
          });
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "dark-content" : "light-content"}
      />
      <NavBar navigation={navigation} />
      <View style={styles.containerMain}>
        <Text style={styles.headingText}>Restaurant Menu</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={styles.restaurantNameText}>{restaurantName}</Text>
            <Text style={styles.text}>Price: {priceRange}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.text}>Rating: </Text>
              <Text style={styles.starText}>{rating}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={
              isOrderButtonDisabled ? styles.disabledButton : styles.button
            }
            onPress={handleCreateOrderPress}
            disabled={isOrderButtonDisabled}
          >
            <Text style={styles.buttonText}>Create Order</Text>
          </TouchableOpacity>
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, globalStyles.oswaldMedium]}>
                    Order Confirmation
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <AntDesign name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBody}>
                  <Text style={styles.modalHeadingText}>Order Summary</Text>
                  {Object.entries(quantities)
                    .filter(([productId, quantity]) => quantity > 0)
                    .map(([productId, quantity]) => {
                      const product = products.find(
                        (product) => product.id === Number(productId)
                      );
                      const total = product.cost * quantity;
                      return (
                        <View key={productId} style={styles.orderItem}>
                          <Text style={styles.orderItemText}>
                            {product.name}
                          </Text>
                          <Text
                            style={[styles.orderItemText, styles.quantityText]}
                          >
                            x{quantity}
                          </Text>
                          <Text style={styles.priceText}>
                            ${Number(total / 100).toFixed(2)}
                          </Text>
                        </View>
                      );
                    })}
                  <View style={styles.line} />
                  <Text style={styles.orderTotalText}>
                    TOTAL: $
                    {Number(
                      Object.entries(quantities).reduce(
                        (total, [productId, quantity]) => {
                          const product = products.find(
                            (product) => product.id === Number(productId)
                          );
                          return total + product.cost * quantity;
                        },
                        0
                      ) / 100
                    ).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.line2} />
                <Text style={styles.text}>Would you like to receive your order confirmation</Text>
                <Text style={styles.text}>by email and/or text?</Text>
                <View style={styles.checkBoxRow}>
                  <CheckBox
                    checked={emailChecked}
                    onPress={() => setEmailChecked(!emailChecked)}
                    title={"By Email"}
                    containerStyle={{ margin: 0, backgroundColor: "transparent", borderWidth: 0 }}
                    titleProps={{ style: { fontFamily: globalStyles.arialNormal.fontFamily } }}
                  />
                  <CheckBox
                    checked={phoneChecked}
                    onPress={() => setPhoneChecked(!phoneChecked)}
                    title={"By Phone"}
                    containerStyle={{ margin: 0, backgroundColor: "transparent", borderWidth: 0 }}
                    titleProps={{ style: { fontFamily: globalStyles.arialNormal.fontFamily } }}
                  />
                </View>
                {orderStatus !== "success" && (
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleConfirmOrderPress}
                  >
                    
                    {orderStatus === "processing" ? (
                      <Text style={styles.modalButtonText}>
                        PROCESSING ORDER...
                      </Text>
                    ) : (
                      <Text style={styles.modalButtonText}>CONFIRM ORDER</Text>
                    )}
                  </TouchableOpacity>
                )}
                {orderStatus === "success" && (
                  <View style={styles.successMessage}>
                    <Ionicons
                      name="checkmark-circle-sharp"
                      size={35}
                      color="green"
                    />
                    <Text style={styles.messageText}>Thank you!</Text>
                    <Text style={styles.messageText}>
                      Your order has been received.
                    </Text>
                  </View>
                )}
                {orderStatus === "failure" && (
                  <View>
                    <View style={styles.failureMessage}>
                      <Octicons name="x-circle-fill" size={35} color="red" />
                      <Text style={styles.messageText}>
                        Your order was not processed successfully.
                      </Text>
                      <Text style={styles.messageText}>Please try again.</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.productContainer}>
          {products.map((product) => (
            <Product
              key={product.id}
              product={product}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "left",
    justifyContent: "flex-start",
  },
  containerMain: {
    marginHorizontal: 20,
  },
  headingText: {
    fontFamily: globalStyles.oswaldMedium.fontFamily,
    fontSize: 18,
    textAlign: "left",
    marginVertical: 20,
  },
  restaurantNameText: {
    fontFamily: globalStyles.oswaldBold.fontFamily,
    fontSize: 16,
    textAlign: "left",
  },
  text: {
    fontFamily: globalStyles.arialNormal.fontFamily,
    fontSize: 12,
    color: "black",
  },
  starText: {
    color: "black",
  },
  checkBoxRow: {
    fontFamily: globalStyles.arialNormal.fontFamily,
    flexDirection: "row",
    padding: 0,
    textAlign: "left",
    // justifyContent: "space-evenly",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#DA583B",
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "rgba(218, 88, 59, 0.3)",
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: globalStyles.oswaldMedium.fontFamily,
    color: "white",
    fontSize: 16,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  productContainer: {
    marginVertical: 10,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginRight: 15,
  },
  productNameText: {
    fontFamily: globalStyles.arialBold.fontFamily,
    fontSize: 14,
  },
  productPriceText: {
    fontFamily: globalStyles.arialBold.fontFamily,
    fontSize: 14,
  },
  input: {
    fontFamily: globalStyles.arialNormal.fontFamily,
    color: "black",
    width: 50,
    height: 30,
    borderColor: "gray",
    borderWidth: 0,
    textAlign: "center",
    marginHorizontal: 10,
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
    fontFamily: globalStyles.oswaldMedium.fontFamily,
    fontSize: 18,
    textAlign: "left",
    marginTop: 10,
    marginHorizontal: 20,
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
    fontFamily: globalStyles.oswaldMedium.fontFamily,
    color: "white",
    fontSize: 16,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 20,
  },
  orderItemText: {
    fontFamily: globalStyles.arialNormal.fontFamily,
    fontSize: 14,
    color: "black",
    flex: 1,
  },
  quantityText: {
    width: 25,
    flex: 0.25,
  },
  priceText: {
    fontFamily: globalStyles.arialNormal.fontFamily,
    width: 70,
    textAlign: "right",
    alignSelf: "flex-end",
  },
  orderTotalText: {
    fontFamily: globalStyles.oswaldBold.fontFamily,
    fontSize: 18,
    textAlign: "right",
    width: "100%",
    marginTop: 5,
    marginBottom: 10,
    paddingRight: 20,
  },
  line: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    alignSelf: "stretch",
    marginVertical: 0,
    marginHorizontal: 20,
  },
  line2: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    width: "100%",
    marginBottom: 15,
  },
  successMessage: {
    fontSize: 12,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  failureMessage: {
    fontSize: 12,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  messageText: {
    fontFamily: globalStyles.arialNormal.fontFamily,
    fontSize: 16,
    textAlign: "center",
  },
});

export default RestaurantMenuOrder;
