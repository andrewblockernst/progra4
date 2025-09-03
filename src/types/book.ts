export interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

export interface Review {
  id: string;
  bookId: string;
  userName: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  userVotes: { [userId: string]: 'up' | 'down' }; // Track user votes
}

export interface BookWithReviews extends GoogleBookItem {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}