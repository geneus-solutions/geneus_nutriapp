// components/PlanExpiredPopup.js

import React from "react";
import {
    Modal,
    View,
    Text,
    Button,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated,
    Easing,
} from "react-native";

const PlanExpiredPopup = ({ visible, onConfirm, onCancel }) => {
    const [fadeAnim] = React.useState(new Animated.Value(0));
    const [slideAnim] = React.useState(new Animated.Value(50)); // Start 50px below

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(0);
            slideAnim.setValue(50);
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="none">
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.popupContent,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            <Text style={styles.popupTitle}>
                                Your Free Trial Has Expired
                            </Text>
                            <Text style={styles.popupText}>
                                Your free trial ended more than 3 days ago. To
                                continue using this feature, please purchase a
                                plan.
                            </Text>
                            <Button title="Buy Plan" onPress={onConfirm} />
                            <View style={{ marginTop: 10 }}>
                                <Button
                                    title="Cancel"
                                    onPress={onCancel}
                                    color="gray"
                                />
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    popupContent: {
        width: Dimensions.get("window").width * 0.8,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
    },
    popupTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    popupText: {
        textAlign: "center",
        marginBottom: 15,
    },
});

export default PlanExpiredPopup;
