import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from './PrivateAxios';
import Toast from 'react-native-toast-message';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const DiaryDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  const { name, calories, protein, fat, carbs, quantity, mealType, id, servingSize } = route.params;
  
  const [editedMealType, setEditedMealType] = useState(mealType);
  const [editedQuantity, setEditedQuantity] = useState(quantity.toString());

  const getMealImage = (type) => {
    switch(type) {
      case 'Breakfast':
        return require('../assets/breakfast.jpeg');
      case 'Lunch':
        return require('../assets/lunch.jpeg');
      case 'Dinner':
        return require('../assets/dinner.jpeg');
      default:
        return require('../assets/fruits.jpeg');
    }
  };

  const handelremove = async () => {
    try {
      const res = await api.delete('/api/removeFood', { data: { meal: editedMealType, id } });
      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Meal Deleted',
          text2: 'Meal has been deleted successfully',
        });
        navigation.goBack();
        navigation.navigate('Diary');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while deleting the meal',
      });
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.put('/api/updateFood', { 
        meal: editedMealType, 
        quantity: editedQuantity, 
        id: id 
      });
      if (res.status === 200) {
        navigation.goBack();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Updated successfully',
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to Update. Please try again.',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  // Nutrition Circle Progress
  const NutritionCircle = ({ percentage, color, size = 70, label, value }) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.nutritionCircle}>
        <Svg width={size} height={size}>
          <Circle
            stroke="#E0E0E0"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={color}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.nutritionCircleContent}>
          <Text style={styles.nutritionCircleValue}>{value}</Text>
          <Text style={styles.nutritionCircleLabel}>{label}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerContainer}>
        <Image
          source={getMealImage(editedMealType)}
          style={styles.headerImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        >
          <Text style={styles.headerTitle}>{name}</Text>
        </LinearGradient>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.mealInfo}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editedMealType}
              style={styles.picker}
              onValueChange={(itemValue) => setEditedMealType(itemValue)}
            >
              <Picker.Item label="Breakfast" value="Breakfast" />
              <Picker.Item label="Lunch" value="Lunch" />
              <Picker.Item label="Dinner" value="Dinner" />
            </Picker>
          </View>
        </View>

        <View style={styles.servingInfo}>
          <Text style={styles.sectionTitle}>Servings</Text>
          <View style={styles.servingInputContainer}>
            <TextInput
              style={styles.servingInput}
              value={editedQuantity}
              onChangeText={setEditedQuantity}
              keyboardType="numeric"
              placeholder="Enter quantity"
            />
            <Text style={styles.servingSize}>{servingSize}</Text>
          </View>
        </View>

        <View style={styles.nutritionCircles}>
          <NutritionCircle
            percentage={(calories / 2000) * 100 * editedQuantity}
            color="#FF6B6B"
            label="Calories"
            value={`${calories * editedQuantity}`}
          />
          <NutritionCircle
            percentage={(protein / 50) * 100 * editedQuantity}
            color="#4ECDC4"
            label="Protein"
            value={`${protein * editedQuantity}g`}
          />
          <NutritionCircle
            percentage={(fat / 65) * 100 * editedQuantity}
            color="#FFD93D"
            label="Fat"
            value={`${fat * editedQuantity}g`}
          />
          <NutritionCircle
            percentage={(carbs / 300) * 100 * editedQuantity}
            color="#6C5CE7"
            label="Carbs"
            value={`${carbs * editedQuantity}g`}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={handleSave}
          >
            <Ionicons name="save-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]} 
            onPress={handelremove}
          >
            <Ionicons name="trash-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Remove Food</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    height: 200,
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  mainContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  picker: {
    height: 50,
    width: '100%',
  },
  servingInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  servingInput: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
  },
  servingSize: {
    fontSize: 14,
    color: '#636e72',
  },
  nutritionCircles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nutritionCircle: {
    width: (width - 60) / 2,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  nutritionCircleContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  nutritionCircleValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  nutritionCircleLabel: {
    fontSize: 12,
    color: '#636e72',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DiaryDetail;