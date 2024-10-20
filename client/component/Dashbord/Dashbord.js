import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Ionicons } from 'react-native-vector-icons';
import CalorieDiagram from '../CalorieDiagram';
import * as Updates from 'expo-updates';
import * as SecureStore from 'expo-secure-store';
import customAxios from '../CustomAxios';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
  const [totalCalories, setTotalCalories] = useState(0);
  const user = useSelector((state) => state.user.user.user);
  const nutritionsData = useSelector((state) => state.nutrition.nutrition);
  console.log("data from dashboard ", nutritionsData);

  const [remainingCalories, setRemainingCalories] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollX = new Animated.Value(0);
  const [nutritionData, setNutritionData] = useState([
    { title: 'Calories', goal: 0, current: 0, remaining: 0 },
    { title: 'Protein', goal: 0, current: 0, remaining: 0 },
    { title: 'Carbs', goal: 0, current: 0, remaining: 0 },
    { title: 'Fat', goal: 0, current: 0, remaining: 0 },
  ]);

  const getFood = useCallback(async () => {
    if(user === null){
      navigation.navigate('Login');
    }
    try {
      const response = await customAxios.get(`/api/food/${user._id}`);

      if (response.status === 200) {
        console.log("Food data", response.data);
        const { totalCalories, totalProtein, totalCarbs, totalFat } = response.data;
        const calorieGoal = user.details?.caloriegoal || 0;

        setTotalCalories(totalCalories);
        setRemainingCalories(calorieGoal - totalCalories);

        setNutritionData([
          { title: 'Calories', goal: calorieGoal, current: totalCalories, remaining: calorieGoal - totalCalories },
          { title: 'Protein', goal: nutritionsData?.protein || 0, current: totalProtein, remaining: (nutritionsData?.protein || 0) - totalProtein },
          { title: 'Carbs', goal: nutritionsData?.carbs || 0, current: totalCarbs, remaining: (nutritionsData?.carbs || 0) - totalCarbs },
          { title: 'Fat', goal: nutritionsData?.fat || 0, current: totalFat, remaining: (nutritionsData?.fat || 0) - totalFat },
        ]);
      }
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  }, [user._id, user.details?.caloriegoal, nutritionsData]);

  useFocusEffect(
    useCallback(() => {
      getFood();
      
    }, [getFood])
  );

  const handleReload = async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Error reloading app:', error);
    }
  };

  return (
    <View style={{ flex: 1, marginTop: 30, margin: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={{ fontSize: 35, fontWeight: 'bold' }}>Hello {user.name}</Text>
        </View>

        <View>
          <TouchableOpacity onPress={() => navigation.navigate('DashboardSearch')}>
            <View style={styles.searchBar}>
              <Text style={{ color: 'gray' }}>Search and add food</Text>
              <Ionicons name='search' size={30} color='black' />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.carouselContainer}>
          <Animated.ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(event) => {
              const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (screenWidth - 40));
              setActiveSlide(slideIndex);
            }}
          >
            {nutritionData.map((item, index) => {
              const inputRange = [
                (index - 1) * (screenWidth - 40),
                index * (screenWidth - 40),
                (index + 1) * (screenWidth - 40),
              ];

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.8, 1, 0.8],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.slide,
                    { transform: [{ scale }] }
                  ]}
                >
                  <View style={[styles.infoBox, { width: screenWidth - 60 }]}>
                    <Text style={styles.headerText}>{item.title}</Text>
                    <CalorieDiagram
                      goal={item.goal}
                      current={item.current}
                      remaining={item.remaining}
                    />
                  </View>
                </Animated.View>
              );
            })}
          </Animated.ScrollView>
          <View style={styles.pagination}>
            {nutritionData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeSlide ? styles.paginationDotActive : null,
                ]}
              />
            ))}
          </View>
        </View>

        <View>
          <View style={styles.infoBoxRow}>
            <Text style={styles.headerText}>Weight</Text>
            <Text style={styles.valueText}>{user.details?.weight || 'N/A'} kg</Text>
          </View>
        </View>

        

        <TouchableOpacity onPress={() => navigation.navigate('DashboardEdit')}>
          <View>
            <View style={styles.editProfileBox}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReload}>
          <View>
            <View style={styles.editProfileBox}>
              <Text style={styles.editProfileText}>Logout</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  searchBar: {
    borderWidth: 1,
    borderColor: 'lightgray',
    marginTop: 10,
    padding: 10,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoBox: {
    borderWidth: 1,
    borderColor: 'lightgray',
    marginTop: 30,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'column',
    marginRight: 20
  },
  infoBoxRow: {
    borderWidth: 1,
    borderColor: 'lightgray',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0072DB',
  },
  valueText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  editProfileBox: {
    borderWidth: 3,
    borderColor: '#276FFC',
    marginTop: 30,
    padding: 10,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  slide: {
    width: screenWidth - 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'lightgray',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#0072DB',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});