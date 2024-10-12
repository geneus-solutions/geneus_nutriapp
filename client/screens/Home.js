import { StyleSheet, Text, View } from 'react-native'; 
import React, { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import * as SecureStore from 'expo-secure-store';
import customAxios from '../component/CustomAxios';
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
import {setNutrition} from '../redux/NutritionSlice'
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="DashboardMain" component={Dashboard} options={{ headerShown: false }} />
    <Stack.Screen options={{ headerShown: false }} name="DashboardSearch" component={Search} />
    <Stack.Screen options={{ headerShown: false }} name="DashboardEdit" component={Edit} />
  </Stack.Navigator>
);
const DiaryStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="DiaryMain" component={Diary} options={{ headerShown: false }} />
    <Stack.Screen options={{ headerShown: false }} name="DiarySearch" component={Search} />
  </Stack.Navigator>
);
const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(null);

  useEffect(() => {
    getUser();
}, [isLoading]);
  useEffect(() => {
    if (!isLoading && !user) {
      navigation.navigate('Login');
    }
  }, [user, isLoading, navigation]);

  const getUser = async () => {
  try {
    const token = await SecureStore.getItemAsync('accessToken');
    if (!token) {
      setIsLoading(false);
      setIsPremium(true);
      return;
    }

    const response = await api.get('/api/user');
    
    if (response.status === 201) {
      console.log("from user home to  ", response.data)
      dispatch(setUser(response.data));
      dispatch(setNutrition(response.data.macronutrients));
      const userPlan = response.data.user.plan;
      console.log("Full user plan response: ", response.data);
      
      if (userPlan) {
        console.log("user plan", userPlan);
        const expirationDate = userPlan.endDate ? new Date(userPlan.endDate) : null;
        console.log("Parsed expiration date:", expirationDate);

        const isDateExpired = expirationDate && new Date() > expirationDate;
        console.log("Is date expired:", isDateExpired);

        if (!isDateExpired) {
          const planName = userPlan.name?.toLowerCase().trim();
          if (planName === 'free trial' || planName === 'premium plan') {
            setIsPremium(true);
          } else {
            setIsPremium(false);
          }
        } else {
          setIsPremium(false);
        }
      } else {
        setIsPremium(false);
      }
    }
  } catch (error) {
    console.log("from user data home ", error);
    setIsPremium(false);
  } finally {
    setIsLoading(false);
  }
};
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isPremium === false) {
    return <PurchasePremium />;
  }
  
  if (isPremium === null) {
    return <Text>Checking premium status...</Text>;
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
        tabBarActiveTintColor: '#2f95dc',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Dashboard" options={{ headerShown: false }} component={DashboardStack} />
      <Tab.Screen name="Diary" options={{ headerShown: false }} component={DiaryStack} />
      <Tab.Screen name="Plan" options={{ headerShown: false }} component={PurchasePremium} />
    </Tab.Navigator>
  );
};

export default Home;

const styles = StyleSheet.create({
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
