import { createSlice } from '@reduxjs/toolkit';

const initialState = {  
    user: null,   
  };

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        setUser(state, action){
            console.log("From redux",action.payload)
            state.user = action.payload
        },
        removeUser(state, action){
            state.user = null
        }
    }
})

export const {setUser, removeUser} = userSlice.actions

export default userSlice.reducer