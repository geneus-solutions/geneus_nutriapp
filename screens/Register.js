import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";
import customAxios from "../component/CustomAxios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/UserSlice";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

const Register = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [number, setNumber] = useState("");
    const dispatch = useDispatch();

    const handleRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!username || !email || !password || !number) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "All fields are required!",
                visibilityTime: 3000,
                autoHide: true,
            });
            return;
        }

        if (!emailRegex.test(email)) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Please enter a valid email address.",
                visibilityTime: 3000,
                autoHide: true,
            });
            return;
        }

        if (password.length < 8) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Password must be at least 8 characters long.",
                visibilityTime: 3000,
                autoHide: true,
            });
            return;
        }

        if (number.length !== 10) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Phone number must be exactly 10 digits.",
                visibilityTime: 3000,
                autoHide: true,
            });
            return;
        }

        try {
            console.log("Registering user...");
            const response = await customAxios.post("/androidSignup", {
                name: username,
                email,
                password,
                mobile: number,
            });

            if (response.status === 200) {
                dispatch(setUser(response.data));
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Registered successfully",
                    visibilityTime: 3000,
                    autoHide: true,
                });

                await SecureStore.setItemAsync(
                    "accessToken",
                    response.data.accessToken
                );
                await SecureStore.setItemAsync(
                    "refreshToken",
                    response.data.refreshToken
                );
                navigation.navigate("UserData");
            } else {
                console.log(response.data);
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to Register. Please try again.",
                visibilityTime: 3000,
                autoHide: true,
            });
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <View style={styles.imageContainer}>
                <Image
                    source={require("../assets/Register.png")}
                    style={styles.image}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#999"
                    onChangeText={(text) => setUsername(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#999"
                    onChangeText={(text) => setNumber(text)}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 44,
        fontWeight: "bold",
        color: "#2196F3",
        marginBottom: 20,
    },
    imageContainer: {
        width: "100%",
        height: 200,
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    inputContainer: {
        width: "95%",
    },
    input: {
        backgroundColor: "#F5F5F5",
        padding: 15,
        borderRadius: 40,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#2196F3",
        padding: 15,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    loginContainer: {
        flexDirection: "row",
        marginTop: 20,
    },
    loginText: {
        color: "#333",
    },
    loginLink: {
        color: "#2196F3",
        fontWeight: "bold",
    },
});

export default Register;
