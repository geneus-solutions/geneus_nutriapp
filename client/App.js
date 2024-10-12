import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Register from './screens/Register';
import Login from './screens/Login';
import UserData from './screens/UserData';
import Home from './screens/Home';
import {Provider} from 'react-redux';
import store from './redux/store';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Login");

  useEffect(() => {
    const checkSecureStorage = async () => {

      const accessToken = await SecureStore.getItemAsync('accessToken');
      console.log(accessToken)
   
      if (accessToken) {
        setInitialRoute('Home'); 
      } else {
        setInitialRoute('Login'); 
      }
      setLoading(false); 
    };

    checkSecureStorage();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="UserData" component={UserData} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
      <Toast />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
