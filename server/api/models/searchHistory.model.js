import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  query: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  
  type: {
    type: String,
    enum: ['user', 'post'],
    required: true
  },
  
  searchedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Create compound index for better performance
searchHistorySchema.index({ userId: 1, searchedAt: -1 });
searchHistorySchema.index({ userId: 1, query: 1, type: 1 });

// Auto-delete old search history after 30 days
searchHistorySchema.index({ searchedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);
export default SearchHistory;