import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'; 
import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../component/Dashbord/Dashbord';
import PurchasePremium from '../component/PurchasePremium';
import Diary from '../component/Diary';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/UserSlice';
import { Ionicons } from 'react-native-vector-icons';
import Search from '../component/Search';
import Edit from '../component/Edit';
import api from '../component/PrivateAxios';
import { setNutrition } from '../redux/NutritionSlice';
import DiaryDetail from '../component/DiaryDetail';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="DashboardMain" component={Dashboard} options={{ headerShown: false }} />
    <Stack.Screen name="DashboardSearch" component={Search} options={{ headerShown: false }} />
    <Stack.Screen name="DashboardEdit" component={Edit} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const DiaryStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="DiaryMain" component={Diary} options={{ headerShown: false }} />
    <Stack.Screen name="DiarySearch" component={Search} options={{ headerShown: false }} />
    <Stack.Screen name="DiaryDetail" component={DiaryDetail} />
  </Stack.Navigator>
);

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2196F3" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(null);

  useEffect(() => {
    checkUserStatus();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      navigation.replace('Login');
    }
  }, [user, isLoading]);

  const checkPlanStatus = (plan) => {
    if (!plan) return false;

    const planName = plan.name?.toLowerCase().trim();
    const expirationDate = plan.endDate ? new Date(plan.endDate) : null;
    const isExpired = expirationDate && new Date() > expirationDate;

    console.log('Plan check:', {
      planName,
      expirationDate,
      isExpired,
    });

    return !isExpired && (planName === 'free trial' || planName === 'premium plan');
  };

  const checkUserStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        console.log('No token found');
        setIsPremium(false);
        setIsLoading(false);
        return;
      }

      const response = await api.get('/api/user');
      console.log('User data response:', response.data);

      if (!response.data) {
        navigation.replace('Login');
        return;
      }

      dispatch(setUser(response.data));
      
      if (response.data.macronutrients) {
        dispatch(setNutrition(response.data.macronutrients));
      }

     
      const userPlan = response.data.plan || response.data.user?.plan;
      const hasPremium = checkPlanStatus(userPlan);
      
      console.log('Premium status:', hasPremium);
      setIsPremium(hasPremium);

    } catch (error) {
      console.error('Error checking user status:', error);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null; 
  }

  if (isPremium === false) {
    return <PurchasePremium onPurchaseComplete={checkUserStatus} />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Diary') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Plan') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} options={{ headerShown: false }} />
      <Tab.Screen name="Diary" component={DiaryStack} options={{ headerShown: false }} />
      <Tab.Screen name="Plan" component={PurchasePremium} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  tabBar: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingBottom: 5,
    height: 60,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Home;