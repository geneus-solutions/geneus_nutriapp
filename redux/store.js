import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import NutritionSlice from "./NutritionSlice"
const store = configureStore({
  reducer: {
    user: UserSlice,
    nutrition: NutritionSlice
  },
})

export default store;