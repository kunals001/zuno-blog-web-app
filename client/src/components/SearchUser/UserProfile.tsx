"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { User,UserWithRelationship } from "@/redux/type";
import {
  Calendar,
  Users,
  Heart,
  MessageCircle,
  UserPlus,
  UserMinus,
  Send,
  Shield,
  Clock,
  Eye,
  BookOpen,
} from "lucide-react";

interface UserProfileProps {
  // You can add any additional props if needed
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const { getUser, getUserLoading } = useAppSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");

  if (getUserLoading) {
    return <UserProfileSkeleton />;
  }

  if (!getUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
          User not found
        </h2>
      </div>
    );
  }

  const user: UserWithRelationship = getUser;

  const {
    name,
    username,
    profilePic,
    bio,
    followers,
    following,
    myposts,
    isOnline,
    relationship,
    createdAt,
    socialLinks,
    isBlocked,
  } = user;

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    if (diffMinutes < 2880) return "yesterday";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
    });
  };

  const renderActionButtons = () => {
    if (isBlocked) {
      return (
        <div className="flex items-center gap-3">
          <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg flex items-center gap-2">
            <Shield size={18} />
            <span className="font-medium">Blocked User</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        {relationship?.hasPendingRequest ? (
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Clock size={18} />
            Request Pending
          </button>
        ) : relationship?.isFollowing ? (
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <UserMinus size={18} />
            Unfollow
          </button>
        ) : (
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <UserPlus size={18} />
            Follow
          </button>
        )}

        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <Send size={18} />
          Message
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-48">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Profile Info Section */}
      <div className="relative px-6 pb-6">
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20 relative z-10">
          <div className="relative">
            <img
              src={profilePic}
              alt={`${name}'s profile`}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-800 shadow-xl object-cover"
            />
            {isOnline && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white dark:border-zinc-800 rounded-full"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 sm:pt-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  @{username}
                  {isOnline && (
                    <span className="text-green-500 text-sm font-medium">
                      • Online
                    </span>
                  )}
                </p>
                {bio && (
                  <p className="text-gray-700 dark:text-gray-300 mt-2 max-w-md">
                    {bio}
                  </p>
                )}
              </div>

              {renderActionButtons()}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {myposts?.length || 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Posts
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {followers?.length || 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Followers
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {following?.length || 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Following
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Joined {formatDate(createdAt as string)}</span>
          </div>
          {relationship?.isFollower && (
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
              Follows you
            </div>
          )}
        </div>

        {/* Social Links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link: string, index: number) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs Section */}
      <div className="border-t border-gray-200 dark:border-zinc-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "posts"
                ? "text-blue-500 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen size={18} />
              Posts ({myposts?.length || 0})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "about"
                ? "text-blue-500 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users size={18} />
              About
            </div>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {activeTab === "posts" ? (
          <PostsGrid posts={myposts} />
        ) : (
          <AboutSection user={user} />
        )}
      </div>
    </div>
  );
};

// Posts Grid Component
const PostsGrid: React.FC<{ posts: any[] }> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
          No posts yet
        </h3>
        <p className="text-gray-500 dark:text-gray-500 mt-2">
          This user hasn't published any posts yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-gray-50 dark:bg-zinc-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        >
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-32 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">
              {post.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Heart size={14} />
                  {post.likes?.length || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  {post.comments?.length || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {post.views || 0}
                </span>
              </div>
              <span>{post.readTime || 1} min read</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// About Section Component
const AboutSection: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          About {user.name}
        </h3>
        {user.bio ? (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {user.bio}
          </p>
        ) : (
          <p className="text-gray-500 dark:text-gray-500 italic">
            This user hasn't added a bio yet.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Users size={18} />
            Followers ({user.followers?.length || 0})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {user.followers?.slice(0, 5).map((follower: any) => (
              <div key={follower._id} className="flex items-center gap-3">
                <img
                  src={follower.profilePic}
                  alt={follower.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {follower.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    @{follower.username}
                  </p>
                </div>
              </div>
            ))}
            {user.followers?.length > 5 && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                +{user.followers.length - 5} more
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Users size={18} />
            Following ({user.following?.length || 0})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {user.following?.slice(0, 5).map((following: any) => (
              <div key={following._id} className="flex items-center gap-3">
                <img
                  src={following.profilePic}
                  alt={following.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {following.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    @{following.username}
                  </p>
                </div>
              </div>
            ))}
            {user.following?.length > 5 && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                +{user.following.length - 5} more
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const UserProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="bg-gray-300 dark:bg-zinc-700 h-48"></div>
      <div className="px-6 pb-6">
        <div className="flex items-end gap-6 -mt-20 relative z-10">
          <div className="w-32 h-32 bg-gray-300 dark:bg-zinc-700 rounded-full"></div>
          <div className="flex-1 pt-4">
            <div className="h-8 bg-gray-300 dark:bg-zinc-700 rounded w-48 mb-2"></div>
            <div className="h-6 bg-gray-300 dark:bg-zinc-700 rounded w-32 mb-4"></div>
            <div className="h-10 bg-gray-300 dark:bg-zinc-700 rounded w-32"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="h-8 bg-gray-300 dark:bg-zinc-700 rounded w-12 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
