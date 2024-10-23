import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from 'react-native-vector-icons';
import customAxios from './CustomAxios';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const MealItem = ({ item, mealType }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('DiaryDetail', {
      name: item.item.name,
      calories: item.item.calories,
      protein: item.item.protein,
      fat: item.item.fat,
      carbs: item.item.carbs,
      quantity: item.quantity,
      mealType: mealType,
      id : item._id,
      servingSize : item.item.servingSize,
    })}>
      <View style={styles.mealItem}>
        <View>
          <Text style={styles.mealName}>{item.item.name}</Text>
          <Text style={styles.mealQuantity}>Quantity: {item.quantity}</Text>
        </View>
        <Text style={styles.mealCalories}>{item.item.calories} kcal</Text>
      </View>
    </TouchableOpacity>
  );
};

const MealSection = ({ title, items, onAddPress }) => (
  <View style={styles.mealSection}>
    <View style={styles.mealHeader}>
      <Text style={styles.mealTitle}>{title}</Text>
      <TouchableOpacity onPress={() => onAddPress(title)}>
        <Ionicons name="add-circle-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
    {items.map((item, index) => (
      <MealItem
        key={index}
        item={item}
        mealType={title}
      />
    ))}
  </View>
);

const Diary = ({navigation}) => {
  const user = useSelector((state) => state.user.user.user);
  const [diary, setDiary] = useState(null);

  const getDiary = async () => {
    try {
      const response = await customAxios.get(`/api/food/${user._id}`);
      setDiary(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getDiary();
    }, [])
  );

  const handleAddPress = (mealType) => {
    navigation.navigate('DiarySearch', { mealType });
  };

  if (!diary) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const meals = {
    Breakfast: diary.breakfast || [],
    Lunch: diary.lunch || [],
    Dinner: diary.dinner || [],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diary</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {Object.entries(meals).map(([title, items]) => (
          <MealSection 
            key={title} 
            title={title} 
            items={items} 
            onAddPress={handleAddPress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};


export default Diary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    backgroundColor: '#67ACED',
    borderBottomColor: '#e0e0e0',
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  mealSection: {
    marginBottom: 20,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mealName: {
    fontSize: 16,
  },
  mealQuantity: {
    color: 'gray',
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
