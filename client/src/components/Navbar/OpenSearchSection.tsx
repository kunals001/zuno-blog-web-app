// components/OpenSearchSection.tsx
import React, { useState, useEffect, useRef } from "react";
import { IconArrowNarrowLeft, IconSearch, IconUser, IconArticle, IconHistory, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useSearchSuggestions, useSearchHistory, useSearchMutations } from "@/api/hooks/useSearch";
import { SearchType, SearchSuggestion } from "@/redux/type";
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
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // React Query hooks
  const { data: suggestions, isLoading: suggestionsLoading } = useSearchSuggestions(query, selectedType);
  const { data: searchHistory, isLoading: historyLoading } = useSearchHistory();
  const { clearHistoryItem, clearAllHistory } = useSearchMutations();

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

    setOpenSearch(false);
    
    // Navigate to search results page
    const searchParams = new URLSearchParams({
      q: finalQuery,
      type: selectedType,
    });
    
    router.push(`/search?${searchParams.toString()}`);
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
      setShowSuggestions(true);
      setShowHistory(false);
    } else if (value.length === 0) {
      setShowSuggestions(false);
      setShowHistory(true);
    } else {
      setShowSuggestions(false);
      setShowHistory(false);
    }
  };

  // Handle input focus
  const handleInputFocus = (): void => {
    if (query.length >= 2) {
      setShowSuggestions(true);
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

  // Handle clear history item
  const handleClearHistoryItem = (historyId: string): void => {
    clearHistoryItem.mutate(historyId);
  };

  // Handle clear all history
  const handleClearAllHistory = (): void => {
    clearAllHistory.mutate();
  };

  if (!openSearch) return null;

  return (
    <div className="w-full h-screen flex justify-center backdrop-blur-md transition ease-in-out duration-300 absolute top-0 left-0 z-[100] md:py-[2vw] overflow-hidden">
      <div className="md:w-[40vw] w-full h-screen md:p-[1vw] p-[1vh] bg-[#f5f5f5d5] dark:bg-zinc-700 md:rounded-xl md:min-h-[20vw] md:max-h-[90vh] popup-animate">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <IconArrowNarrowLeft
            stroke={1}
            onClick={() => setOpenSearch(false)}
            className="md:size-[2.6vw] size-[5vh] w-[6vh] md:w-[3vw] text-zinc-700 dark:text-zinc-200 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-600 transition ease-in-out duration-200 rounded-full md:bg-[#f5f5f5d5] md:dark:bg-zinc-700 bg-zinc-200 dark:bg-zinc-600"
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

            <IconSearch 
              className="absolute top-[50%] right-[2vh] translate-y-[-50%] text-zinc-700 dark:text-zinc-200 cursor-pointer"
              onClick={() => handleSearch()}
            />
          </div>
        </div>

        {/* Search Type Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedType('post')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedType === 'post'
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-500'
            }`}
          >
            <IconArticle size={16} />
            Stories
          </button>
          
          <button
            onClick={() => setSelectedType('user')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedType === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-500'
            }`}
          >
            <IconUser size={16} />
            Users
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Search Suggestions */}
          {showSuggestions && suggestions && suggestions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                Suggestions
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
                      className="rounded-full object-cover"
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
                  <div className="text-xs px-2 py-1 rounded-full bg-zinc-300 dark:bg-zinc-500 text-zinc-700 dark:text-zinc-300">
                    {suggestion.type}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search History */}
          {showHistory && searchHistory && searchHistory.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <IconHistory size={16} />
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
                    <IconSearch size={16} className="text-zinc-500" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {history.query}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-zinc-300 dark:bg-zinc-500 text-zinc-600 dark:text-zinc-400">
                      {history.type}
                    </span>
                  </div>
                  <button
                    onClick={() => handleClearHistoryItem(history._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={clearHistoryItem.isPending}
                  >
                    <IconX size={14} className="text-zinc-500 hover:text-zinc-700" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Loading States */}
          {(suggestionsLoading || historyLoading) && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Empty States */}
          {showSuggestions && suggestions && suggestions.length === 0 && !suggestionsLoading && (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No suggestions found
            </div>
          )}

          {showHistory && (!searchHistory || searchHistory.length === 0) && !historyLoading && (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No search history
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenSearchSection;