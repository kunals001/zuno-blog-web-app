import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAuthor: {
      type: Boolean,
      default: false,
    },

    verifytoken: String,
    verifytokenexpire: Date,
    resetpasswordtoken: String,
    resetpasswordtokenexpire: Date,

    verified: {
      type: Boolean,
      default: false,
    },

    avatar: {
      type: String,
    },

    bio: {
      type: String,
      default: "",
    },

    socialLinks: {
      type: [
        {
          label: { type: String, default: "" }, 
          url: { type: String},
        },
      ],
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    followRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    saveposts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Post",
      default: [],
    },

    readPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    postViews: [
      {
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
        viewedAt: { type: Date, default: Date.now },
      },
    ],

    myposts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
