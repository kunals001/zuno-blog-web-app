// hooks/useSearch.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { searchAPI } from '../search';
import type {
  SearchParams,
  SearchType,
} from "@/redux/type";

// Search suggestions hook
export const useSearchSuggestions = (query: string, type: SearchType) => {
  const [debouncedQuery] = useDebounce(query, 300);

  return useQuery({
    queryKey: ['searchSuggestions', debouncedQuery, type],
    queryFn: () => searchAPI.getSuggestions(debouncedQuery, type),
    enabled: debouncedQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Search users hook
export const useSearchUsers = (params: SearchParams) => {
  return useQuery({
    queryKey: ['searchUsers', params],
    queryFn: () => searchAPI.searchUsers(params),
    enabled: params.query.length > 0,
  });
};

// Search posts hook
export const useSearchPosts = (params: SearchParams) => {
  return useQuery({
    queryKey: ['searchPosts', params],
    queryFn: () => searchAPI.searchPosts(params),
    enabled: params.query.length > 0,
  });
};

// Search history hook
export const useSearchHistory = () => {
  return useQuery({
    queryKey: ['searchHistory'],
    queryFn: searchAPI.getSearchHistory,
    staleTime: 5 * 60 * 1000,
  });
};

// Clear history mutations
export const useSearchMutations = () => {
  const queryClient = useQueryClient();

  const clearHistoryItem = useMutation({
    mutationFn: searchAPI.clearHistoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
  });

  const clearAllHistory = useMutation({
    mutationFn: searchAPI.clearAllHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
  });

  return {
    clearHistoryItem,
    clearAllHistory,
  };
};

// Combined search hook for both users and posts
export const useCombinedSearch = (query: string, type: SearchType, page: number = 1) => {
  const searchParams: SearchParams = {
    query,
    type,
    page,
    limit: 10
  };

  const usersQuery = useSearchUsers({
    ...searchParams,
    type: 'user'
  });

  const postsQuery = useSearchPosts({
    ...searchParams,
    type: 'post'
  });

  return {
    users: usersQuery,
    posts: postsQuery,
    isLoading: type === 'user' ? usersQuery.isLoading : postsQuery.isLoading,
    error: type === 'user' ? usersQuery.error : postsQuery.error,
    data: type === 'user' ? usersQuery.data : postsQuery.data
  };
};