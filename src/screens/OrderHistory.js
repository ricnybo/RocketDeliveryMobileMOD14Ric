import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Appearance,
  FlatList,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AuthContext from "../components/AuthContext";
import NavBar from "../components/NavBar";
import { globalStyles } from "../components/GlobalStyles";

const URI = process.env.EXPO_PUBLIC_NGROK_URL;
const colorScheme = Appearance.getColorScheme();

const OrderHistory = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetch(`${URI}/api/orders?id=${user.customer_id}&type=customer`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error(error));
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.column, globalStyles.arialNormal]}>{item.restaurant_name}</Text>
      <Text style={[styles.statusColumn, globalStyles.arialNormal]}>{item.status.toUpperCase()}</Text>
      <View style={styles.viewColumn}>
        <TouchableOpacity onPress={() => handleViewPress(item)}>
          <Feather name="zoom-in" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleViewPress = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "dark-content" : "light-content"}
      />
      <NavBar navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={[globalStyles.arialBold, styles.headingText]}>MY ORDERS</Text>
          <View style={styles.header}>
            <Text style={[styles.headerText, globalStyles.arialBold]}>ORDER</Text>
            <Text style={[styles.statusHeaderText, globalStyles.arialBold]}>STATUS</Text>
            <View style={styles.viewHeader}>
              <Text style={[styles.headerText, globalStyles.arialBold]}>VIEW</Text>
            </View>
          </View>
          <FlatList
            data={orders}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 70 }}
          />
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderText}>
                    <Text style={[styles.restaurantName, globalStyles.oswaldBold]}>
                      {selectedOrder?.restaurant_name}
                    </Text>
                    <Text style={[styles.orderDetails, globalStyles.arialNormal]}>
                      Order Date:{" "}
                      {new Date(selectedOrder?.created_at).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.orderDetails, globalStyles.arialNormal]}>
                      Status: {selectedOrder?.status.toUpperCase()}
                    </Text>
                    <Text style={[styles.orderDetails, globalStyles.arialNormal]}>
                      Courier: {selectedOrder?.courier_name}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={[styles.modalCloseButton, globalStyles.arialBold]}>X</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBody}>
                  {selectedOrder?.products.map((product, index) => (
                    <View key={index} style={styles.orderItem}>
                      <Text style={[styles.orderItemText, globalStyles.arialNormal]}>
                        {product.product_name}
                      </Text>
                      <Text style={[styles.orderItemText, styles.quantityText, globalStyles.arialNormal]}>
                        x{product.quantity}
                      </Text>
                      <Text style={[styles.priceText, globalStyles.arialNormal]}>
                        ${Number(product.unit_cost / 100).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.line} />
                  <View style={styles.totalContainer}>
                    <Text style={[styles.orderTotalText, globalStyles.arialBold]}>
                      TOTAL: ${(selectedOrder?.total_cost / 100).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
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
    padding: 20,
  },
  fontOswaldText: {
    fontSize: 20,
    marginBottom: 20,
    color: "red",
    // fontFamily: "Oswald", // Use the Oswald font
  },
  headingText: {
    fontSize: 20,
    marginBottom: 20,
    color: "black",
    // fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "black",
    padding: 10,
    justifyContent: "space-between",
  },
  headerText: {
    color: "white",
    fontSize: 16,
    // fontWeight: "bold",
    flex: 1,
  },
  statusHeaderText: {
    color: "white",
    fontSize: 16,
    // fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  viewHeader: {
    flex: 0.3,
    paddingRight: 20,
    alignItems: "flex-end",
  },
  viewHeaderText: {
    flex: 1,
    color: "white",
    alignItems: "flex-end",
  },
  row: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    fontSize: 16,
  },
  statusColumn: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
  },
  viewColumn: {
    flex: 0.2,
    paddingRight: 20,
    alignItems: "flex-end",
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
    // fontWeight: "bold",
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
  modalHeaderText: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "normal",
    color: "white",
  },
  modalCloseButton: {
    fontSize: 24,
    // fontWeight: "900",
    color: "white",
  },
  modalHeadingText: {
    fontSize: 18,
    // fontWeight: "bold",
    textAlign: "left",
    marginTop: 10,
    marginHorizontal: 20,
  },
  modalBody: {
    alignItems: "flex-start",
    width: "100%",
  },
  restaurantName: {
    color: "#DA583B",
    // fontWeight: "900",
    fontSize: 20,
  },
  orderDetails: {
    color: "#fff",
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
    fontSize: 14,
    color: "black",
    flex: 1,
  },
  quantityText: {
    flex: 0.5,
  },
  priceText: {
    alignSelf: "flex-end",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  orderTotalText: {
    fontSize: 18,
    // fontWeight: "bold",
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
});

export default OrderHistory;
