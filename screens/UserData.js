import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    Platform,
    Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import customAxios from "../component/CustomAxios";
import { useSelector } from "react-redux";
import * as Updates from "expo-updates";
import Toast from "react-native-toast-message";
const { width } = Dimensions.get("window");

const UserData = ({ navigation }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [userData, setUserData] = useState({
        goal: "",
        activityLevel: "",
        sex: "",
        birthDate: "",
        location: "",
        height: { ft: "", in: "" },
        weight: "",
        goalWeight: "",
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const userID = useSelector((state) => state.user);
    console.log("Data from User", userID.user.token);

    const steps = [
        {
            title: "Now for your goals.",
            subtitle: "Select 1 that is important to you,",
            options: [
                "Lose Weight",
                "Maintain Weight",
                "Gain Weight",
                "Gain Muscle",
                "Manage Stress",
                "Athletic Performance",
            ],
            key: "goal",
        },
        {
            title: "What is your baseline activity level?",
            options: [
                "sedentary",
                "lightlyActive",
                "moderatelyActive",
                "veryActive",
                "extraActive",
            ],
            key: "activityLevel",
        },
        {
            title: "Please select which sex we should use to calculate your calorie needs.",
            input: "radio",
            options: ["Male", "Female"],
            key: "sex",
        },
        {
            title: "When were you born?",
            input: "date",
            placeholder: "mm/dd/yy",
            key: "birthDate",
        },
        {
            title: "Where do you live?",
            input: "text",
            placeholder: "India",
            key: "location",
        },
        {
            title: "How tall are you?",
            input: "height",
            placeholder: ["Height", "ft", "Height", "in"],
            key: "height",
        },
        {
            title: "How much do you weigh?",
            input: "text",
            placeholder: "Current Weight",
            suffix: "kg",
            key: "weight",
        },
        {
            title: "What's your goal weight?",
            subtitle:
                "Don't worry, this doesn't affect your daily calorie goal and you can always change it later.",
            input: "text",
            placeholder: "Goal Weight",
            suffix: "kg",
            key: "goalWeight",
            next: true,
        },
    ];

    const handleNext = async () => {
        if (steps[currentStep].key === "goalWeight") {
            console.log("User Data:", userData);
            try {
                const heighIncm =
                    userData.height.ft * 30.48 + userData.height.in * 2.54;
                const response = await customAxios.post(
                    "/api/detail/update",
                    {
                        user: userID.user.user.id,
                        goal: userData.goal,
                        activityLevel: userData.activityLevel,
                        gender: userData.sex,
                        dateOfBirth: userData.birthDate,
                        country: userData.location,
                        height: heighIncm,
                        weight: userData.weight,
                        goalWeight: userData.goalWeight,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userID.user.token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    console.log(response.data);
                    Toast.show({
                        type: "success",
                        text1: "Success",
                        text2: "Details added successfully",
                        visibilityTime: 3000,
                        autoHide: true,
                    });
                    await Updates.reloadAsync();
                }
            } catch (e) {
                console.log(e);
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Failed to add Details. Please try again.",
                    visibilityTime: 3000,
                    autoHide: true,
                });
            }
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSelect = (value) => {
        const currentKey = steps[currentStep].key;
        let newValue = value;

        if (currentKey === "weight" || currentKey === "goalWeight") {
            if (parseFloat(value) < 0) {
                Toast.show({
                    type: "error",
                    text1: "Invalid Input",
                    text2: "Weight cannot be less than 0",
                    visibilityTime: 3000,
                    autoHide: true,
                });
                return;
            }
        } else if (currentKey === "height") {
            if (
                (value.ft && parseFloat(value.ft) < 0) ||
                (value.in && parseFloat(value.in) < 0)
            ) {
                Toast.show({
                    type: "error",
                    text1: "Invalid Input",
                    text2: "Height cannot be less than 0",
                    visibilityTime: 3000,
                    autoHide: true,
                });
                return;
            }
        }

        setUserData({ ...userData, [currentKey]: newValue });
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === "ios");
        setDate(currentDate);

        const formattedDate = currentDate.toLocaleDateString("en-US");
        setUserData((prevData) => ({
            ...prevData,
            birthDate: formattedDate,
        }));
    };

    const renderOptions = () => {
        const step = steps[currentStep];

        if (step.input === "radio") {
            return step.options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={styles.radioButton}
                    onPress={() => handleSelect(option)}
                >
                    <View
                        style={[
                            styles.radio,
                            userData[step.key] === option &&
                                styles.radioSelected,
                        ]}
                    />
                    <Text style={styles.radioText}>{option}</Text>
                </TouchableOpacity>
            ));
        } else if (step.input === "date") {
            return (
                <View style={styles.inputContainer}>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={{ width: "100%" }}
                    >
                        <View
                            style={[
                                styles.button,
                                {
                                    padding: 15,
                                    backgroundColor: "#ddd",
                                    width: "100%",
                                },
                            ]}
                        >
                            <Text style={styles.buttonText}>
                                {userData.birthDate
                                    ? userData.birthDate
                                    : step.placeholder}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChange}
                            maximumDate={new Date()}
                        />
                    )}
                </View>
            );
        } else if (step.input === "text") {
            return (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={step.placeholder}
                        value={userData[step.key]}
                        onChangeText={(text) => handleSelect(text)}
                        keyboardType={
                            step.key === "weight" || step.key === "goalWeight"
                                ? "numeric"
                                : "default"
                        }
                    />
                    {step.suffix && (
                        <Text style={styles.inputSuffix}>{step.suffix}</Text>
                    )}
                </View>
            );
        } else if (step.input === "height") {
            return (
                <View style={styles.heightInputContainer}>
                    <View style={[styles.inputContainer, { width: "50%" }]}>
                        <TextInput
                            style={[styles.input, { width: 50 }]}
                            placeholder={step.placeholder[0]}
                            keyboardType="numeric"
                            value={userData[step.key]?.ft}
                            onChangeText={(text) =>
                                handleSelect({
                                    ...userData[step.key],
                                    ft: text,
                                })
                            }
                        />
                        <Text style={styles.inputSuffix}>
                            {step.placeholder[1]}
                        </Text>
                    </View>
                    <View style={[styles.inputContainer, { width: "50%" }]}>
                        <TextInput
                            style={[styles.input, { width: 50 }]}
                            placeholder={step.placeholder[2]}
                            keyboardType="numeric"
                            value={userData[step.key]?.in}
                            onChangeText={(text) =>
                                handleSelect({
                                    ...userData[step.key],
                                    in: text,
                                })
                            }
                        />
                        <Text style={styles.inputSuffix}>
                            {step.placeholder[3]}
                        </Text>
                    </View>
                </View>
            );
        } else {
            return step.options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={[
                        styles.button,
                        userData[step.key] === option && styles.selectedButton,
                    ]}
                    onPress={() => handleSelect(option)}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            userData[step.key] === option &&
                                styles.selectedButtonText,
                        ]}
                    >
                        {option}
                    </Text>
                </TouchableOpacity>
            ));
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.progressContainer}>
                {steps.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.progressDot,
                            index === currentStep && styles.activeProgressDot,
                        ]}
                    />
                ))}
            </View>
            <Text style={styles.title}>{steps[currentStep].title}</Text>
            {steps[currentStep].subtitle && (
                <Text style={styles.subtitle}>
                    {steps[currentStep].subtitle}
                </Text>
            )}
            <View style={styles.optionsContainer}>{renderOptions()}</View>
            <View style={styles.navigationButtons}>
                <TouchableOpacity
                    style={[styles.navButton, styles.backButton]}
                    onPress={handleBack}
                >
                    <Text style={styles.navButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navButton, styles.nextButton]}
                    onPress={handleNext}
                >
                    <Text style={styles.navButtonTextNext}>Next</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "flex-start",
        width: width,
        marginTop: 50,
    },
    progressContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    progressDot: {
        width: 20,
        height: 8,
        borderRadius: 0,
        backgroundColor: "#E0E0E0",
        marginHorizontal: 4,
    },
    activeProgressDot: {
        backgroundColor: "#007AFF",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "#0072DB",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 20,
        textAlign: "center",
    },
    optionsContainer: {
        width: "100%",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#F0F0F0",
        padding: 15,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    selectedButton: {
        backgroundColor: "#E6F2FF",
        borderColor: "#007AFF",
    },
    buttonText: {
        color: "#333",
    },
    selectedButtonText: {
        color: "#007AFF",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 5,
        marginVertical: 5,
    },
    input: {
        flex: 1,
        padding: 10,
    },
    inputSuffix: {
        paddingRight: 10,
        color: "#666",
    },
    heightInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    radioButton: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    radio: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#007AFF",
        marginRight: 10,
    },
    radioSelected: {
        backgroundColor: "#007AFF",
    },
    radioText: {
        fontSize: 16,
    },
    navigationButtons: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: 20,
    },
    navButton: {
        padding: 15,
        borderRadius: 5,
        width: "48%",
        alignItems: "center",
    },
    backButton: {
        backgroundColor: "#007AFF",
        borderRadius: 30,
        marginBottom: 10,
        width: "100%",
    },
    nextButton: {
        borderRadius: 30,
        borderWidth: 4,
        borderColor: "#007AFF",
        width: "100%",
    },
    navButtonText: {
        color: "#FFF",
        fontWeight: "bold",
    },
    navButtonTextNext: {
        color: "black",
        fontWeight: "bold",
    },
});

export default UserData;
