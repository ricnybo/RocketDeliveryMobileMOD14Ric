import React from "react";
import { useContext, useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    Appearance,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AuthContext from "../components/AuthContext";
import NavBar from "../components/NavBar";
import { globalStyles } from "../components/GlobalStyles";

const URI = process.env.EXPO_PUBLIC_NGROK_URL;
const colorScheme = Appearance.getColorScheme();

const CustomerAccount = (navigation) => {
    const { container, page, headingText } = styles;
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
    const [primaryEmail, setPrimaryEmail] = useState("");
    const [accountEmail, setAccountEmail] = useState("");
    const [accountPhone, setAccountPhone] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const capitalizedUserMode =
        userMode.charAt(0).toUpperCase() + userMode.slice(1).toLowerCase();

    const updateAccount = () => {
        fetch(`${URI}/api/account/${user.customer_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                account_email: accountEmail,
                account_phone: accountPhone,
                account_type: "customer",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setPrimaryEmail(data.primary_email);
                setAccountEmail(data.account_email);
                setAccountPhone(data.account_phone);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        setHasUnsavedChanges(false);
    };

    useEffect(() => {
        fetch(`${URI}/api/account/${user.customer_id}?type=customer`)
            .then((response) => response.json())
            .then((data) => {
                setPrimaryEmail(data.primary_email);
                setAccountEmail(data.account_email);
                setAccountPhone(data.account_phone);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    return (
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
        >
            <View style={styles.container}>
                <StatusBar
                    barStyle={colorScheme === "dark" ? "dark-content" : "light-content"}
                />
                <NavBar navigation={navigation} />
                <View style={styles.page}>
                    <Text style={styles.headingText}>
                        MY ACCOUNT
                    </Text>
                    <Text style={styles.noticeText}>
                        Logged In As: {capitalizedUserMode}
                    </Text>
                    <Text style={styles.labelText}>Primary Email (Read Only)</Text>
                    <TextInput
                        style={styles.textInputBox}
                        value={primaryEmail} // replace with your user email variable
                        editable={false} // makes the TextInput read-only
                    />
                    <Text style={styles.commentText}>
                        Email used to login to the application.
                    </Text>
                    <Text style={styles.labelText}>Customer Email:</Text>
                    <TextInput
                        style={styles.textInputBox}
                        value={accountEmail}
                        onChangeText={text => {
                            setAccountEmail(text);
                            setHasUnsavedChanges(true);
                        }}
                    />
                    <Text style={styles.commentText}>
                        Email used for your Customer account.
                    </Text>
                    <Text style={styles.labelText}>Customer Phone:</Text>
                    <TextInput
                        style={styles.textInputBox}
                        value={accountPhone}
                        onChangeText={text => {
                            setAccountPhone(text);
                            setHasUnsavedChanges(true);
                        }}
                    />
                    <Text style={styles.commentText}>
                        Phone number for your Customer account.
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, hasUnsavedChanges ? styles.buttonActive : styles.buttonInactive]}
                        onPress={updateAccount}
                        disabled={!hasUnsavedChanges}
                    >
                        <Text style={[styles.buttonText]}>UPDATE ACCOUNT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "#F0F0F0",
    },
    page: {
        // flex: 1,
        padding: 30,
    },
    headingText: {
        fontSize: 20,
        fontFamily: globalStyles.oswaldMedium.fontFamily,
        textAlign: "left",
    },
    noticeText: {
        fontFamily: globalStyles.arialNormal.fontFamily,
        fontSize: 16,
        textAlign: "left",
        marginBottom: 20,
        marginTop: 20,
    },
    labelText: {
        fontFamily: globalStyles.arialNormal.fontFamily,
        fontSize: 12,
        textAlign: "left",
        marginBottom: 10,
    },
    commentText: {
        fontFamily: globalStyles.arialNormal.fontFamily,
        fontSize: 10,
        textAlign: "left",
        marginTop: 5,
        marginBottom: 20,
    },
    textInputBox: {
        backgroundColor: "white",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    button: {
        backgroundColor: "#DA583B",
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 0,
        marginTop: 30,
    },
    buttonText: {
        fontSize: 20,
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

export default CustomerAccount;
