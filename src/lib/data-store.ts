import { Comic, Chapter, Ad } from './types';
import { mockComics as initialComics, getChaptersForComic } from './mock-data';

// Storage keys
const COMICS_KEY = 'manhwa_app_comics';
const CHAPTERS_KEY = 'manhwa_app_chapters';
const ADS_KEY = 'manhwa_app_ads';

// Default ads
const defaultAds: Ad[] = [
  {
    id: 'ad-1',
    title: 'Upgrade to Premium!',
    description: 'Get ad-free reading and early access to new chapters. Join thousands of premium readers today!',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    linkUrl: '#premium',
    buttonText: 'Go Premium',
    isActive: true,
    showFrequency: 'every-2',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'ad-2',
    title: 'New Comics Every Week!',
    description: 'Discover amazing new manhwa series added weekly. Never run out of content to read!',
    imageUrl: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=800&q=80',
    linkUrl: '#browse',
    buttonText: 'Browse Comics',
    isActive: true,
    showFrequency: 'every-3',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'ad-3',
    title: 'Join Our Community!',
    description: 'Connect with fellow manhwa fans, share theories, and discuss your favorite series!',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    linkUrl: 'https://discord.gg/example',
    buttonText: 'Join Discord',
    isActive: false,
    showFrequency: 'every-5',
    createdAt: new Date('2024-02-01'),
  },
];

// Event listeners for data changes
type DataChangeListener = () => void;
const listeners: DataChangeListener[] = [];

export const subscribeToDataChanges = (listener: DataChangeListener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Initialize data from localStorage or use defaults
const loadComics = (): Comic[] => {
  const stored = localStorage.getItem(COMICS_KEY);
  return stored ? JSON.parse(stored) : initialComics;
};

const loadChapters = (): Record<string, Chapter[]> => {
  const stored = localStorage.getItem(CHAPTERS_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    Object.keys(parsed).forEach(comicId => {
      parsed[comicId] = parsed[comicId].map((chapter: any) => ({
        ...chapter,
        releaseDate: new Date(chapter.releaseDate),
        premiumReleaseDate: new Date(chapter.premiumReleaseDate)
      }));
    });
    return parsed;
  }
  
  // Generate initial chapters for all comics
  const chapters: Record<string, Chapter[]> = {};
  initialComics.forEach(comic => {
    chapters[comic.id] = getChaptersForComic(comic.id);
  });
  return chapters;
};

const loadAds = (): Ad[] => {
  const stored = localStorage.getItem(ADS_KEY);
  return stored ? JSON.parse(stored) : defaultAds;
};

// In-memory data store
let comics: Comic[] = loadComics();
let chaptersStore: Record<string, Chapter[]> = loadChapters();
let ads: Ad[] = loadAds();

// Save to localStorage
const saveComics = () => {
  localStorage.setItem(COMICS_KEY, JSON.stringify(comics));
};

const saveChapters = () => {
  localStorage.setItem(CHAPTERS_KEY, JSON.stringify(chaptersStore));
};

const saveAds = () => {
  localStorage.setItem(ADS_KEY, JSON.stringify(ads));
};

// Comics CRUD operations
export const getAllComics = (): Comic[] => {
  return [...comics];
};

export const getComic = (id: string): Comic | undefined => {
  return comics.find(c => c.id === id);
};

export const createComic = (comic: Comic): Comic => {
  comics.push(comic);
  chaptersStore[comic.id] = [];
  saveComics();
  saveChapters();
  notifyListeners();
  return comic;
};

export const updateComic = (id: string, updates: Partial<Comic>): Comic | null => {
  const index = comics.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  comics[index] = { ...comics[index], ...updates };
  saveComics();
  notifyListeners();
  return comics[index];
};

export const deleteComic = (id: string): boolean => {
  const index = comics.findIndex(c => c.id === id);
  if (index === -1) return false;
  
  comics.splice(index, 1);
  delete chaptersStore[id];
  saveComics();
  saveChapters();
  notifyListeners();
  return true;
};

// Chapters CRUD operations
export const getChapters = (comicId: string): Chapter[] => {
  return chaptersStore[comicId] ? [...chaptersStore[comicId]] : [];
};

export const getChapter = (comicId: string, chapterId: string): Chapter | undefined => {
  const chapters = chaptersStore[comicId];
  return chapters ? chapters.find(ch => ch.id === chapterId) : undefined;
};

export const createChapter = (chapter: Chapter): Chapter => {
  if (!chaptersStore[chapter.comicId]) {
    chaptersStore[chapter.comicId] = [];
  }
  
  chaptersStore[chapter.comicId].push(chapter);
  
  // Update comic's totalChapters
  const comicIndex = comics.findIndex(c => c.id === chapter.comicId);
  if (comicIndex !== -1) {
    comics[comicIndex].totalChapters = chaptersStore[chapter.comicId].length;
    saveComics();
  }
  
  saveChapters();
  notifyListeners();
  return chapter;
};

export const updateChapter = (comicId: string, chapterId: string, updates: Partial<Chapter>): Chapter | null => {
  const chapters = chaptersStore[comicId];
  if (!chapters) return null;
  
  const index = chapters.findIndex(ch => ch.id === chapterId);
  if (index === -1) return null;
  
  chapters[index] = { ...chapters[index], ...updates };
  saveChapters();
  notifyListeners();
  return chapters[index];
};

export const deleteChapter = (comicId: string, chapterId: string): boolean => {
  const chapters = chaptersStore[comicId];
  if (!chapters) return false;
  
  const index = chapters.findIndex(ch => ch.id === chapterId);
  if (index === -1) return false;
  
  chapters.splice(index, 1);
  
  // Update comic's totalChapters
  const comicIndex = comics.findIndex(c => c.id === comicId);
  if (comicIndex !== -1) {
    comics[comicIndex].totalChapters = chapters.length;
    saveComics();
  }
  
  saveChapters();
  notifyListeners();
  return true;
};

// Ads CRUD operations
export const getAllAds = (): Ad[] => {
  return [...ads];
};

export const getAd = (id: string): Ad | undefined => {
  return ads.find(a => a.id === id);
};

export const createAd = (ad: Ad): Ad => {
  ads.push(ad);
  saveAds();
  notifyListeners();
  return ad;
};

export const updateAd = (id: string, updates: Partial<Ad>): Ad | null => {
  const index = ads.findIndex(a => a.id === id);
  if (index === -1) return null;
  
  ads[index] = { ...ads[index], ...updates };
  saveAds();
  notifyListeners();
  return ads[index];
};

export const deleteAd = (id: string): boolean => {
  const index = ads.findIndex(a => a.id === id);
  if (index === -1) return false;
  
  ads.splice(index, 1);
  saveAds();
  notifyListeners();
  return true;
};

// Reset to initial data
export const resetData = () => {
  comics = [...initialComics];
  chaptersStore = {};
  initialComics.forEach(comic => {
    chaptersStore[comic.id] = getChaptersForComic(comic.id);
  });
  ads = [...defaultAds];
  saveComics();
  saveChapters();
  saveAds();
  notifyListeners();
};

// Export for direct access (read-only)
export const dataStore = {
  get comics() {
    return getAllComics();
  },
  get chapters() {
    return { ...chaptersStore };
  },
  get ads() {
    return getAllAds();
  }
};