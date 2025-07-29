// controllers/search.controller.js - Fixed version
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import SearchHistory from "../models/searchHistory.model.js";

// Search Users by username or name
export const SearchUser = async (req, res) => {
  try {
    const { query, limit = 10, page = 1 } = req.query;
    const userId = req.user?.id; // Authenticated user ID (from middleware)

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const searchQuery = query.trim();
    const skip = (page - 1) * limit;

    // Create regex for case-insensitive search
    const searchRegex = new RegExp(searchQuery, 'i');

    // Search users by username or name
    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: searchRegex } },
            { name: { $regex: searchRegex } }
          ]
        },
        { isBlocked: false }, // Don't show blocked users
        // { isVerified: true }   // Remove this if you want to show all users
      ]
    })
    .select('username name bio profilePic followers following isVerified')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ followers: -1 }); // Sort by follower count

    // Get total count for pagination
    const totalUsers = await User.countDocuments({
      $and: [
        {
          $or: [
            { username: { $regex: searchRegex } },
            { name: { $regex: searchRegex } }
          ]
        },
        { isBlocked: false },
        // { isVerified: true }
      ]
    });

    // Save search history if user is authenticated
    if (userId) {
      await saveSearchHistory(userId, searchQuery, 'user');
    }

    // Add follower count to each user
    const usersWithStats = users.map(user => ({
      ...user.toObject(),
      followerCount: user.followers.length,
      followingCount: user.following.length
    }));

    // *** MAIN FIX: Match the expected frontend structure ***
    res.status(200).json({
      success: true,
      data: {
        results: usersWithStats, // Changed from 'users' to 'results'
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: skip + users.length < totalUsers,
          hasPrev: page > 1
        }
      },
      message: `Found ${users.length} users`
    });

  } catch (error) {
    console.error("Search User Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while searching users"
    });
  }
};

// Search Posts by title, tags, or content
export const SearchPost = async (req, res) => {
  try {
    const { query, limit = 10, page = 1, category, sortBy = 'relevance' } = req.query;
    const userId = req.user?.id;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const searchQuery = query.trim();
    const skip = (page - 1) * limit;

    // Create regex for case-insensitive search
    const searchRegex = new RegExp(searchQuery, 'i');

    // Build search conditions
    let searchConditions = {
      $and: [
        {
          $or: [
            { title: { $regex: searchRegex } },
            { tags: { $in: [searchRegex] } },
            { description: { $regex: searchRegex } },
            { keywords: { $in: [searchRegex] } }
          ]
        },
        { isDraft: false },
        { status: "Published" }
      ]
    };

    // Add category filter if provided
    if (category && category !== 'all') {
      searchConditions.$and.push({ category: category });
    }

    // Determine sort criteria
    let sortCriteria = {};
    switch (sortBy) {
      case 'latest':
        sortCriteria = { createdAt: -1 };
        break;
      case 'popular':
        sortCriteria = { views: -1, likes: -1 };
        break;
      case 'liked':
        sortCriteria = { likes: -1 };
        break;
      default: // relevance
        sortCriteria = { views: -1, createdAt: -1 };
    }

    // Search posts
    const posts = await Post.find(searchConditions)
      .populate('author', 'username name profilePic')
      .select('title description slug coverImage tags category likes comments views readTime createdAt isFeatured altText')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortCriteria);

    // Get total count for pagination
    const totalPosts = await Post.countDocuments(searchConditions);

    // Save search history if user is authenticated
    if (userId) {
      await saveSearchHistory(userId, searchQuery, 'post');
    }

    // Add stats to each post
    const postsWithStats = posts.map(post => ({
      ...post.toObject(),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      isLikedByUser: userId ? post.likes.includes(userId) : false
    }));

    // *** MAIN FIX: Match the expected frontend structure ***
    res.status(200).json({
      success: true,
      data: {
        results: postsWithStats, // Changed from 'posts' to 'results'
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
          hasNext: skip + posts.length < totalPosts,
          hasPrev: page > 1
        },
        filters: {
          category: category || 'all',
          sortBy
        }
      },
      message: `Found ${posts.length} posts`
    });

  } catch (error) {
    console.error("Search Post Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while searching posts"
    });
  }
};

