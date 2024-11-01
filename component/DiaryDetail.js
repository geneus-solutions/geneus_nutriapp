import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput,  TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import api from './PrivateAxios';
import Toast from 'react-native-toast-message';
const DiaryDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  const { name, calories, protein, fat, carbs, quantity, mealType, id, servingSize } = route.params;
console.log(servingSize)
  
  const [editedMealType, setEditedMealType] = useState(mealType);
  const [editedQuantity, setEditedQuantity] = useState(quantity.toString());
const handelremove = async() =>{
try{
  const res = await api.delete('/api/removeFood', { data: { meal: editedMealType, id } });

if(res.status === 200){
  console.log("Deleted meal", res.data.message)
  Toast.show({
    type: 'success',
    text1: 'Meal Deleted',
    text2: 'Meal has been deleted successfully',
  })
  navigation.goBack();
  navigation.navigate('Diary')
}
}catch(error){
  console.log(error)
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: 'An error occurred while deleting the meal',
  })
}
}
  const handleSave = async() => {   
 
try{
const res = await api.put('/api/updateFood', { meal : editedMealType, quantity : editedQuantity, id : id });
if(res.status === 200){
  console.log("Updated meal", res.data.message);
  navigation.goBack();
  Toast.show({
    type: 'success',
    text1: 'Success',
    text2: 'Updated successfully',
    visibilityTime: 3000,
    autoHide: true,
    
  });
}
}catch(error){
  console.log(error);
  Toast.show({
    type: 'error', 
    text1: 'Error',
    text2: 'Failed to Update. Please try again.', 
    visibilityTime: 3000,
    autoHide: true,
});
}
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.entryDetails}>
        <Text style={styles.entryTitle}>{name}</Text>

        {/* Meal Type Selector */}
        <View style={styles.mealInfo}>
          <Text style={styles.mealLabel}>Meal Type</Text>
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

        {/* Editable Quantity Input */}
        <View style={styles.servingInfo}>
          <Text style={styles.servingLabel}>Number of Servings</Text>
          <TextInput
            style={styles.servingInput}
            value={editedQuantity}
            onChangeText={(text) => setEditedQuantity(text)}
            keyboardType="numeric"
          />
        </View>

        <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style = {{fontSize : 15}}>Serving Size</Text>
        <Text>{servingSize}</Text>
      </View>

      </View>

     

      {/* Nutritional Info */}
      <View style={styles.nutritionList}>
        <NutritionItem label="Calories" value={`${calories*editedQuantity} kcal`} />
        <NutritionItem label="Protein" value={`${protein*editedQuantity} g`} />
        <NutritionItem label="Fat" value={`${fat*editedQuantity} g`} />
        <NutritionItem label="Carbs" value={`${carbs*editedQuantity} g`} />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handelremove}>
        <Text style={styles.saveButtonText}>Remove Food</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const NutritionItem = ({ label, value }) => (
  <View style={styles.nutritionItem}>
    <Text style={styles.nutritionLabel}>{label}</Text>
    <Text style={styles.nutritionValue}>{value}</Text>
  </View>
);

export default DiaryDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  entryDetails: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 40,
  },
  entryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  mealInfo: {
    marginBottom: 12,
  },
  mealLabel: {
    fontSize: 16,
    color: '#555',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  servingInfo: {
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  servingLabel: {
    fontSize: 16,
    color: '#555',
  },
  servingInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 8,
  },
  nutritionList: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#777',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
