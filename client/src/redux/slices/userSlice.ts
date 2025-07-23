import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { User } from "../type";
import api from "@/lib/axiosInstance";
import { setToken } from "@/lib/tokenService";

axios.defaults.withCredentials = true;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

//// ----------------- Register User ----------------- ////
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string},
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/register`, {
        name,
        email,
        password,
      });
      return res.data.message; 
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || "Signup failed");
      }
    }
  }
);

//// ----------------- Verify Email ----------------- ////
type VerifyResponse = {
  user: User;
  accessToken: string;
};

export const verifyEmail = createAsyncThunk<
  VerifyResponse,
  { code: string },
  { rejectValue: string }
>("user/verifyEmail", async ({ code }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/api/users/verify`, { code });
    return {
      user: res.data.user,
      accessToken: res.data.accessToken,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || "Verification failed"
      );
    }
    return rejectWithValue("Something went wrong");
  }
});

//// ----------------- Google Signup ----------------- ////

type UserInfo = {
  name: string;
  email: string;
  profilePic: string;
};

export const googleSignup = createAsyncThunk<
  VerifyResponse,
  UserInfo,
  { rejectValue: string }
>("user/googleSignup", async (userInfo, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/api/users/google-signup`, userInfo);
    return {
      user: res.data.user,
      accessToken: res.data.accessToken,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || "Verification failed"
      );
    }
    return rejectWithValue("Something went wrong");
  }
});

//// ----------------- Login User ----------------- ////
export const loginUser = createAsyncThunk<
  VerifyResponse,
  { email: string; password: string },
  { rejectValue: string }
>("user/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/api/users/login`, {
      email,
      password,
    });
    return {
      user: res.data.user,
      accessToken: res.data.accessToken,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || "Verification failed"
      );
    }
    return rejectWithValue("Something went wrong");
  }
});

//// ----------------- Logout User ----------------- ////

export const logoutUser = createAsyncThunk<
  string, 
  void,   
  { rejectValue: string } 
>("user/logoutUser", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/api/users/logout`);
    return res.data.message;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message || "Logout failed");
  }
});

//// ----------------- Forgot Password ----------------- ////

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/forgot-password`, {
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
  "user/resetPassword",
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/users/reset-password/${token}`,
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

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/users/check-auth");
      return res.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || "Check Auth failed"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

interface AuthState {
  user: User | null;
  signupLoading: boolean;
  verifyLoding: boolean;
  loginLoading: boolean;
  forgotPasswordLoading: boolean;
  resetPasswordLoading: boolean;
  logoutLoading: boolean;
  googleLoading: boolean;

  registerError: string | null;
  verifyError: string | null;
  loginError: string | null;
  forgotPasswordError: string | null;
  resetPasswordError: string | null;
  logoutError: string | null;
  googleError: string | null;

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
  googleLoading: false,

  registerError: null,
  verifyError: null,
  loginError: null,
  forgotPasswordError: null,
  resetPasswordError: null,
  logoutError: null,
  googleError: null,

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
    clearRegisterError: (state) => {
      state.registerError = null;
    },
    clearVerifyError: (state) => {
      state.verifyError = null;
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
    clearForgotPasswordError: (state) => {
      state.forgotPasswordError = null;
    },
    clearResetPasswordError: (state) => {
      state.resetPasswordError = null;
    },
    clearLogoutError: (state) => {
      state.logoutError = null;
    },
    clearGoogleError: (state) => {
      state.googleError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /// ---------------------- SIGNUP USER --------------------------- ///
      .addCase(registerUser.pending, (state) => {
        state.signupLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.signupLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.signupLoading = false;
        state.registerError = action.payload as string;
      })

      /// ---------------------- VERIFY USER --------------------------- ///

      .addCase(verifyEmail.pending, (state) => {
        state.verifyLoding = true;
        state.verifyError = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verifyLoding = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;

        setToken(action.payload.accessToken);
      })
      .addCase(verifyEmail.rejected, (state, action) => {
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

        setToken(action.payload.accessToken);
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

        setToken(null);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutLoading = false;
        state.logoutError = action.payload as string;
      })

      /// ---------------------- GOOGLE LOGIN --------------------------- ///

      .addCase(googleSignup.pending, (state) => {
        state.googleLoading = true;
        state.googleError = null;
      })
      .addCase(googleSignup.fulfilled, (state, action) => {
        state.googleLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;

        setToken(action.payload.accessToken);
      })
      .addCase(googleSignup.rejected, (state, action) => {
        state.googleLoading = false;
        state.googleError = action.payload as string;
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
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const {
  setAccessToken,
  clearRegisterError,
  clearVerifyError,
  clearLoginError,
  clearForgotPasswordError,
  clearResetPasswordError,
  clearLogoutError,
  clearGoogleError
} = userSlice.actions;
export default userSlice.reducer;
