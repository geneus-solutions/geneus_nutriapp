import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import customAxios from '../component/CustomAxios';
import { setUser } from '../redux/UserSlice';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'All fields are required!',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email address.',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    if (password.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password is required.',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    try {
      const response = await customAxios.post('/login', {
        email,
        password,
      });

      if (response.status === 200) {
        dispatch(setUser(response.data));
        await SecureStore.setItemAsync('accessToken', response.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Logged in successfully',
          visibilityTime: 3000,
          autoHide: true,
        });
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log('login error', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to login. Please try again.',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.imageContainer}>
        <Image source={require('../assets/Register.png')} style={styles.image} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          onChangeText={text => setPassword(text)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.loginLink}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    width: '95%',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 40,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    color: '#333',
  },
  loginLink: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default Login;
