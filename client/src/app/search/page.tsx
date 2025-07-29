'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePostsSearch } from '@/api/hooks/useSearch';
import Image from 'next/image';
import Link from 'next/link';
import { 
  IconSearch, 
  IconHeart, 
  IconMessageCircle, 
  IconEye, 
  IconClock,
  IconFilter,
  IconSortDescending
} from '@tabler/icons-react';

const SearchResultsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error, isFetching } = usePostsSearch(query, currentPage, sortBy);

  // Reset page when query or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, sortBy]);

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setShowFilters(false);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <IconSearch className="mx-auto text-gray-400 mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No search query provided
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please enter a search term to find stories
          </p>
          <Link 
            href="/" 
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <IconSearch className="text-blue-500" size={28} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Search Results
            </h1>
          </div>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Stories for <span className="font-semibold text-blue-600">"{query}"</span>
              </p>
              {data && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {data.data.pagination.totalPosts || 0} stories found
                </p>
              )}
            </div>
            
            {/* Sort Controls */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <IconSortDescending size={16} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort: {sortBy === 'relevance' ? 'Relevance' : sortBy === 'latest' ? 'Latest' : sortBy === 'popular' ? 'Popular' : 'Most Liked'}
                </span>
              </button>
              
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[150px]">
                  {[
                    { value: 'relevance', label: 'Relevance' },
                    { value: 'latest', label: 'Latest' },
                    { value: 'popular', label: 'Popular' },
                    { value: 'liked', label: 'Most Liked' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        sortBy === option.value 
                          ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Searching stories...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                Search Failed
              </p>
              <p className="text-red-500 dark:text-red-300 text-sm">
                Something went wrong while searching. Please try again.
              </p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && !error && data && (
          <>
            {data.data.results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {data.data.results.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
                    >
                      {/* Cover Image */}
                      {post.coverImage && (
                        <div className="relative h-48 overflow-hidden">
                          <Link href={`/post/${post.slug}`}>
                            <Image
                              src={post.coverImage}
                              alt={post.altText || post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                          {post.isFeatured && (
                            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Featured
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="p-6">
                        {/* Category & Read Time */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <IconClock size={12} />
                            {post.readTime} min read
                          </div>
                        </div>
                        
                        {/* Title */}
                        <Link href={`/post/${post.slug}`}>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>
                        
                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                          {post.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <IconHeart size={14} />
                              {post.likes.length}
                            </span>
                            <span className="flex items-center gap-1">
                              <IconMessageCircle size={14} />
                              {post.comments.length}
                            </span>
                            <span className="flex items-center gap-1">
                              <IconEye size={14} />
                              {post.views}
                            </span>
                          </div>
                          
                          <span className="text-xs text-gray-400">
                            {new Date(post.createdAt || '').toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {data.data.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!data.data.pagination.hasPrev || isFetching}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, data.data.pagination.totalPages) }, (_, i) => {
                        const page = i + Math.max(1, currentPage - 2);
                        if (page > data.data.pagination.totalPages) return null;
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            disabled={isFetching}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              page === currentPage
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!data.data.pagination.hasNext || isFetching}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* No Results */
              <div className="text-center py-16">
                <div className="text-6xl mb-6">📝</div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  No stories found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn't find any stories matching "{query}". Try searching with different keywords or check your spelling.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Go Back
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Browse All Stories
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {/* Loading indicator during pagination */}
        {isFetching && !isLoading && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;