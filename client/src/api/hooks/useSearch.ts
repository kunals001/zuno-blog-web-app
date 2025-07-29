import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { searchAPI } from '../search';
import type {
  SearchParams,
  SearchType,
  SearchSuggestion,
  User,
  Post,
  SearchHistory,
  SearchResponse
} from "@/redux/type";

// Search suggestions hook
export const useSearchSuggestions = (query: string, type: SearchType) => {
  const [debouncedQuery] = useDebounce(query, 300);

  return useQuery<SearchSuggestion[]>({
    queryKey: ['searchSuggestions', debouncedQuery, type],
    queryFn: () => searchAPI.getSuggestions(debouncedQuery, type),
    enabled: debouncedQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

// Search users hook
export const useSearchUsers = (params: SearchParams) => {
  return useQuery<SearchResponse<User>>({
    queryKey: ['searchUsers', params],
    queryFn: () => searchAPI.searchUsers(params),
    enabled: params.query.length > 0,
    placeholderData: keepPreviousData,
    retry: 2,
    retryDelay: 1000,
  });
};

// Search posts hook
export const useSearchPosts = (params: SearchParams) => {
  return useQuery<SearchResponse<Post>>({
    queryKey: ['searchPosts', params],
    queryFn: () => searchAPI.searchPosts(params),
    enabled: params.query.length > 0,
    placeholderData: keepPreviousData,
    retry: 2,
    retryDelay: 1000,
  });
};

// Search history hook
export const useSearchHistory = () => {
  return useQuery<SearchHistory[]>({
    queryKey: ['searchHistory'],
    queryFn: searchAPI.getSearchHistory,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};

// Clear history mutations
export const useSearchMutations = () => {
  const queryClient = useQueryClient();

  const clearHistoryItem = useMutation<void, Error, string>({
    mutationFn: searchAPI.clearHistoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
    onError: (error) => {
      console.error('Failed to clear history item:', error);
    },
  });

  const clearAllHistory = useMutation<void, Error, void>({
    mutationFn: searchAPI.clearAllHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
    onError: (error) => {
      console.error('Failed to clear all history:', error);
    },
  });

  return {
    clearHistoryItem,
    clearAllHistory,
  };
};

// Only posts search hook for search page
export const usePostsSearch = (query: string, page: number = 1, sortBy: string = 'relevance') => {
  const searchParams: SearchParams = {
    query,
    type: 'post',
    page,
    limit: 12, // More posts for grid layout
    sortBy: sortBy as 'relevance' | 'latest' | 'popular' | 'liked'
  };

  return useQuery<SearchResponse<Post>>({
    queryKey: ['searchPosts', query, page, sortBy],
    queryFn: () => searchAPI.searchPosts(searchParams),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
};

// Get users with search query (for user search in popup)
export const useUsersSearch = (query: string, page: number = 1) => {
  const [debouncedQuery] = useDebounce(query, 300); // Added debounce

  const searchParams: SearchParams = {
    query: debouncedQuery,
    type: 'user',
    page,
    limit: 10
  };

  return useQuery<SearchResponse<User>>({
    queryKey: ['searchUsers', debouncedQuery, page],
    queryFn: () => searchAPI.searchUsers(searchParams),
    enabled: debouncedQuery.length >= 2, // Changed from > 0 to >= 2
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
};