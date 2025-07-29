
/// ---------------------- User ---------------------- ///

export interface PostView {
  post: string; 
  viewedAt: string; 
};

export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  isAuthor: boolean;
  verifytoken?: string;
  verifytokenexpire?: string;
  resetpasswordtoken?: string;
  resetpasswordtokenexpire?: string;
  isVerified: boolean;
  profilePic?: string;
  bio?: string;
  socialLinks: string[];
  followers: string[]; // Changed from string[] to PopulatedUser[]
  following: string[]; // Changed from string[] to string[]
  followRequests:  string[]; // Changed from string[] to PopulatedUser[]
  saveposts: string[];
  readPosts: string[];
  postViews: PostView[];
  myposts: Post[]; // Changed from string[] to Post[] if populated
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Extended type for profile page with backend additions
export interface UserWithRelationship extends User {
  isOnline?: boolean;
  relationship?: {
    isFollowing: boolean;
    isFollower: boolean;
    hasPendingRequest: boolean;
  };
};

/// ------------------------ Post ------------------------ ///

export interface Post {
  _id: string;
  author: string; 
  title: string;
  altText: string;
  description: string;
  keywords: string[];
  slug: string;
  content: string;
  coverImage?: string | null;
  tags: string[];
  status: string;
  category: string;
  likes: string[];     
  comments: string[];  
  isDraft: boolean;
  readTime: number;
  views: number;
  totalReadTime: number;
  averageReadTime: number;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
};


/// ------------------------ Comment ------------------------ ///

export interface Comment {
  _id: string;
  post: string;             
  author: string;           
  content: string;
  likes: string[];          
  parentComment?: string | null; 
  replies: string[];        
  isEdited: boolean;
  createdAt?: string;
  updatedAt?: string;
};



/// ----------------------- SEARCH ----------------------- ///


export interface SearchHistory {
  _id: string;
  query: string;
  type: 'user' | 'post';
  searchedAt: string;
}

export interface SearchSuggestion {
  type: 'user' | 'post';
  id: string;
  text: string;
  subtitle: string;
  image?: string;
  slug?: string;
}

export interface SearchResponse<T> {
  success: boolean;
  data: {
    results: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers?: number;
      totalPosts?: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters?: {
      category?: string;
      sortBy?: string;
    };
  };
  message: string;
}


export type SearchType = 'user' | 'post';

export interface SearchParams {
  query: string;
  type: SearchType;
  limit?: number;
  page?: number;
  category?: string;
  sortBy?: 'relevance' | 'latest' | 'popular' | 'liked';
}


