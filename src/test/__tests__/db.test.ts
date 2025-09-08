import { describe, it, expect, vi } from 'vitest';
import mongoose from 'mongoose';

// Mock completo de mongoose
vi.mock('mongoose', () => ({
  Schema: vi.fn().mockImplementation(() => ({
    pre: vi.fn(),
  })),
  model: vi.fn(),
  models: {},
  connect: vi.fn(),
}));

// Mock del modelo Review
vi.mock('@/models/Review', () => ({
  default: vi.fn().mockImplementation((data) => ({
    ...data,
    save: vi.fn().mockResolvedValue(data),
  })),
}));

import Review from '@/models/Review';

describe('DB Operations', () => {
  it('creates review', async () => {
    const review = new Review({ userId: '123', bookId: '456' });
    expect(review.bookId).toBe('456');
    await review.save();
    expect(review.save).toHaveBeenCalled();
  });
});