import { useState, useEffect } from 'react';
import { ArrowLeft, BookmarkX, BookMarked } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Comic } from '../lib/types';
import { getBookmarks, removeBookmark } from '../lib/auth';
import { getAllComics, subscribeToDataChanges } from '../lib/data-store';
import { ComicCard } from './comic-card';
import { toast } from 'sonner@2.0.3';

interface BookmarksPageProps {
  onComicSelect: (comic: Comic) => void;
  onBack: () => void;
}

export function BookmarksPage({ onComicSelect, onBack }: BookmarksPageProps) {
  const [comics, setComics] = useState<Comic[]>([]);
  const [bookmarks, setBookmarks] = useState<Record<string, any>>({});

  useEffect(() => {
    loadData();

    // Subscribe to data changes
    const unsubscribe = subscribeToDataChanges(() => {
      loadData();
    });

    return unsubscribe;
  }, []);

  const loadData = () => {
    setComics(getAllComics());
    setBookmarks(getBookmarks());
  };

  const handleRemoveBookmark = (comicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeBookmark(comicId);
    loadData();
    toast.success('Bookmark removed');
  };

  const bookmarkedComics = comics.filter(comic => bookmarks[comic.id]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <BookMarked className="w-6 h-6 text-primary" />
              <h1>My Bookmarks</h1>
              <Badge variant="secondary">{bookmarkedComics.length}</Badge>
            </div>
          </div>
        </div>

        {/* Bookmarked Comics Grid */}
        {bookmarkedComics.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {bookmarkedComics.map(comic => (
              <div key={comic.id} className="relative group">
                <ComicCard
                  comic={comic}
                  isBookmarked={true}
                  onClick={() => onComicSelect(comic)}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-100 transition-opacity w-8 h-8"
                  onClick={(e) => handleRemoveBookmark(comic.id, e)}
                >
                  <BookmarkX className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <BookMarked className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="mb-2">No Bookmarks Yet</h2>
            <p className="text-muted-foreground mb-4">
              Start adding comics to your bookmarks to see them here
            </p>
            <Button onClick={onBack}>
              Browse Comics
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}