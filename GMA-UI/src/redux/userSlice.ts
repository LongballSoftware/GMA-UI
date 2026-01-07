import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type User = {
  username: string;
  token: string;
};

const initialState: User = {
  username: "",
  token: ""
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => action.payload,
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;