import { Ad } from './types';

const AD_TRACKER_KEY = 'manhwa_app_ad_tracker';

interface AdTracker {
  chaptersRead: number;
  lastAdShown: number;
}

export const getAdTracker = (): AdTracker => {
  const stored = localStorage.getItem(AD_TRACKER_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { chaptersRead: 0, lastAdShown: 0 };
};

export const saveAdTracker = (tracker: AdTracker) => {
  localStorage.setItem(AD_TRACKER_KEY, JSON.stringify(tracker));
};

export const incrementChaptersRead = () => {
  const tracker = getAdTracker();
  tracker.chaptersRead += 1;
  saveAdTracker(tracker);
  return tracker.chaptersRead;
};

export const shouldShowAd = (ad: Ad, isPremium: boolean): boolean => {
  // Premium users don't see ads
  if (isPremium) return false;
  
  // Ad must be active
  if (!ad.isActive) return false;

  const tracker = getAdTracker();
  const chaptersSinceLastAd = tracker.chaptersRead - tracker.lastAdShown;

  const frequencyMap = {
    'every': 1,
    'every-2': 2,
    'every-3': 3,
    'every-5': 5,
  };

  const frequency = frequencyMap[ad.showFrequency];
  return chaptersSinceLastAd >= frequency;
};

export const markAdShown = () => {
  const tracker = getAdTracker();
  tracker.lastAdShown = tracker.chaptersRead;
  saveAdTracker(tracker);
};

export const resetAdTracker = () => {
  localStorage.removeItem(AD_TRACKER_KEY);
};
