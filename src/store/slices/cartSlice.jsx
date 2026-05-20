import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cartSlice",
  initialState: {
    isOpen: false,
  },
  reducers: {
    changeCartStatus: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { changeCartStatus } = cartSlice.actions;
export default cartSlice.reducer;
