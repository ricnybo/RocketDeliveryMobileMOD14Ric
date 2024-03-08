import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";

import AuthContext from "../components/AuthContext";


const CourierDeliveries = () => {
    const navigation = useNavigation();
    const { userMode } = useContext(AuthContext);

    useEffect(() => {
        if (userMode === "customer") {
            navigation.navigate("Tabs");
        } else if (userMode !== "courier") {
            navigation.navigate("Authentication");
        }
    }, [userMode, navigation]);

    return (
        <View style={styles.container}>
        <Text>Courier Deliveries</Text>
        </View>
    );
};
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
});

export default CourierDeliveries;
