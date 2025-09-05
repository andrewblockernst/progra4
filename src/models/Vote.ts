import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Review", required: true },
  voteType: { type: String, enum: ["up", "down"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Vote || mongoose.model("Vote", VoteSchema);