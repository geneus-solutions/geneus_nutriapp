import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import api from './PrivateAxios'; 
import Toast from 'react-native-toast-message';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import * as Updates from 'expo-updates';
const PurchasePremium = () => {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null); 
  const [orderId, setOrderId] = useState(null); 
const navigation = useNavigation();
  const upgradeToPremium = async () => {
    setLoading(true);
    try {
     
      const res = await api.post('/api/plan/create-order', { amount: 9 });

      if (res.status === 200) {
        const { amount, orderId, currency } = res.data;

        
        setOrderId(orderId);

        
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Razorpay Checkout</title>
              <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
              <script>
                var options = {
                  key: '', // Replace with your Razorpay key
                  amount: ${amount * 100}, // Convert to the smallest currency unit (paise)
                  currency: '${currency}',
                  name: 'Geneus Solution',
                  description: 'Payment for Premium Plan',
                  order_id: '${orderId}',
                  handler: function(response) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(response));
                  },
                  theme: {
                    color: '#276FFC',
                  },
                };
                var rzp1 = new Razorpay(options);
                rzp1.open();
              </script>
            </head>
            <body>
            </body>
          </html>
        `;

        
        setPaymentUrl(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
      } else {
        showError('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error(error);
      showError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showError = (message) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const verifyPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    try {
      console.log('Verifying payment...');
      console.log('razorpay_order_id:', razorpay_order_id);
      console.log('razorpay_payment_id:', razorpay_payment_id);
      console.log('razorpay_signature:', razorpay_signature);
        const res = await api.post('/api/plan/verify-payment', {
            razorpay_order_id,   
            razorpay_payment_id,
            razorpay_signature,
        });
        if (res.status === 200) {
            console.log("Payment verified successfully");
          await Updates.reloadAsync()
        }
    } catch (error) {
        if (error.response) {
            console.error("Error response data:", error.response.data); 
            console.error("Error status:", error.response.status);
            showError(error.response.data.message || "Payment verification failed. Please try again.");
        } else {
            console.error("Error message:", error.message);
            showError("An error occurred during payment verification.");
        }
    }
};
  
  if (paymentUrl) {
    return (
      <WebView
        source={{ uri: paymentUrl }}
        onMessage={(event) => {
          const response = JSON.parse(event.nativeEvent.data);
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
          verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        }}
        onNavigationStateChange={(navState) => {
          console.log('Navigation state:', navState);
          if (navState.url.includes('payment_failure')) {
            showError('Payment failed. Please try again.');
          }
        }}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="star" size={48} color="#FFD700" />
        <Text style={styles.title}>Upgrade to Premium</Text>
      </View>

      <Text style={styles.description}>
        Unlock all features and take your experience to the next level!
      </Text>

      <TouchableOpacity
        style={styles.purchaseButton}
        onPress={upgradeToPremium}
        disabled={loading}
      >
        <Text style={styles.purchaseButtonText}>
          {loading ? 'Upgrading...' : 'Upgrade Now'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PurchasePremium;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  purchaseButton: {
    backgroundColor: '#276FFC',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
