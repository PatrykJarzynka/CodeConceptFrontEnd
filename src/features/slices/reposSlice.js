import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  money: 0,
  title: "",
};

export const reposSlice = createSlice({
  name: "repos",
  initialState,
  reducers: {
    saveData: (state, action) => {
      const { email, money, title } = action.payload;
      state.email = email;
      state.money = money;
      state.title = title;
    },
  },
});

export const { saveData } = reposSlice.actions;

export const selectEmail = (state) => state.data.email;
export const selectMoney = (state) => state.data.money;
export const selectTitle = (state) => state.data.title;

export default reposSlice.reducer;
