import { describe, it, expect, vi } from 'vitest';
import bcrypt from 'bcryptjs';
import User from '@/models/User';

// Mock DB
vi.mock('@/lib/mongodb');

describe('Authentication', () => {
  it('should hash password correctly', () => {
    const password = 'test123';
    const hashed = bcrypt.hashSync(password, 10);
    expect(bcrypt.compareSync(password, hashed)).toBe(true);
  });

  it('should create user', async () => {
    const user = new User({ email: 'test@example.com', password: 'hashed', name: 'Test' });
    expect(user.email).toBe('test@example.com');
  });
});
