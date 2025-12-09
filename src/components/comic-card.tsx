import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Bookmark, BookmarkCheck, Star } from 'lucide-react';
import { Comic } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ComicCardProps {
  comic: Comic;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onClick: () => void;
}

export function ComicCard({ comic, isBookmarked, onBookmarkToggle, onClick }: ComicCardProps) {
  return (
    <Card className="overflow-hidden group cursor-pointer ring-primary transition-all">
      <div className="relative aspect-[2/3] overflow-hidden" onClick={onClick}>
        <ImageWithFallback
          src={comic.coverImage}
          alt={comic.title}
          className="w-full h-full object-cover transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm">
            {comic.status}
          </Badge>
          {onBookmarkToggle && (
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-black/70 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                onBookmarkToggle();
              }}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-primary" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-1 text-yellow-400 mb-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm">{comic.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-4" onClick={onClick}>
        <h3 className="mb-1 line-clamp-1">{comic.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{comic.author}</p>
        <div className="flex flex-wrap gap-1">
          {comic.genres.slice(0, 2).map(genre => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}