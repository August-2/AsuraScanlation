import { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck, Clock, Lock, Star, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Comic, Chapter, User } from '../lib/types';
import { getChapters, subscribeToDataChanges } from '../lib/data-store';
import { getBookmarks, saveBookmark, removeBookmark } from '../lib/auth';
import { PaymentModal } from './payment-modal';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ComicDetailPageProps {
  comic: Comic;
  user: User | null;
  onBack: () => void;
  onReadChapter: (chapter: Chapter) => void;
  onUserUpdate?: (user: User) => void;
}

export function ComicDetailPage({ comic, user, onBack, onReadChapter, onUserUpdate }: ComicDetailPageProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadData();

    // Subscribe to data changes
    const unsubscribe = subscribeToDataChanges(() => {
      loadData();
    });

    return unsubscribe;
  }, [comic.id]);

  const loadData = () => {
    setChapters(getChapters(comic.id));
    const bookmarks = getBookmarks();
    setIsBookmarked(!!bookmarks[comic.id]);
  };

  const handleBookmarkToggle = () => {
    if (!user) {
      alert('Please login to bookmark comics');
      return;
    }

    if (isBookmarked) {
      removeBookmark(comic.id);
      setIsBookmarked(false);
    } else {
      saveBookmark(comic.id, chapters[0]?.id || '1');
      setIsBookmarked(true);
    }
  };

  const canAccessChapter = (chapter: Chapter): boolean => {
    if (!chapter.isLocked) return true;
    return user?.isPremium || false;
  };

  const getDaysUntilUnlock = (chapter: Chapter): number => {
    const now = new Date();
    const unlock = chapter.releaseDate;
    const diffTime = unlock.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleUpgradeToPremium = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (updatedUser: User) => {
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h3 className="line-clamp-1">{comic.title}</h3>
          </div>
          <Button
            variant={isBookmarked ? 'default' : 'outline'}
            size="icon"
            onClick={handleBookmarkToggle}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Comic Info */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-48 lg:w-56">
            <div className="aspect-[2/3] rounded-lg overflow-hidden">
              <ImageWithFallback
                src={comic.coverImage}
                alt={comic.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="mb-2">{comic.title}</h1>
                <p className="text-muted-foreground mb-2">{comic.author}</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <span>{comic.rating}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <Badge>{comic.status}</Badge>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {comic.totalChapters} Chapters
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {comic.genres.map(genre => (
                <Badge key={genre} variant="outline">{genre}</Badge>
              ))}
            </div>
            
            <p className="text-muted-foreground mb-6">{comic.description}</p>
            
            {!user?.isPremium && (
              <Card className="p-4 bg-gradient-to-r from-primary/20 to-purple-600/20 border-primary/30">
                <div className="flex items-start gap-3">
                  <Crown className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="mb-1">Get Premium Access</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Read new chapters 7 days early with Premium membership
                    </p>
                    <Button size="sm" variant="default" onClick={handleUpgradeToPremium}>
                      Upgrade to Premium
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Chapters List */}
        <div>
          <h2 className="mb-4">Chapters</h2>
          <div className="space-y-2">
            {chapters.map(chapter => {
              const canAccess = canAccessChapter(chapter);
              const daysUntilUnlock = getDaysUntilUnlock(chapter);

              return (
                <Card
                  key={chapter.id}
                  className={`p-4 ${canAccess ? 'cursor-pointer transition-colors' : 'opacity-60 cursor-not-allowed'} ${chapter.isLocked && !canAccess ? 'border-primary/30 bg-primary/5' : ''}`}
                  onClick={() => canAccess && onReadChapter(chapter)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{chapter.title}</h4>
                        {chapter.isLocked && (
                          <Badge variant="secondary" className="bg-gradient-to-r from-primary/30 to-purple-600/30 text-primary border border-primary/20">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium Early Access
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {chapter.isLocked && !user?.isPremium ? (
                          <span className="flex items-center gap-1 text-primary">
                            <Clock className="w-4 h-4" />
                            Free in {daysUntilUnlock} {daysUntilUnlock === 1 ? 'day' : 'days'} • Premium members read now
                          </span>
                        ) : chapter.isLocked && user?.isPremium ? (
                          <span className="flex items-center gap-1 text-primary">
                            <Crown className="w-4 h-4" />
                            Premium Early Access
                          </span>
                        ) : (
                          <span>
                            Released {chapter.releaseDate.toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      {canAccess ? (
                        <Button size="sm">Read</Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled className="gap-1">
                          <Lock className="w-4 h-4" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        user={user}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}