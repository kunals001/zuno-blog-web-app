import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  name: string;
  email: string;
};

const initialState: UserState = {
  name: '',
  email: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    clearUser() {
      return { name: '', email: '' };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
