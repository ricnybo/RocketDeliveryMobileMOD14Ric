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
import { useNavigation } from "@react-navigation/native";

import { AntDesign, Feather } from "@expo/vector-icons";

import AuthContext from "../components/AuthContext";
import NavBar from "../components/NavBar";
import { globalStyles } from "../components/GlobalStyles";

const URI = process.env.EXPO_PUBLIC_NGROK_URL;
const colorScheme = Appearance.getColorScheme();

const CourierDeliveries = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const { userMode } = useContext(AuthContext);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#851919';
            case 'in progress':
                return '#DA583B';
            case 'delivered':
                return '#609475';
            default:
                return '#DA583B'; // default color if status is none of the above
        }
    };

    useEffect(() => {
        if (userMode === "customer") {
            navigation.navigate("Tabs");
        } else if (userMode !== "courier") {
            navigation.navigate("Authentication");
        }
    }, [userMode, navigation]);

    const handleStatusChange = (order) => {
        let nextStatus;
        switch (order.status) {
            case 'pending':
                nextStatus = 'in progress';
                break;
            case 'in progress':
                nextStatus = 'delivered';
                break;
            case 'delivered':
                return; // If the status is already 'delivered', do nothing
        }

        fetch(`${URI}/api/order/${order.id}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: nextStatus,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // If the request was successful, update the local state
                if (data.success) {
                    setOrders(orders.map((item) =>
                        item.id === order.id ? { ...item, status: nextStatus } : item
                    ));
                }
            })
            .catch((error) => console.error(error));
        fetchOrders();
    };

    const fetchOrders = () => {
        fetch(`${URI}/api/orders?id=${user.courier_id}&type=courier`)
            .then((response) => response.json())
            .then((data) => setOrders(data))
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchOrders();
        setRefreshing(false);
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={[styles.orderIdColumn, styles.orderTableText]}>
                {item.id}
            </Text>
            <View style={[styles.addressColumn]}>
                <Text style={styles.orderTableText}>{item.customer_address.split(',')[0]}</Text>
                <Text style={styles.orderTableText}>{item.customer_address.split(',').slice(1).join(',')}</Text>
            </View>
            <TouchableOpacity
                style={[styles.statusColumn, styles.button, { backgroundColor: getStatusColor(item.status) }]}
                onPress={() => handleStatusChange(item)}
            >
                <Text style={[styles.statusColumn, styles.buttonText]}>
                    {item.status.toUpperCase()}
                </Text>
            </TouchableOpacity>
            <View style={styles.viewColumn}>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleViewPress(item)}>
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
                    <Text style={styles.headingText}>
                        MY DELIVERIES
                    </Text>
                    <View style={styles.header}>
                        <View style={styles.orderIdColumn}>
                            <Text style={[styles.headerText]}>
                                ORDER
                            </Text>
                            <Text style={[styles.headerText]}>
                                ID
                            </Text>
                        </View>
                        <Text style={[styles.headerText, styles.addressColumn]}>
                            ADDRESS
                        </Text>
                        <Text style={[styles.headerText, styles.statusColumn]}>
                            STATUS
                        </Text>
                        <Text style={[styles.headerText, styles.viewColumn]}>
                            VIEW
                        </Text>
                    </View>
                    <FlatList
                        data={orders}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingBottom: 70 }}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
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
                                        <Text
                                            style={[styles.modalHeadingText, {textAlign: "center"}]}
                                        >
                                            DELIVERY DETAILS
                                        </Text>
                                        <Text
                                            style={styles.orderDetails}
                                        >
                                            Status: {selectedOrder?.status.toUpperCase()}
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <AntDesign name="close" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalBody}>
                                    <View style={[styles.moddalHeaderText, globalStyles.arialNormal]}>
                                        <View style={styles.addressRow}>
                                            <Text style={styles.orderSumaryText}>Delivery Address:  </Text>
                                            <Text style={styles.orderSumaryText}>
                                                {selectedOrder
                                                    ? ` ${selectedOrder.customer_address.substring(0, selectedOrder.customer_address.indexOf(','))}\n${selectedOrder.customer_address.substring(selectedOrder.customer_address.indexOf(',') + 1)}`
                                                    : 'Loading...'}
                                            </Text>
                                        </View>
                                        <Text style={styles.orderSumaryText}>Restaurant: {selectedOrder ? selectedOrder.restaurant_name : 'Loading...'}</Text>
                                        <Text style={styles.orderSumaryText}>Order DATE: {selectedOrder ? new Date(selectedOrder.created_at).toLocaleDateString() : 'Loading...'}</Text>
                                        <Text style={styles.subHeadingText}>Order Details:</Text>
                                    </View>
                                    {selectedOrder?.products.map((product, index) => (
                                        <View key={index} style={styles.orderItem}>
                                            <Text
                                                style={[styles.orderItemText]}
                                            >
                                                {product.product_name}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.orderItemText,
                                                    styles.quantityText,
                                                    globalStyles.arialNormal,
                                                ]}
                                            >
                                                x{product.quantity}
                                            </Text>
                                            <Text
                                                style={[styles.priceText, globalStyles.arialNormal]}
                                            >
                                                ${Number(product.unit_cost / 100).toFixed(2)}
                                            </Text>
                                        </View>
                                    ))}
                                    <View style={styles.line} />
                                    <View style={styles.totalContainer}>
                                        <Text
                                            style={[styles.orderTotalText, globalStyles.arialBold]}
                                        >
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
    headingText: {
        fontFamily: globalStyles.oswaldMedium.fontFamily,
        fontSize: 20,
        marginBottom: 20,
        color: "black",
    },
    subHeadingText: {
        fontFamily: globalStyles.oswaldMedium.fontFamily,
        fontSize: 16,
        marginTop: 20,
        color: "black",
    },
    header: {
        flexDirection: "row",
        backgroundColor: "black",
        padding: 10,
        height: 50,
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerText: {
        fontFamily: globalStyles.arialBold.fontFamily,
        color: "white",
        fontSize: 12,
    },
    orderTableText: {
        fontFamily: globalStyles.arialNormal.fontFamily,
        fontSize: 12,
        color: "black",
    },
    orderIdColumn: {
        flex: 0.35,
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
    },
    addressColumn: {
        flex: 1.25,
        textAlign: "center",
    },
    statusColumn: {
        flex: .75,
        textAlign: "center",
    },
    viewColumn: {
        flex: .3,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
    },
    addressRow: {
        flexDirection: "row",
        padding: 0,
        paddingBottom: 10,
    },
    orderSumaryText: {
        fontFamily: globalStyles.arialNormal.fontFamily,
        fontSize: 12,
        color: "black",
        marginBottom: 5,
    },
    column: {
        flex: 1,
        fontSize: 16,
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
        // justifyContent: "space-between",
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
        // alignItems: "flex-start",
        marginLeft: 15,
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
        fontFamily: globalStyles.oswaldBold.fontFamily,
        color: "#DA583B",
        fontSize: 20,
        textAlign: "center",
    },
    modalBody: {
        alignItems: "flex-start",
        width: "100%",
    },
    moddalHeaderText: {
        fontFamily: globalStyles.arialNormal.fontFamily,
        fontSize: 18,
        width: "100%",
        marginHorizontal: 20,
        marginTop: 5,
        marginBottom: 10,
    },
    restaurantName: {
        color: "#DA583B",
        fontSize: 20,
    },
    orderDetails: {
        fontFamily: globalStyles.arialNormal.fontFamily,
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
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
        width: 70,
        textAlign: "right",
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
    button: {
        backgroundColor: "#DA583B",
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 0,
        // marginTop: 30,
    },
    buttonText: {
        fontSize: 12,
        fontFamily: globalStyles.oswaldRegular.fontFamily,
        color: "#FFF",
        textAlign: "center",
    },
    buttonActive: {
        backgroundColor: "#DA583B",
    },
    buttonInactive: {
        backgroundColor: "rgba(218, 88, 59, 0.3)",
    },
});

export default CourierDeliveries;
