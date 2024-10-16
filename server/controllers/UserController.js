const User = require('../models/User');
const Detail = require('../models/Details')
const Food = require('../models/Food');
const Plan = require('../models/Plan')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require('../controllers/Auth')
const secreat = "yash"

const registerUser = async (req, res) => {
    const { name, email, password, number } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            number
        });

        const newDetail = await Detail.create({ user: newUser._id });
        const newFood = await Food.create({ user: newUser._id });
       
        const freePlanPrice = 0; 

        const newPlan = await Plan.create({
            userId: newUser._id,
            name: 'Free Trial',  
            duration: 7,
            price: freePlanPrice 
        });

        newUser.details = newDetail._id;
        newUser.food = newFood._id;
        newUser.plan = newPlan._id;

        await newUser.save();  

        const accessToken = generateAccessToken(newUser); 
        const refreshToken = generateRefreshToken(newUser); 
        newUser.refreshToken = refreshToken; 
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                details: newUser.details,
                food: newUser.food,
                number : newUser.number,
                plan : newUser.plan,
            },
            accessToken, 
            refreshToken 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            message: 'Logged in successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                plan : user.plan
            },
            accessToken, 
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


const getUser = async (req, res) => {
    const { userId } = req.user;
    try {
        console.log(userId);
        const user = await User.findById(userId)
            .populate('details')
            .populate('food')
            .populate('plan');

        console.log(user.details.caloriegoal);
        
        const totalCalories = user.details.caloriegoal;
        const goal = user.details.goal;

        // Macronutrient percentage mapping based on the goal
        const macronutrientDistribution = {
            'Lose Weight': { protein: 30, carbs: 40, fat: 30 },
            'Gain Muscle': { protein: 35, carbs: 40, fat: 25 },
            'Athletic Performance': { protein: 30, carbs: 50, fat: 20 },
            'Maintain Weight': { protein: 30, carbs: 45, fat: 25 },
            'Gain Weight': { protein: 20, carbs: 55, fat: 25 },
            'Manage Stress': { protein: 30, carbs: 25, fat: 45 },
        };

        // Fallback to a default value if the goal is not found
        const { protein: proteinPercent, carbs: carbsPercent, fat: fatPercent } = macronutrientDistribution[goal] || { protein: 20, carbs: 50, fat: 30 };

        // Calculate macronutrients in grams based on kcal to gram conversion
        const proteinGrams = (totalCalories * (proteinPercent / 100)) / 4;  // Protein has 4 kcal/gram
        const carbsGrams = (totalCalories * (carbsPercent / 100)) / 4;    // Carbs have 4 kcal/gram
        const fatGrams = (totalCalories * (fatPercent / 100)) / 9;         // Fat has 9 kcal/gram

        console.log(`Protein: ${Math.round(proteinGrams)}g, Carbs: ${Math.round(carbsGrams)}g, Fat: ${Math.round(fatGrams)}g`);

        res.status(201).json({
            user,
            macronutrients: {
                protein: Math.round(proteinGrams),
                carbs: Math.round(carbsGrams),
                fat: Math.round(fatGrams)
            }
        });
    } catch (error) {
        console.error('Server error: ', error);
        res.status(500).json({ message: 'Server error', error });
    }
};



module.exports = {
    registerUser,
    loginUser,
    getUser
};
