import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import customAxios from './CustomAxios';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

const Search = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortOption, setSortOption] = useState(null); // Add state for sorting option
  const user = useSelector((state) => state.user.user.user); 

  const getData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await customAxios.get('/getFoodItems');
      setItems(res.data);
      setFilteredItems(res.data);
      console.log('Fetched items:', res.data);
    } catch (err) {
      setError('An error occurred while fetching data: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items]);

  const handleAddPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleOptionSelect = async (option) => {
    if (!selectedItem) return; // Ensure an item is selected
  
    const mealData = {
      user: user._id, 
      [option.toLowerCase()]: selectedItem._id, 
    };
  
    try {
      const response = await customAxios.post('/api/addFood', mealData);
      console.log('Response from server:', response.data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Item added successfully',
        visibilityTime: 3000,
        autoHide: true,
      });
    } catch (err) {
      console.error('Error adding item:', err);
      Toast.show({
        type: 'error', 
        text1: 'Error',
        text2: 'Failed to add item. Please try again.', 
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  
    console.log(`${option} selected for item:`, selectedItem);
    setModalVisible(false);
  };

  // Function to sort items based on the selected option
  const handleSort = (option) => {
    setSortOption(option);
    let sortedItems = [...filteredItems];
    if (option === 'protein') {
      sortedItems.sort((a, b) => b.protein - a.protein); // Sort by protein descending
    } else if (option === 'carbs') {
      sortedItems.sort((a, b) => b.carbs - a.carbs); // Sort by carbs descending
    } else if (option === 'fat') {
      sortedItems.sort((a, b) => b.fat - a.fat); // Sort by fat descending
    }
    setFilteredItems(sortedItems);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetail}>Calories: {item.calories}</Text>
        <Text style={styles.itemDetail}>Carbs: {item.carbs}g</Text>
        <Text style={styles.itemDetail}>Fat: {item.fat}g</Text>
        <Text style={styles.itemDetail}>Protein: {item.protein}g</Text>
      </View>
      <TouchableOpacity onPress={() => handleAddPress(item)}>
        <Ionicons name="add-circle-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="blue" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search food items..."
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <Text style={styles.debugText}>Number of filtered items: {filteredItems.length}</Text>
      
      {/* Sorting options */}
      <View style={styles.sortingContainer}>
        <Text style={styles.sortingLabel}>Sort by:</Text>
        <TouchableOpacity onPress={() => handleSort('protein')}>
          <Text style={[styles.sortingOption, sortOption === 'protein' && styles.selectedSortingOption]}>Protein</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSort('carbs')}>
          <Text style={[styles.sortingOption, sortOption === 'carbs' && styles.selectedSortingOption]}>Carbs</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSort('fat')}>
          <Text style={[styles.sortingOption, sortOption === 'fat' && styles.selectedSortingOption]}>Fat</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No items found</Text>}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Meal Type</Text>
            {['Breakfast', 'Lunch', 'Dinner'].map((option) => (
              <Pressable key={option} onPress={() => handleOptionSelect(option)}>
                <Text style={styles.modalOption}>{option}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 20,
  },
  searchInput: {
    height: 50,
    borderColor: '#C7C7C7',
    borderWidth: 2,
    paddingLeft: 15,
    marginBottom: 15,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  sortingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sortingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortingOption: {
    fontSize: 16,
    color: '#007BFF',
    padding: 5,
  },
  selectedSortingOption: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetail: {
    color: '#666',
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Search;
