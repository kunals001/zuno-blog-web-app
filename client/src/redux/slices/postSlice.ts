import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../../lib/tokenService";
import type { Post } from "../type";

axios.defaults.withCredentials = true;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createPost = createAsyncThunk<
  Post,
  {
    title: string;
    description: string;
    content: string;
    tags?: string[];
    category?: string;
    keywords?: string[];
    status?: string;
    coverImage?: File; 
  },
  { rejectValue: string }
>("post/createPost", async (formData, { rejectWithValue }) => {
  try {
    const token = getToken();

    if (!token) {
      return rejectWithValue("Authentication token not found");
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("content", formData.content);

    // Arrays ko properly handle karo
    if (formData.tags && formData.tags.length > 0) {
      formData.tags.forEach((tag) => data.append("tags", tag));
    }

    if (formData.category) {
      data.append("category", formData.category);
    }

    if (formData.keywords && formData.keywords.length > 0) {
      formData.keywords.forEach((keyword) => data.append("keywords", keyword));
    }

    if (formData.status) {
      data.append("status", formData.status);
    }

    // Cover image optional hai
    if (formData.coverImage) {
      data.append("coverImage", formData.coverImage);
    }

    const res = await axios.post(`${API_URL}/api/posts/create-post`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.post as Post;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Something went wrong";
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue("Network error occurred");
  }
});

interface PostState {
  createloading: boolean;
  createError: string | null;
  success: boolean;
  createdPost: Post | null;
}

const initialState: PostState = {
  createloading: false,
  createError: null,
  success: false,
  createdPost: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    resetPostState(state) {
      state.createloading = false;
      state.createError = null;
      state.success = false;
      state.createdPost = null;
    },
    // Additional helpful reducer
    clearError(state) {
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.createloading = true;
        state.createError = null;
        state.success = false;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createloading = false;
        state.success = true;
        state.createdPost = action.payload;
        state.createError = null; // Clear any previous errors
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createloading = false;
        state.createError = action.payload || "Something went wrong";
        state.success = false;
        state.createdPost = null; // Clear created post on error
      });
  },
});

export const { resetPostState, clearError } = postSlice.actions;
export default postSlice.reducer;
