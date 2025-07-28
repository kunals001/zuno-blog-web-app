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
    altText: string;
    tags?: string[];
    category?: string;
    keywords?: string[];
    status?: string;
    coverImage?: File | null; 
  },
  { rejectValue: string }
>("post/createPost", async (formData, { rejectWithValue }) => {
  try {
    const token = getToken();

    if (!token) {
      return rejectWithValue("Authentication token not found");
    }

    const data = new FormData();
    
    // Always append data - let backend validate
    data.append("title", formData.title || "");
    data.append("description", formData.description || "");
    data.append("content", formData.content || "");
    data.append("altText", formData.altText || "");

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

    console.log("Making API request to backend...");

    const res = await axios.post(`${API_URL}/api/posts/create-post`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Backend response:", res.data);
    return res.data.post as Post;
    
  } catch (err) {
    console.log("Backend error caught:", err);
    
    if (axios.isAxiosError(err)) {
      // Backend se specific error message
      const errorMessage = 
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Something went wrong";
      
      console.log("Error message to show:", errorMessage);
      return rejectWithValue(errorMessage);
    }
    
    return rejectWithValue("Network error occurred");
  }
});

export const getPostBySlug = createAsyncThunk(
  "post/getPostBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/posts/get-post-by-slug/${slug}`);
      return res.data.post;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || "Verification failed"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
)

interface PostState {
  getSlugPost : Post | null;

  getSlugLoading: boolean;
  createloading: boolean;

  getSlugError: string | null;
  createError: string | null;
  success: boolean;
  createdPost: Post | null;
}

const initialState: PostState = {
  getSlugPost: null,

  getSlugLoading: false,
  createloading: false,

  getSlugError: null,
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
    clearCreateError(state) {
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.createloading = true;
        state.createError = null;
        state.success = false;
        console.log("Post creation started...");
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createloading = false;
        state.success = true;
        state.createdPost = action.payload;
        state.createError = null;
        console.log("Post created successfully");
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createloading = false;
        state.createError = action.payload || "Something went wrong";
        state.success = false;
        state.createdPost = null;
        console.log("Post creation failed:", action.payload);
      })

      /// ---------------------- GET POST BY SLUG --------------------------- ///
      .addCase(getPostBySlug.pending, (state) => {
        state.getSlugLoading = true;
        state.getSlugError = null;
      })
      .addCase(getPostBySlug.fulfilled, (state, action) => {
        state.getSlugLoading = false;
        state.getSlugError = null;
        state.getSlugPost = action.payload;
      })
      .addCase(getPostBySlug.rejected, (state, action) => {
        state.getSlugPost = null;
        state.getSlugLoading = false;
        state.getSlugError = action.payload as string;
      })
  },
});

export const { resetPostState, clearCreateError } = postSlice.actions;
export default postSlice.reducer;