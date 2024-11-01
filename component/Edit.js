import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Platform ,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/UserSlice';
import customAxios from './CustomAxios';
import * as Updates from 'expo-updates';
import Toast from 'react-native-toast-message';
const Edit = ({ navigation }) => {
    const user = useSelector((state) => state.user.user);
    console.log('From edit', user.user._id);
    const dispatch = useDispatch();
  
    const [profile, setProfile] = useState({
      goal: '',
      activityLevel: '',
      gender: '',
      dateOfBirth: new Date(),
      country: '',
      height: '',
      weight: '',
    });
  
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    useEffect(() => {
      if (user) {
        setProfile({
          goal: user.goal || '',
          activityLevel: user.activityLevel || '',
          gender: user.gender || '',
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
          country: user.country || '',
          height: user.height ? user.height.toString() : '',
          weight: user.weight ? user.weight.toString() : '',
        });
      }
    }, [user]);
  
    const handleChange = (name, value) => {
      if (name === 'height' || name === 'weight') {
        const numValue = parseFloat(value);
        if (numValue < 0) {
          Toast.show({
            type: 'error',
            text1: 'Invalid Input',
            text2: `${name.charAt(0).toUpperCase() + name.slice(1)} cannot be less than 0`,
            visibilityTime: 3000,
            autoHide: true,
          });
          return;
        }
      }
  
      setProfile(prevProfile => ({
        ...prevProfile,
        [name]: value
      }));
    };
  
  
    const handleDateChange = (event, selectedDate) => {
      setShowDatePicker(Platform.OS === 'ios');
      if (selectedDate) {
        handleChange('dateOfBirth', selectedDate);
      }
    };
  
    const validateFields = () => {
      const { goal, activityLevel, gender, country, height, weight } = profile;
      
      if (!goal) {
        Alert.alert("Error", "Goal is required!");
        return false;
      }
      
      if (!activityLevel) {
        Alert.alert("Error", "Activity Level is required!");
        return false;
      }
      
      if (!gender) {
        Alert.alert("Error", "Gender is required!");
        return false;
      }
      
      if (!country) {
        Alert.alert("Error", "Country is required!");
        return false;
      }
      
      if (!height) {
        Alert.alert("Error", "Height is required!");
        return false;
      }
      
      if (!weight) {
        Alert.alert("Error", "Weight is required!");
        return false;
      }
    
      return true;
    }
  
    const handleSubmit = async () => {
      if (!validateFields()) return;
  
      try {
        const response = await customAxios.post('/api/detail/update', {
          user : user.user._id, goal : profile.goal, activityLevel : profile.activityLevel, gender : profile.gender, dateOfBirth : profile.dateOfBirth, country : profile.country, height : profile.height, weight : profile.weight
        })
        if (response.status === 200) {
          Alert.alert("Success", "Profile updated successfully!");
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Details Edited successfully',
            visibilityTime: 3000,
            autoHide: true,
            
          });
          navigation.goBack();
          await Updates.reloadAsync()
        } else {
          Toast.show({
            type: 'error', 
            text1: 'Error',
            text2: 'Failed to Edit details. Please try again.', 
            visibilityTime: 3000,
            autoHide: true,
        });
          
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    };
  
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Goal</Text>
          <Picker
            selectedValue={profile.goal}
            onValueChange={(itemValue) => handleChange('goal', itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Goal" value="" />
            <Picker.Item label="Lose Weight" value="Lose Weight" />
            <Picker.Item label="Maintain Weight" value="Maintain Weight" />
            <Picker.Item label="Gain Weight" value="Gain Weight" />
            <Picker.Item label="Gain Muscle" value="Gain Muscle" />
            <Picker.Item label="Manage Stress" value="Manage Stress" />
            <Picker.Item label="Athletic Performance" value="Athletic Performance" />
          </Picker>
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Activity Level</Text>
          <Picker
            selectedValue={profile.activityLevel}
            onValueChange={(itemValue) => handleChange('activityLevel', itemValue)}
            style={styles.picker}
          >
           
            <Picker.Item label="sedentary" value="sedentary" />
            <Picker.Item label="lightlyActive" value="lightlyActive" />
            <Picker.Item label="moderatelyActive" value="moderatelyActive" />
            <Picker.Item label="veryActive" value="veryActive" />
            <Picker.Item label="extraActive" value="extraActive" />
          </Picker>
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <Picker
            selectedValue={profile.gender}
            onValueChange={(itemValue) => handleChange('gender', itemValue)}
            style={styles.picker}
          >
           
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
           
          </Picker>
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateInput}>
              {profile.dateOfBirth.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={profile.dateOfBirth}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={profile.country}
            onChangeText={(text) => handleChange('country', text)}
            placeholder="Enter your country"
          />
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={profile.height}
            onChangeText={(text) => handleChange('height', text)}
            placeholder="Enter your height"
            keyboardType="numeric"
          />
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={profile.weight}
            onChangeText={(text) => handleChange('weight', text)}
            placeholder="Enter your weight"
            keyboardType="numeric"
          />
        </View>
  
        <TouchableOpacity style={styles.button} onPress={ handleSubmit}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      fontWeight: '600',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      borderRadius: 5,
      fontSize: 16,
      backgroundColor: '#fff',
    },
    picker: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      backgroundColor: '#fff',
    },
    dateInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      borderRadius: 5,
      fontSize: 16,
      backgroundColor: '#fff',
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom : 40
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
export default Edit;
