import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddressList: (state, action) => {
      state.list = action.payload;
    },
    addAddress: (state, action) => {
      state.list.push(action.payload);
    },
    updateAddress: (state, action) => {
      const index = state.list.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeAddress: (state, action) => {
      state.list = state.list.filter((a) => a.id !== action.payload);
    },
  },
});

export const { setAddressList, addAddress, updateAddress, removeAddress } = addressSlice.actions;
export default addressSlice.reducer;