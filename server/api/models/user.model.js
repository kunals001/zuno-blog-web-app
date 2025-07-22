import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    verifyTokenExpiry: {
        type: Date
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

    profilePic:{
      type: String,
      default: ""
    },
    
    signupSource: {
      type: String,
      enum: ["website", "google"],
      default: "website"
    },

  },
  { timestamps: true }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};


const User = mongoose.model("User", userSchema);

export default User;



