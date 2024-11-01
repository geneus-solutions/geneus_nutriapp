import { createSlice } from '@reduxjs/toolkit';

const initialState = {  
    nutrition: null,   
  };

const nutritionSlice = createSlice({
    name : 'nutrition',
    initialState,
    reducers : {
        setNutrition(state, action){
            console.log("From redux",action.payload)
            state.nutrition = action.payload
        },
        removeNutrition(state, action){
            state.nutrition = null
        }
    }
})

export const {setNutrition, removeNutrition} = nutritionSlice.actions
export default nutritionSlice.reducer