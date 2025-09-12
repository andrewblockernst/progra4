import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  userName: { type: String, default: 'Usuario Anónimo' },
  createdAt: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  userVotes: { type: Map, of: String, default: {} },
});

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);

