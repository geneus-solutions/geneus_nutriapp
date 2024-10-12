import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import * as SecureStore from 'expo-secure-store';
import customAxios from './CustomAxios';
import api from './PrivateAxios';
import Toast from 'react-native-toast-message';
import * as Updates from 'expo-updates';
const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={24} color="#276FFC" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const PurchasePremium = () => {
  const [loading, setLoading] = useState(false);

  const upgrateToPremium = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      const res = await api.put('/api/plan', {});
    if(res.status === 200) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Plan upgraded to Premium successfully',
        visibilityTime: 3000,
        autoHide: true,
        
      });
await Updates.reloadAsync();
    } else {
     Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to upgrade to Premium. Please try again.',
        visibilityTime: 3000,
        autoHide: true,
     })
    }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to upgrade to Premium. Please try again.',
        visibilityTime: 3000,
        autoHide: true,
     })
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="star" size={48} color="#FFD700" />
        <Text style={styles.title}>Upgrade to Premium</Text>
      </View>
      
      <Text style={styles.description}>
        Unlock all features and take your experience to the next level!
      </Text>
      
      <View style={styles.featuresContainer}>
        <FeatureItem icon="infinite-outline" text="Unlimited access to all content" />
        <FeatureItem icon="bar-chart-outline" text="Advanced analytics" />
        <FeatureItem icon="people-outline" text="Priority support" />
      </View>
      
      <View style={styles.pricingContainer}>
        <Text style={styles.price}>$9.99</Text>
        <Text style={styles.period}>per month</Text>
      </View>
      
      <TouchableOpacity style={styles.purchaseButton} onPress={upgrateToPremium} disabled={loading}>
        <Text style={styles.purchaseButtonText}>
          {loading ? "Upgrading..." : "Upgrade Now"}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.termsText}>
        By upgrading, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </ScrollView>
  );
};


export default PurchasePremium;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop : 40
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
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0072DB',
  },
  period: {
    fontSize: 16,
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
  termsText: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center',
    color: '#999',
  },
});
