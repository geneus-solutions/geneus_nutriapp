const { model } = require('mongoose')
const Plan = require('../models/Plan')

const updateToPremium = async (req, res) => {
    const { userId } = req.user;

    try {
        const startDate = new Date(); // Current date
        const endDate = new Date(startDate); // Create a new date object for endDate
        endDate.setDate(endDate.getDate() + 30); // Set endDate to 30 days after startDate

        const updatedPlan = await Plan.findOneAndUpdate(
            { userId: userId }, 
            {
                name: "Premium Plan",
                duration: 30,
                price: 1000,
                startDate: startDate,
                endDate: endDate, // Set endDate based on calculated value
            },
            { new: true } // Return the updated document
        );

        if (!updatedPlan) {
            return res.status(404).json({ message: "Plan not found for this user." });
        }

        res.status(200).json({
            message: "Plan updated to Premium",
            plan: updatedPlan,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    updateToPremium
}
