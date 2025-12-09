import { useState, useEffect } from 'react';
import { ComicCard } from './comic-card';
import { getAllComics, subscribeToDataChanges } from '../lib/data-store';
import { Comic } from '../lib/types';
import { getBookmarks, saveBookmark, removeBookmark } from '../lib/auth';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search } from 'lucide-react';

interface BrowsePageProps {
  onComicSelect: (comic: Comic) => void;
  isLoggedIn: boolean;
}

export function BrowsePage({ onComicSelect, isLoggedIn }: BrowsePageProps) {
  const [comics, setComics] = useState<Comic[]>([]);
  const [bookmarks, setBookmarks] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    setComics(getAllComics());
    setBookmarks(getBookmarks());

    // Subscribe to data changes
    const unsubscribe = subscribeToDataChanges(() => {
      setComics(getAllComics());
    });

    return unsubscribe;
  }, []);

  const handleBookmarkToggle = (comicId: string) => {
    if (!isLoggedIn) {
      alert('Please login to bookmark comics');
      return;
    }

    if (bookmarks[comicId]) {
      removeBookmark(comicId);
    } else {
      saveBookmark(comicId, '1');
    }
    setBookmarks(getBookmarks());
  };

  const allGenres = Array.from(
    new Set(getAllComics().flatMap(comic => comic.genres))
  ).sort();

  const filteredComics = getAllComics().filter(comic => {
    const matchesSearch = comic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comic.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || comic.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-4">Browse Comics</h1>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search comics by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background"
            />
          </div>

          {/* Genre Filter */}
          <div className="mb-4">
            <h3 className="mb-3">Genres</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedGenre === null ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedGenre(null)}
              >
                All
              </Badge>
              {allGenres.map(genre => (
                <Badge
                  key={genre}
                  variant={selectedGenre === genre ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {filteredComics.length} {filteredComics.length === 1 ? 'comic' : 'comics'} found
          </p>
        </div>

        {/* Comics Grid */}
        {filteredComics.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredComics.map(comic => (
              <ComicCard
                key={comic.id}
                comic={comic}
                isBookmarked={!!bookmarks[comic.id]}
                onBookmarkToggle={() => handleBookmarkToggle(comic.id)}
                onClick={() => onComicSelect(comic)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No comics found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}