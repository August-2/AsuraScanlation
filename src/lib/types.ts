export interface User {
  id: string;
  email: string;
  username: string;
  isPremium: boolean;
  premiumUntil?: Date;
  profilePicture?: string;
  isAdmin?: boolean;
}

export interface Comic {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  genres: string[];
  rating: number;
  status: 'ongoing' | 'completed';
  totalChapters: number;
}

export interface Chapter {
  id: string;
  comicId: string;
  number: number;
  title: string;
  releaseDate: Date;
  premiumReleaseDate: Date;
  isLocked: boolean;
  pages: string[];
}

export interface Bookmark {
  comicId: string;
  chapterId: string;
  timestamp: Date;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  buttonText: string;
  isActive: boolean;
  showFrequency: 'every' | 'every-2' | 'every-3' | 'every-5'; // Show ad every X chapters
  createdAt: Date;
}