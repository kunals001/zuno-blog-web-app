import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Search, User2, History, X, Newspaper } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchSuggestions, useSearchHistory, useSearchMutations, useUsersSearch } from "@/api/hooks/useSearch";
import { SearchType, SearchSuggestion, User } from "@/redux/type";
import Image from "next/image";

interface OpenSearchSectionProps {
  openSearch: boolean;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const OpenSearchSection: React.FC<OpenSearchSectionProps> = ({
  openSearch,
  setOpenSearch,
}) => {
  const [query, setQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<SearchType>("post");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showUserResults, setShowUserResults] = useState<boolean>(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // React Query hooks
  const { data: suggestions, isLoading: suggestionsLoading, error: suggestionsError } = useSearchSuggestions(query, selectedType);
  const { data: searchHistory, isLoading: historyLoading, error: historyError } = useSearchHistory();
  const { data: userResults, isLoading: userResultsLoading, error: userResultsError } = useUsersSearch(query);
  const { clearHistoryItem, clearAllHistory } = useSearchMutations();

  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Search Debug:', {
        query,
        selectedType,
        showSuggestions,
        showUserResults,
        showHistory,
        suggestions,
        userResults,
        searchHistory,
        suggestionsError,
        userResultsError,
        historyError
      });
    }
  }, [query, selectedType, suggestions, userResults, searchHistory, suggestionsError, userResultsError, historyError]);

  // Focus input when search opens
  useEffect(() => {
    if (openSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openSearch]);

  // Handle search submission
  const handleSearch = (searchQuery?: string): void => {
    const finalQuery = searchQuery || query.trim();
    if (!finalQuery) return;

    // Only navigate to search page for posts
    if (selectedType === 'post') {
      setOpenSearch(false);
      
      const searchParams = new URLSearchParams({
        q: finalQuery,
        type: selectedType,
      });
      
      router.push(`/search?${searchParams.toString()}`);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion): void => {
    if (suggestion.type === 'user') {
      router.push(`/user/${suggestion.text}`);
    } else {
      router.push(`/post/${suggestion.slug}`);
    }
    setOpenSearch(false);
  };

  // Handle user click
  const handleUserClick = (user: User): void => {
    router.push(`/user/${user.username}`);
    setOpenSearch(false);
  };

  // Handle history click
  const handleHistoryClick = (historyQuery: string): void => {
    setQuery(historyQuery);
    handleSearch(historyQuery);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 2) {
      if (selectedType === 'user') {
        setShowUserResults(true);
        setShowSuggestions(false);
        setShowHistory(false);
      } else {
        setShowSuggestions(true);
        setShowUserResults(false);
        setShowHistory(false);
      }
    } else if (value.length === 0) {
      setShowSuggestions(false);
      setShowUserResults(false);
      setShowHistory(true);
    } else {
      setShowSuggestions(false);
      setShowUserResults(false);
      setShowHistory(false);
    }
  };

  // Handle input focus
  const handleInputFocus = (): void => {
    if (query.length >= 2) {
      if (selectedType === 'user') {
        setShowUserResults(true);
      } else {
        setShowSuggestions(true);
      }
    } else {
      setShowHistory(true);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle type change
  const handleTypeChange = (type: SearchType): void => {
    setSelectedType(type);
    if (query.length >= 2) {
      if (type === 'user') {
        setShowUserResults(true);
        setShowSuggestions(false);
      } else {
        setShowSuggestions(true);
        setShowUserResults(false);
      }
    }
  };

  // Handle clear history item
  const handleClearHistoryItem = (historyId: string): void => {
    clearHistoryItem.mutate(historyId);
  };

  // Handle clear all history
  const handleClearAllHistory = (): void => {
    clearAllHistory.mutate();
  };

  // Safe access to user results with proper null checking
  const userResultsData = userResults?.data?.results || [];
  const totalUsers = userResults?.data?.pagination?.totalUsers || 0;
  const totalPages = userResults?.data?.pagination?.totalPages || 1;

  if (!openSearch) return null;

  return (
    <div className="w-full h-screen flex justify-center backdrop-blur-md transition ease-in-out duration-300 absolute top-0 left-0 z-[100] md:py-[2vw] overflow-hidden">
      <div className="md:w-[40vw] w-full h-screen md:p-[1vw] p-[1vh] bg-[#f5f5f5d5] dark:bg-zinc-700 md:rounded-xl md:min-h-[20vw] md:max-h-[90vh] popup-animate">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <ArrowLeft
            
            onClick={() => setOpenSearch(false)}
            className="md:size-[2vw] size-[4vh] w-[6vh] md:w-[3vw] text-zinc-700 dark:text-zinc-200 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-600 transition ease-in-out duration-200 rounded-full md:bg-[#f5f5f5d5] md:dark:bg-zinc-700 bg-zinc-200 dark:bg-zinc-600 stroke-1"
          />

          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyPress={handleKeyPress}
              placeholder={selectedType === 'post' ? "Search for articles..." : "Search for users..."}
              className="w-full placeholder:text-zinc-700 dark:placeholder:text-zinc-200 outline-none md:pl-[1vw] md:pr-[4vw] md:py-[.3vw] pl-[1.5vh] pr-[6vh] py-[.5vh] rounded-full border-2 border-zinc-400 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 bg-transparent text-[1.7vh] md:text-[1vw]"
            />

            <Search 
              className="absolute top-[50%] right-[2vh] translate-y-[-50%] text-zinc-700 dark:text-zinc-200 cursor-pointer"
              onClick={() => handleSearch()}
            />
          </div>
        </div>

        {/* Search Type Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleTypeChange('post')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedType === 'post'
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-500'
            }`}
          >
            <Newspaper size={16} />
            Stories
          </button>
          
          <button
            onClick={() => handleTypeChange('user')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedType === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-500'
            }`}
          >
            <User2 size={16} />
            Users
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {/* Error States */}
          {(suggestionsError || userResultsError || historyError) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-600 dark:text-red-400">
                Error loading search results. Please try again.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-2">
                  <summary className="text-xs text-red-500 cursor-pointer">Debug Info</summary>
                  <pre className="text-xs mt-1 text-red-500">
                    {JSON.stringify({ suggestionsError, userResultsError, historyError }, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Post Suggestions */}
          {showSuggestions && suggestions && suggestions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                Story Suggestions
              </h3>
              {suggestions.map((suggestion: SearchSuggestion) => (
                <div
                  key={`${suggestion.type}-${suggestion.id}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 cursor-pointer transition-colors"
                >
                  {suggestion.image && (
                    <Image
                      src={suggestion.image}
                      alt={suggestion.text}
                      width={32}
                      height={32}
                      className="rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {suggestion.text}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {suggestion.subtitle}
                    </p>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    Story
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* User Results */}
          {showUserResults && userResults && userResultsData.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                Users ({totalUsers})
              </h3>
              <div className="space-y-3">
                {userResultsData.map((user: User) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserClick(user)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 cursor-pointer transition-colors"
                  >
                    <Image
                      src={user.profilePic || '/default-avatar.png'}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {user.name}
                        </p>
                        {user.isVerified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        @{user.username}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {user.followers?.length || 0} followers
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show More Users Button */}
              {totalPages > 1 && (
                <div className="text-center pt-3">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Showing {userResultsData.length} of {totalUsers} users
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Search History */}
          {showHistory && searchHistory && searchHistory.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <History size={16} />
                  Recent Searches
                </h3>
                <button
                  onClick={handleClearAllHistory}
                  className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  disabled={clearAllHistory.isPending}
                >
                  {clearAllHistory.isPending ? 'Clearing...' : 'Clear All'}
                </button>
              </div>
              {searchHistory.slice(0, 5).map((history) => (
                <div
                  key={history._id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 cursor-pointer transition-colors group"
                >
                  <div
                    onClick={() => handleHistoryClick(history.query)}
                    className="flex items-center gap-3 flex-1"
                  >
                    <Search size={16} className="text-zinc-500" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {history.query}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      history.type === 'post' 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    }`}>
                      {history.type === 'post' ? 'Story' : 'User'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleClearHistoryItem(history._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={clearHistoryItem.isPending}
                  >
                    <X size={14} className="text-zinc-500 hover:text-zinc-700" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Loading States */}
          {(suggestionsLoading || historyLoading || userResultsLoading) && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {userResultsLoading ? 'Searching users...' : 'Loading...'}
                </span>
              </div>
            </div>
          )}

          {/* Empty States */}
          {showSuggestions && suggestions && suggestions.length === 0 && !suggestionsLoading && (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              <Search className="mx-auto mb-2" size={24} />
              <p className="text-sm">No story suggestions found</p>
            </div>
          )}

          {showUserResults && userResults && userResultsData.length === 0 && !userResultsLoading && (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              <User2 className="mx-auto mb-2" size={24} />
              <p className="text-sm">No users found</p>
              <p className="text-xs mt-1">Try searching with different keywords</p>
            </div>
          )}

          {showHistory && (!searchHistory || searchHistory.length === 0) && !historyLoading && (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              <History className="mx-auto mb-2" size={24} />
              <p className="text-sm">No search history</p>
              <p className="text-xs mt-1">Your recent searches will appear here</p>
            </div>
          )}
        </div>

        {/* Footer Instructions */}
        <div className="mt-4 pt-3 border-t border-zinc-300 dark:border-zinc-600">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
            {selectedType === 'post' 
              ? 'Press Enter to search stories or click suggestions'
              : 'Find users by name or username'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default OpenSearchSection;