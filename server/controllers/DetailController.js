const Detail = require('../models/Details')
const User = require('../models/User')

const updateDetail = async (req, res) => {
    const { user, goal, activityLevel, gender, dateOfBirth, country, height, weight, goalWeight } = req.body;
    console.log(req.body)
    try{

const userExists = await User.findById(user)
if(!userExists){
    res.status(404).json({message: "User not found"})
    return
}
const birthDate = new Date(dateOfBirth);
        const age = new Date().getFullYear() - birthDate.getFullYear();
console.log(age)
      
        let bmr;
        if (gender === 'Male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else if (gender === 'Female') {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        } else {
            return res.status(400).json({ message: 'Invalid gender. Please use "Male" or "Female".' });
        }

        
        let activityFactor;
        switch (activityLevel) {
            case 'sedentary': 
                activityFactor = 1.2; 
                break;
            case 'lightlyActive': 
                activityFactor = 1.375; 
                break;
            case 'moderatelyActive': 
                activityFactor = 1.55; 
                break;
            case 'veryActive': 
                activityFactor = 1.725; 
                break;
            case 'extraActive': 
                activityFactor = 1.9; 
                break;
            default:
                activityFactor = 1.2;  
        }
        
        const tdee = bmr * activityFactor;
        const calories = Math.round(tdee)
        console.log(calories)
const detailExists = await Detail.findOne({user})
if(!detailExists){
    const newDetail = new Detail({user, goal, activityLevel, gender, dateOfBirth, country, height, weight, goal, caloriegoal : calories})
    await newDetail.save()
}
const updatedDetail = await Detail.findOneAndUpdate({user}, {goal, activityLevel, gender, dateOfBirth, country, height, weight, caloriegoal : calories}, {new: true})
res.status(200).json(updatedDetail)
    }catch(error){
        res.status(500).json({message: error.message})
    }
}



module.exports = {updateDetail}