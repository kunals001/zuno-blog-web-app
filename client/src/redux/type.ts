
/// ---------------------- User ---------------------- ////
export type SocialLink = {
  label: string;
  url?: string;
};

export type PostView = {
  post: string; 
  viewedAt: string; 
};

export type User = {
  _id: string;
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
  bio: string;
  socialLinks: SocialLink[];
  followers: string[]; 
  following: string[]; 
  followRequests: string[]; 
  saveposts: string[]; 
  readPosts: string[]; 
  postViews: PostView[];
  myposts: string[]; 
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/// ------------------------ Post ------------------------ ///

export type Post = {
  _id: string;
  author: string; 
  title: string;
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

export type Comment = {
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


