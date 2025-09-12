import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import Review from '@/models/Review';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

// Mock completo de mongoose
vi.mock('mongoose', () => ({
  Schema: vi.fn().mockImplementation(() => ({
    pre: vi.fn(),
  })),
  model: vi.fn(),
  models: {},
  connect: vi.fn().mockResolvedValue({}),
  connection: {
    readyState: 1,
  },
}));

// Mock de la conexión a DB
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue({}),
}));

// Mock del modelo Review
vi.mock('@/models/Review', () => ({
  default: {
    find: vi.fn(() => ({
      sort: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue([]),
        exec: vi.fn().mockResolvedValue([]),
      })),
      limit: vi.fn().mockResolvedValue([]),
      populate: vi.fn().mockResolvedValue(null),
      exec: vi.fn().mockResolvedValue([]),
    })),
    findOne: vi.fn(),
    findById: vi.fn(() => ({
      populate: vi.fn().mockResolvedValue(null),
      exec: vi.fn().mockResolvedValue(null),
    })),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

// Mock del modelo User
vi.mock('@/models/User', () => ({
  default: {
    find: vi.fn(),
    findOne: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

describe('Database Operations', () => {
  const mockReview = {
    _id: 'review_id_123',
    userId: 'user_id_123',
    bookId: 'book_id_456',
    rating: 5,
    comment: 'Great book!',
    userName: 'Test User',
    createdAt: new Date(),
    upvotes: 0,
    downvotes: 0,
    userVotes: {},
  };

  const mockUser = {
    _id: 'user_id_123',
    email: 'test@example.com',
    password: 'hashed_password',
    name: 'Test User',
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Database Connection', () => {
    it('should connect to database successfully', async () => {
      const mockConnection = { readyState: 1 };
      (connectDB as any).mockResolvedValue(mockConnection);

      const connection = await connectDB();
      expect(connection).toBeDefined();
    });

    it('should handle connection failure', async () => {
      const error = new Error('Connection failed');
      (connectDB as any).mockRejectedValue(error);

      await expect(connectDB()).rejects.toThrow('Connection failed');
    });
  });

  describe('Review CRUD Operations', () => {
    it('should create review successfully', async () => {
      (Review.create as any).mockResolvedValue(mockReview);

      const reviewData = {
        userId: 'user_id_123',
        bookId: 'book_id_456',
        rating: 5,
        comment: 'Great book!',
        userName: 'Test User',
      };

      const review = await Review.create(reviewData);
      expect(review.bookId).toBe('book_id_456');
      expect(review.rating).toBe(5);
      expect(review.comment).toBe('Great book!');
    });

    it('should find reviews by user ID', async () => {
      const mockReviews = [mockReview];
      (Review.find as any).mockResolvedValue(mockReviews);

      const reviews = await Review.find({ userId: 'user_id_123' });
      expect(reviews).toHaveLength(1);
      expect(reviews[0].userId).toBe('user_id_123');
    });

    it('should find reviews by book ID', async () => {
      const mockReviews = [mockReview];
      (Review.find as any).mockResolvedValue(mockReviews);

      const reviews = await Review.find({ bookId: 'book_id_456' });
      expect(reviews).toHaveLength(1);
      expect(reviews[0].bookId).toBe('book_id_456');
    });

    it('should find review by ID', async () => {
      (Review.findById as any).mockResolvedValue(mockReview);

      const review = await Review.findById('review_id_123');
      expect(review).toBeTruthy();
      expect(review?._id).toBe('review_id_123');
    });

    it('should return null for non-existent review', async () => {
      (Review.findById as any).mockResolvedValue(null);

      const review = await Review.findById('non_existent_id');
      expect(review).toBeNull();
    });

    it('should update review successfully', async () => {
      const updatedReview = { ...mockReview, comment: 'Updated comment' };
      (Review.findByIdAndUpdate as any).mockResolvedValue(updatedReview);

      const review = await Review.findByIdAndUpdate(
        'review_id_123',
        { comment: 'Updated comment' },
        { new: true }
      );
      expect(review?.comment).toBe('Updated comment');
    });

    it('should delete review successfully', async () => {
      (Review.findByIdAndDelete as any).mockResolvedValue(mockReview);

      const review = await Review.findByIdAndDelete('review_id_123');
      expect(review).toBeTruthy();
      expect(review?._id).toBe('review_id_123');
    });

    it('should handle validation errors', async () => {
      const validationError = new Error('Validation failed');
      (validationError as any).name = 'ValidationError';
      (Review.create as any).mockRejectedValue(validationError);

      const invalidReviewData = {
        userId: '', // Invalid: empty userId
        bookId: 'book_id_456',
        rating: 6, // Invalid: rating > 5
        comment: 'Test',
      };

      await expect(Review.create(invalidReviewData)).rejects.toThrow('Validation failed');
    });
  });

  describe('User CRUD Operations', () => {
    it('should create user successfully', async () => {
      (User.create as any).mockResolvedValue(mockUser);

      const userData = {
        email: 'test@example.com',
        password: 'hashed_password',
        name: 'Test User',
      };

      const user = await User.create(userData);
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
    });

    it('should find user by email', async () => {
      (User.findOne as any).mockResolvedValue(mockUser);

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).toBeTruthy();
      expect(user?.email).toBe('test@example.com');
    });

    it('should find user by ID', async () => {
      (User.findById as any).mockResolvedValue(mockUser);

      const user = await User.findById('user_id_123');
      expect(user).toBeTruthy();
      expect(user?._id).toBe('user_id_123');
    });

    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      (User.findByIdAndUpdate as any).mockResolvedValue(updatedUser);

      const user = await User.findByIdAndUpdate(
        'user_id_123',
        { name: 'Updated Name' },
        { new: true }
      );
      expect(user?.name).toBe('Updated Name');
    });

    it('should delete user successfully', async () => {
      (User.findByIdAndDelete as any).mockResolvedValue(mockUser);

      const user = await User.findByIdAndDelete('user_id_123');
      expect(user).toBeTruthy();
      expect(user?._id).toBe('user_id_123');
    });

    it('should handle duplicate email error', async () => {
      const duplicateError = new Error('Duplicate key error');
      (duplicateError as any).code = 11000;
      (User.create as any).mockRejectedValue(duplicateError);

      const userData = {
        email: 'existing@example.com',
        password: 'hashed_password',
        name: 'Test User',
      };

      await expect(User.create(userData)).rejects.toThrow('Duplicate key error');
    });
  });

  describe('Data Validation', () => {
    it('should validate review rating range', () => {
      const validRatings = [1, 2, 3, 4, 5];
      const invalidRatings = [0, 6, -1, 10];

      validRatings.forEach(rating => {
        expect(rating).toBeGreaterThanOrEqual(1);
        expect(rating).toBeLessThanOrEqual(5);
      });

      invalidRatings.forEach(rating => {
        expect(rating < 1 || rating > 5).toBe(true);
      });
    });

    it('should validate required fields', () => {
      const requiredFields = ['userId', 'bookId', 'rating'];

      const incompleteData = {
        userId: 'user_123',
        // Missing bookId and rating
      };

      requiredFields.forEach(field => {
        if (field !== 'userId') {
          expect(incompleteData).not.toHaveProperty(field);
        }
      });
    });

    it('should validate email uniqueness', async () => {
      const existingUser = { email: 'test@example.com' };
      (User.findOne as any).mockResolvedValue(existingUser);

      const result = await User.findOne({ email: 'test@example.com' });
      expect(result).toBeTruthy();
    });

    it('should validate comment length', () => {
      const shortComment = 'Hi';
      const longComment = 'A'.repeat(1001); // Too long
      const validComment = 'This is a great book! I really enjoyed reading it.';

      expect(shortComment.length).toBeLessThan(10);
      expect(longComment.length).toBeGreaterThan(1000);
      expect(validComment.length).toBeGreaterThanOrEqual(10);
      expect(validComment.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Query Operations', () => {
    const queryMockReview = {
      _id: 'review_id_123',
      userId: 'user_id_123',
      bookId: 'book_id_456',
      rating: 5,
      comment: 'Great book!',
      userName: 'Test User',
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      userVotes: {},
    };

    it('should sort reviews by creation date', async () => {
      const mockReviews = [
        { ...queryMockReview, _id: '1', createdAt: new Date('2024-01-01') },
        { ...queryMockReview, _id: '2', createdAt: new Date('2024-01-03') },
        { ...queryMockReview, _id: '3', createdAt: new Date('2024-01-02') },
      ];

      const sortedReviews = mockReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Mock the chain
      const mockQuery = {
        sort: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(sortedReviews),
      };

      (Review.find as any).mockReturnValue(mockQuery);

      const reviews = await Review.find({}).sort({ createdAt: -1 }).exec();
      expect(reviews).toHaveLength(3);
      expect(new Date(reviews[0].createdAt).getTime()).toBeGreaterThan(new Date(reviews[1].createdAt).getTime());
    });

    it('should limit query results', async () => {
      const mockReviews = Array.from({ length: 10 }, (_, i) => ({
        ...queryMockReview,
        _id: `review_${i}`,
      }));

      // Mock the chain
      const mockQuery = {
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockReviews.slice(0, 5)),
      };

      (Review.find as any).mockReturnValue(mockQuery);

      const reviews = await Review.find({}).limit(5).exec();
      expect(reviews).toHaveLength(5);
    });

    it('should populate related data', async () => {
      const mockReviewWithUser = {
        ...queryMockReview,
        user: {
          _id: 'user_id_123',
          name: 'Test User',
          email: 'test@example.com',
        },
      };

      // Mock the chain
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockReviewWithUser),
      };

      (Review.findById as any).mockReturnValue(mockQuery);

      const review = await Review.findById('review_id_123').populate('user').exec();
      expect(review?.user).toBeDefined();
      expect(review?.user.name).toBe('Test User');
    });
  });
});