import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Unauthorized = () => {
    return (
        <View style={styles.container}>
        <Text>Unauthorized</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
});

export default Unauthorized;
