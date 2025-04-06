import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "@/types";

interface UserState {
  id: string | undefined;
  name: string | null;
  email: string | null | undefined;
  role?: UserRole | null;
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
      // Reset Redux state
      state.id = undefined;
      state.name = null;
      state.email = null;
      state.role = null;
      state.walletAddress = null;

      // Optional: Clear localStorage here (or you can leave this to the component)
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("role");
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