// Get user's search history
export const getSearchHistory = async (req, res) => {
  try {
    const userId = req.user?.id || req.user; // Handle both cases
    const { limit = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const searchHistory = await SearchHistory.find({ userId })
      .sort({ searchedAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: searchHistory,
      message: "Search history retrieved successfully"
    });

  } catch (error) {
    console.error("Get Search History Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving search history"
    });
  }
};

// Clear specific search history item
export const clearSearchHistoryItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.user; // Handle both cases
    const { historyId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const deleted = await SearchHistory.findOneAndDelete({
      _id: historyId,
      userId: userId
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Search history item not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Search history item deleted successfully"
    });

  } catch (error) {
    console.error("Clear Search History Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting search history item"
    });
  }
};

// Clear all search history
export const clearAllSearchHistory = async (req, res) => {
  try {
    const userId = req.user?.id || req.user; // Handle both cases

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    await SearchHistory.deleteMany({ userId: userId });

    res.status(200).json({
      success: true,
      message: "All search history cleared successfully"
    });

  } catch (error) {
    console.error("Clear All Search History Error:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing search history"
    });
  }
};

// Get search suggestions
export const getSearchSuggestions = async (req, res) => {
  try {
    const { query, type = 'post' } = req.query; // Changed default to 'post'

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Query should be at least 2 characters long"
      });
    }

    const searchRegex = new RegExp(query.trim(), 'i');
    const suggestions = [];

    // Get user suggestions
    if (type === 'user' || type === 'both') {
      const userSuggestions = await User.find({
        $or: [
          { username: { $regex: searchRegex } },
          { name: { $regex: searchRegex } }
        ],
        isBlocked: false,
        // isVerified: true // Comment out if you want all users
      })
      .select('username name profilePic isVerified')
      .limit(5)
      .sort({ followers: -1 });

      suggestions.push(...userSuggestions.map(user => ({
        type: 'user',
        id: user._id,
        text: user.username,
        subtitle: user.name,
        image: user.profilePic
      })));
    }

    // Get post suggestions
    if (type === 'post' || type === 'both') {
      const postSuggestions = await Post.find({
        $or: [
          { title: { $regex: searchRegex } },
          { tags: { $in: [searchRegex] } }
        ],
        isDraft: false,
        status: "Published"
      })
      .populate('author', 'username')
      .select('title slug coverImage author')
      .limit(5)
      .sort({ views: -1 });

      suggestions.push(...postSuggestions.map(post => ({
        type: 'post',
        id: post._id,
        text: post.title,
        subtitle: `by ${post.author.username}`,
        image: post.coverImage,
        slug: post.slug
      })));
    }

    res.status(200).json({
      success: true,
      data: suggestions,
      message: "Suggestions retrieved successfully"
    });

  } catch (error) {
    console.error("Get Search Suggestions Error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting search suggestions"
    });
  }
};

// Helper function to save search history
const saveSearchHistory = async (userId, query, type) => {
  try {
    // Check if this exact search already exists recently (within last hour)
    const recentSearch = await SearchHistory.findOne({
      userId,
      query: query.toLowerCase(),
      type,
      searchedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
    });

    if (!recentSearch) {
      // Create new search history entry
      await SearchHistory.create({
        userId,
        query: query.toLowerCase(),
        type,
        searchedAt: new Date()
      });

      // Keep only last 50 searches per user
      const userSearchCount = await SearchHistory.countDocuments({ userId });
      if (userSearchCount > 50) {
        const oldestSearches = await SearchHistory.find({ userId })
          .sort({ searchedAt: 1 })
          .limit(userSearchCount - 50);
        
        const idsToDelete = oldestSearches.map(search => search._id);
        await SearchHistory.deleteMany({ _id: { $in: idsToDelete } });
      }
    }
  } catch (error) {
    console.error("Save Search History Error:", error);
  }
};


// ============================================================
// Optional: Add middleware for better error handling
// ============================================================

// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field error'
    });
  }
  
  // Default error
  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
};

// ============================================================
// Debug middleware to log requests
// ============================================================

export const debugLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${req.method} ${req.originalUrl}`, {
      query: req.query,
      body: req.body,
      user: req.user ? 'authenticated' : 'not authenticated'
    });
  }
  next();
};