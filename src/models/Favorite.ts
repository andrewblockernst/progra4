import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);