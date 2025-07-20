import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { User } from "../type";
import API from "../../lib/axios";

axios.defaults.withCredentials = true;

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

type VerifyResponse = {
  user: User;
  accessToken: string;
};

//// ---------------------- SIGNUP USER --------------------------- ////

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async ({ data }: { data: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/user/register`, data);
      return response.data.message;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || "Signup failed");
      }
    }
  }
);

//// ---------------------- VERIFY USER --------------------------- ////

export const verifyUser = createAsyncThunk<VerifyResponse, { code: string }>(
  "user/verifyUser",
  async ({ code }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/user/verify`, { code });
      return {
        user: response.data.user,
        accessToken: response.data.accessToken,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || "Verification failed"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

//// ---------------------- LOGIN USER --------------------------- ////

export const loginUser = createAsyncThunk<VerifyResponse, { email: string; password: string }>(
  "user/loginUser",
  async ({ email,password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/user/login`, { email,password });
      return {
        user: response.data.user,
        accessToken: response.data.accessToken,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || "Verification failed"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

/// ------------------------ LOGOUT USER --------------------------- ////

export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  try {
    await axios.post(`${API_URL}/user/logout`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data.message;
    }
  }
});

//// ----------------- Forgot Password ----------------- ////

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email,
      });
      return res.data.message;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || "Verification failed"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

//// ----------------- Reset Password ----------------- ////

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/reset-password/${token}`,
        {
          password,
        }
      );
      return res.data.message;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || "Verification failed"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

//// ----------------- Check Auth ----------------- ////

export const checkAuth = createAsyncThunk("user/checkAuth", async (_, thunkAPI) => {
  try {
    const res = await API.get("/user/checkauth"); 
    return res.data.accessToken;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.response?.data.message);
    }
    return thunkAPI.rejectWithValue("Something went wrong");
  }
});

interface AuthState {
  user: User | null;
  signupLoading: boolean;
  verifyLoding: boolean;
  loginLoading: boolean;
  forgotPasswordLoading: boolean;
  resetPasswordLoading: boolean;
  logoutLoading: boolean;

  registerError: string | null;
  verifyError: string | null;
  loginError: string | null;
  forgotPasswordError: string | null;
  resetPasswordError: string | null;
  logoutError: string | null;

  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  signupLoading: false,
  verifyLoding: false,
  loginLoading: false,
  forgotPasswordLoading: false,
  resetPasswordLoading: false,
  logoutLoading: false,

  registerError: null,
  verifyError: null,
  loginError: null,
  forgotPasswordError: null,
  resetPasswordError: null,
  logoutError: null,

  isAuthenticated: false,
  isCheckingAuth: true,
  accessToken: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /// ---------------------- SIGNUP USER --------------------------- ///
      .addCase(signupUser.pending, (state) => {
        state.signupLoading = true;
        state.registerError = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.signupLoading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.signupLoading = false;
        state.registerError = action.payload as string;
      })

      /// ---------------------- VERIFY USER --------------------------- ///

      .addCase(verifyUser.pending, (state) => {
        state.verifyLoding = true;
        state.verifyError = null;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.verifyLoding = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.verifyLoding = false;
        state.verifyError = action.payload as string;
      })

      /// ---------------------- LOGIN USER --------------------------- ///

      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload as string;
      })

      /// ---------------------- LOGOUT USER --------------------------- ///

      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
        state.logoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false;
        state.user = null;
        state.accessToken = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutLoading = false;
        state.logoutError = action.payload as string;
      })

      /// ---------------------- FORGOT PASSWORD --------------------------- ///

      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordError = action.payload as string;
      })

      /// ---------------------- RESET PASSWORD --------------------------- ///

      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload as string;
      })

      // ---------------------- CHECK AUTH --------------------------- ///

      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = false;
      });
  },
});

export const { setAccessToken } = userSlice.actions;
export default userSlice.reducer;
