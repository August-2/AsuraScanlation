import { User } from './types';

const AUTH_KEY = 'manhwa_auth';
const BOOKMARKS_KEY = 'manhwa_bookmarks';

export const saveUser = (user: User) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const mockLogin = (email: string, password: string): User | null => {
  // Mock login - accept any email/password
  if (email && password) {
    const user: User = {
      id: '1',
      email,
      username: email.split('@')[0],
      isPremium: false
    };
    saveUser(user);
    return user;
  }
  return null;
};

export const mockRegister = (email: string, username: string, password: string): User | null => {
  if (email && username && password) {
    const user: User = {
      id: Date.now().toString(),
      email,
      username,
      isPremium: false
    };
    saveUser(user);
    return user;
  }
  return null;
};

export const upgradeToPremium = (user: User): User => {
  const premiumUser = {
    ...user,
    isPremium: true,
    premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  };
  saveUser(premiumUser);
  return premiumUser;
};

export const saveBookmark = (comicId: string, chapterId: string) => {
  const bookmarks = getBookmarks();
  bookmarks[comicId] = {
    comicId,
    chapterId,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
};

export const getBookmarks = (): Record<string, any> => {
  const stored = localStorage.getItem(BOOKMARKS_KEY);
  if (!stored) return {};
  return JSON.parse(stored);
};

export const removeBookmark = (comicId: string) => {
  const bookmarks = getBookmarks();
  delete bookmarks[comicId];
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
};
