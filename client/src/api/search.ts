import axios from "axios";
import type {
  User,
  Post,
  SearchHistory,
  SearchParams,
  SearchResponse,
  SearchSuggestion,
  SearchType,
} from "@/redux/type";
import { getToken } from "../lib/tokenService";

axios.defaults.withCredentials = true;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const searchAPI = {
  getSuggestions: async (
    query: string,
    type: SearchType = "post"
  ): Promise<SearchSuggestion[]> => {
    if (query.length < 2) return [];

    const { data } = await axios.get(`${API_BASE_URL}/api/searchs/search/suggestions`, {
      params: { query, type },
    });
    return data.data;
  },

  // Search users
  searchUsers: async (params: SearchParams): Promise<SearchResponse<User>> => {
    const { data } = await axios.get(`${API_BASE_URL}/api/searchs/search/user`, {
      params: {
        query: params.query,
        limit: params.limit || 10,
        page: params.page || 1,
      },
    });
    return data;
  },

  // Search posts
  searchPosts: async (params: SearchParams): Promise<SearchResponse<Post>> => {
    const { data } = await axios.get(`${API_BASE_URL}/api/searchs/search/post`, {
      params: {
        query: params.query,
        limit: params.limit || 10,
        page: params.page || 1,
        category: params.category,
        sortBy: params.sortBy || "relevance",
      },
    });
    return data;
  },

  // Get search history
  getSearchHistory: async (): Promise<SearchHistory[]> => {
    const token = getToken();

    const { data } = await axios.get(`${API_BASE_URL}/api/searchs/search/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return data.data;
  },

  // Clear search history item
  clearHistoryItem: async (historyId: string): Promise<void> => {
    const token = getToken();
    await axios.delete(`${API_BASE_URL}/api/searchs/search/history/${historyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Clear all search history
  clearAllHistory: async (): Promise<void> => {
    const token = getToken();
    await axios.delete(`${API_BASE_URL}/api/searchs/search/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
