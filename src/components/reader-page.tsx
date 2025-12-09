import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Chapter, Comic, User, Ad } from '../lib/types';
import { getChapters, getAllAds } from '../lib/data-store';
import { saveBookmark, getBookmarks } from '../lib/auth';
import { incrementChaptersRead, shouldShowAd, markAdShown } from '../lib/ad-tracker';
import { AdModal } from './ad-modal';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ReaderPageProps {
  comic: Comic;
  chapter: Chapter;
  user: User | null;
  onBack: () => void;
  onShowPremiumModal?: () => void;
}

export function ReaderPage({ comic, chapter, user, onBack, onShowPremiumModal }: ReaderPageProps) {
  const [currentChapter, setCurrentChapter] = useState(chapter);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  useEffect(() => {
    const chapters = getChapters(comic.id);
    setAllChapters(chapters);
    
    const bookmarks = getBookmarks();
    setIsBookmarked(!!bookmarks[comic.id]);
  }, [comic.id]);

  useEffect(() => {
    // Auto-save reading progress
    if (user) {
      saveBookmark(comic.id, currentChapter.id);
    }

    // Check if we should show an ad
    if (!user?.isPremium) {
      const activeAds = getAllAds().filter(ad => ad.isActive);
      if (activeAds.length > 0) {
        // Check each ad's frequency
        const adToShow = activeAds.find(ad => shouldShowAd(ad, false));
        if (adToShow) {
          // Small delay so user sees they finished the chapter
          setTimeout(() => {
            setShowAdModal(true);
            markAdShown();
          }, 1000);
        }
      }
      
      // Increment chapter read counter
      incrementChaptersRead();
    }
  }, [currentChapter, comic.id, user]);

  const currentIndex = allChapters.findIndex(ch => ch.id === currentChapter.id);
  const hasNext = currentIndex < allChapters.length - 1;
  const hasPrev = currentIndex > 0;

  const goToNextChapter = () => {
    if (hasNext) {
      const nextChapter = allChapters[currentIndex + 1];
      if (!nextChapter.isLocked || user?.isPremium) {
        setCurrentChapter(nextChapter);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (onShowPremiumModal) {
        onShowPremiumModal();
      }
    }
  };

  const goToPrevChapter = () => {
    if (hasPrev) {
      const prevChapter = allChapters[currentIndex - 1];
      setCurrentChapter(prevChapter);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleBookmark = () => {
    if (!user) {
      alert('Please login to bookmark');
      return;
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Reader Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h4 className="line-clamp-1">{comic.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {currentChapter.title}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBookmark}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-primary" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Reader Content - Vertical Scroll */}
      <div className="max-w-screen-md mx-auto">
        <div className="bg-background/10 backdrop-blur-sm p-4 text-center">
          <p className="text-muted-foreground">{currentChapter.title}</p>
        </div>
        
        {currentChapter.pages.map((page, index) => (
          <div key={index} className="w-full">
            <ImageWithFallback
              src={page}
              alt={`Page ${index + 1}`}
              className="w-full h-auto"
              loading={index > 0 ? 'lazy' : 'eager'}
            />
          </div>
        ))}

        {/* Chapter Navigation */}
        <div className="bg-background p-6 border-t border-border">
          <div className="text-center mb-6">
            <p className="text-muted-foreground mb-2">End of {currentChapter.title}</p>
            <p className="text-sm text-muted-foreground">
              Chapter {currentChapter.number} of {comic.totalChapters}
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            {hasPrev && (
              <Button
                variant="outline"
                onClick={goToPrevChapter}
                className="flex-1 max-w-xs"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Chapter
              </Button>
            )}
            {hasNext && (
              <Button
                onClick={goToNextChapter}
                disabled={allChapters[currentIndex + 1]?.isLocked && !user?.isPremium}
                className="flex-1 max-w-xs"
              >
                Next Chapter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {hasNext && allChapters[currentIndex + 1]?.isLocked && !user?.isPremium && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Next chapter requires Premium membership for early access
            </p>
          )}
        </div>
      </div>

      {/* Ad Modal */}
      <AdModal 
        show={showAdModal}
        onClose={() => setShowAdModal(false)}
        onAdClick={(ad) => {
          if (ad.linkUrl === '#premium' && onShowPremiumModal) {
            onShowPremiumModal();
          }
        }}
      />
    </div>
  );
}