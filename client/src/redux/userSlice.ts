import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "@/types"; 

interface UserState {
  id: string | undefined;
  name: string | null;
  email: string | null | undefined;
  role: UserRole | null;
  walletAddress: string | null;
}

const initialState: UserState = {
  id: undefined,
  name: null,
  email: null,
  role: null,
  walletAddress: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.walletAddress = action.payload.walletAddress;
    },
    clearUser: (state) => {
      state.id = undefined;
      state.name = null;
      state.email = null;
      state.role = null;
      state.walletAddress = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
