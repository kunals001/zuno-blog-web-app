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

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/searchs/search/suggestions`, {
        params: { query, type },
      });
      return data.data || [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  },

  // Search users
  searchUsers: async (params: SearchParams): Promise<SearchResponse<User>> => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/searchs/search/user`, {
        params: {
          query: params.query,
          limit: params.limit || 10,
          page: params.page || 1,
        },
      });
      return data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Search posts
  searchPosts: async (params: SearchParams): Promise<SearchResponse<Post>> => {
    try {
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
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  },

  // Get search history
  getSearchHistory: async (): Promise<SearchHistory[]> => {
    try {
      const token = getToken();
      if (!token) {
        console.warn('No token found for search history');
        return [];
      }

      const { data } = await axios.get(`${API_BASE_URL}/api/searchs/search/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Changed from multipart/form-data
        },
      });
      return data.data || [];
    } catch (error) {
      console.error('Error fetching search history:', error);
      return [];
    }
  },

  // Clear search history item
  clearHistoryItem: async (historyId: string): Promise<void> => {
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token');

      await axios.delete(`${API_BASE_URL}/api/searchs/search/history/${historyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Changed from multipart/form-data
        },
      });
    } catch (error) {
      console.error('Error clearing history item:', error);
      throw error;
    }
  },

  // Clear all search history
  clearAllHistory: async (): Promise<void> => {
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token');

      await axios.delete(`${API_BASE_URL}/api/searchs/search/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Changed from multipart/form-data
        },
      });
    } catch (error) {
      console.error('Error clearing all history:', error);
      throw error;
    }
  },
};
