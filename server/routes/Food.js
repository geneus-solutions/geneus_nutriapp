const express = require('express')
const router = express.Router()
const Food = require('../models/Food')
const User = require('../models/User')
const mongoose = require('mongoose')
router.post('/', async (req, res) => {
    const { user, breakfast, lunch, dinner } = req.body;

    try {
        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        let foodData = await Food.findOne({ user });

        const formatItems = (mealItems) => {
            if (!mealItems) return [];
            if (Array.isArray(mealItems)) {
                return mealItems.map(item => ({ item, quantity: 1 }));
            }
            return [{ item: mealItems, quantity: 1 }];
        };

        if (foodData) {
            if (breakfast) {
                const formattedBreakfast = formatItems(breakfast);
                formattedBreakfast.forEach(newItem => {
                    const existingItem = foodData.breakfast.find(item => item.item.toString() === newItem.item);
                    if (existingItem) {
                        existingItem.quantity += newItem.quantity;
                    } else {
                        foodData.breakfast.push(newItem);
                    }
                });
            }

            if (lunch) {
                const formattedLunch = formatItems(lunch);
                formattedLunch.forEach(newItem => {
                    const existingItem = foodData.lunch.find(item => item.item.toString() === newItem.item);
                    if (existingItem) {
                        existingItem.quantity += newItem.quantity;
                    } else {
                        foodData.lunch.push(newItem);
                    }
                });
            }

            if (dinner) {
                const formattedDinner = formatItems(dinner);
                formattedDinner.forEach(newItem => {
                    const existingItem = foodData.dinner.find(item => item.item.toString() === newItem.item);
                    if (existingItem) {
                        existingItem.quantity += newItem.quantity;
                    } else {
                        foodData.dinner.push(newItem);
                    }
                });
            }

            const updatedFood = await foodData.save();
            return res.status(200).json(updatedFood);
        } else {
            const newFood = new Food({
                user,
                breakfast: formatItems(breakfast),
                lunch: formatItems(lunch),
                dinner: formatItems(dinner)
            });

            await newFood.save();
            return res.status(201).json(newFood);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // Validate the user ID
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        // Fetch the food data and populate the 'item' field inside breakfast, lunch, and dinner
        const foodData = await Food.findOne({ user: id })
            .populate('user')  // Populating the user information
            .populate('breakfast.item')  // Populate 'item' field in breakfast
            .populate('lunch.item')      // Populate 'item' field in lunch
            .populate('dinner.item');    // Populate 'item' field in dinner

        // Check if food data exists
        if (!foodData) {
            return res.status(404).json({ message: "No food data found" });
        }

        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        // Helper function to calculate nutrients for a meal
        const calculateNutrients = (mealItems) => {
            return mealItems.reduce((total, meal) => {
                const quantity = meal.quantity || 1;
                return {
                    calories: total.calories + (meal.item.calories || 0) * quantity,
                    protein: total.protein + (meal.item.protein || 0) * quantity,
                    carbs: total.carbs + (meal.item.carbs || 0) * quantity,
                    fat: total.fat + (meal.item.fat || 0) * quantity
                };
            }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
        };

       
        const meals = ['breakfast', 'lunch', 'dinner'];
        meals.forEach(meal => {
            if (foodData[meal]) {
                const mealNutrients = calculateNutrients(foodData[meal]);
                totalCalories += mealNutrients.calories;
                totalProtein += mealNutrients.protein;
                totalCarbs += mealNutrients.carbs;
                totalFat += mealNutrients.fat;
            }
        });

      
        const responseData = {
            ...foodData._doc, 
            totalCalories,
            totalProtein : Math.round(totalProtein),
            totalCarbs : Math.round(totalCarbs),
            totalFat : Math.round(totalFat)
        };

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching food data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;