import { useState, useEffect } from "react";
import { ComicCard } from "./comic-card";
import { getAllComics, subscribeToDataChanges } from "../lib/data-store";
import { Comic } from "../lib/types";
import {
  getBookmarks,
  saveBookmark,
  removeBookmark,
} from "../lib/auth";
import { TrendingUp, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  onComicSelect: (comic: Comic) => void;
  isLoggedIn: boolean;
}

export function HomePage({
  onComicSelect,
  isLoggedIn,
}: HomePageProps) {
  const [comics, setComics] = useState<Comic[]>([]);
  const [bookmarks, setBookmarks] = useState<
    Record<string, any>
  >({});

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
      alert("Please login to bookmark comics");
      return;
    }

    if (bookmarks[comicId]) {
      removeBookmark(comicId);
    } else {
      saveBookmark(comicId, "1");
    }
    setBookmarks(getBookmarks());
  };

  // Simulate different rankings for daily, weekly, monthly
  const getRankedComics = (period: "daily" | "weekly" | "monthly") => {
    let sorted = [...comics];

    if (period === "daily") {
      // Daily: Sort by rating
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (period === "weekly") {
      // Weekly: Mix of rating and ongoing status
      sorted.sort((a, b) => {
        if (a.status === "ongoing" && b.status !== "ongoing") return -1;
        if (a.status !== "ongoing" && b.status === "ongoing") return 1;
        return b.rating - a.rating;
      });
    } else {
      // Monthly: Sort by total chapters and rating
      sorted.sort(
        (a, b) => b.totalChapters - a.totalChapters || b.rating - a.rating
      );
    }

    return sorted;
  };

  const filteredComics = getRankedComics("daily");

  const filters = [
    { id: "daily", label: "Daily", icon: TrendingUp },
    { id: "weekly", label: "Weekly", icon: Crown },
    { id: "monthly", label: "Monthly", icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="mb-2">Discover Amazing Manhwa</h1>
          <p className="text-muted-foreground">
            Read the latest chapters and enjoy premium early
            access
          </p>
        </div>

        {/* Featured Section */}
        {comics.length > 0 && (
          <div className="mb-8 relative rounded-2xl overflow-hidden">
            <div className="relative h-64 md:h-80">
              <ImageWithFallback
                src={comics[0].coverImage}
                alt="Featured"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="max-w-2xl">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm mb-3">
                    Featured
                  </div>
                  <h2 className="mb-2">{comics[0].title}</h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {comics[0].description}
                  </p>
                  <Button
                    onClick={() => onComicSelect(comics[0])}
                  >
                    Read Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popularity Rankings */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2>Popularity Rankings</h2>
          </div>
          
          <Card className="overflow-hidden">
            <Tabs defaultValue="daily" className="w-full">
              <div className="border-b border-border bg-muted/30">
                <TabsList className="w-full justify-start rounded-none bg-transparent p-0 h-auto">
                  <TabsTrigger 
                    value="daily" 
                    className="rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary px-6 py-3"
                  >
                    Daily
                  </TabsTrigger>
                  <TabsTrigger 
                    value="weekly"
                    className="rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary px-6 py-3"
                  >
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger 
                    value="monthly"
                    className="rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary px-6 py-3"
                  >
                    Monthly
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="daily" className="mt-0">
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {getRankedComics('daily').slice(0, 5).map((comic, index) => (
                      <div
                        key={comic.id}
                        className="flex items-center gap-4 p-4 transition-colors cursor-pointer border-b border-border last:border-b-0"
                        onClick={() => onComicSelect(comic)}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                          index === 1 ? 'bg-gray-400/20 text-gray-400' :
                          index === 2 ? 'bg-orange-600/20 text-orange-600' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          <span className="text-sm">{index + 1}</span>
                        </div>
                        <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                          <ImageWithFallback
                            src={comic.coverImage}
                            alt={comic.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate">{comic.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">{comic.author}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-yellow-400 flex items-center gap-1">
                            ⭐ {comic.rating}
                          </div>
                          <div className="text-muted-foreground hidden sm:block">
                            Ch. {comic.totalChapters}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="weekly" className="mt-0">
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {getRankedComics('weekly').slice(0, 5).map((comic, index) => (
                      <div
                        key={comic.id}
                        className="flex items-center gap-4 p-4 transition-colors cursor-pointer border-b border-border last:border-b-0"
                        onClick={() => onComicSelect(comic)}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                          index === 1 ? 'bg-gray-400/20 text-gray-400' :
                          index === 2 ? 'bg-orange-600/20 text-orange-600' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          <span className="text-sm">{index + 1}</span>
                        </div>
                        <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                          <ImageWithFallback
                            src={comic.coverImage}
                            alt={comic.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate">{comic.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">{comic.author}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-yellow-400 flex items-center gap-1">
                            ⭐ {comic.rating}
                          </div>
                          <div className="text-muted-foreground hidden sm:block">
                            Ch. {comic.totalChapters}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="monthly" className="mt-0">
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {getRankedComics('monthly').slice(0, 5).map((comic, index) => (
                      <div
                        key={comic.id}
                        className="flex items-center gap-4 p-4 transition-colors cursor-pointer border-b border-border last:border-b-0"
                        onClick={() => onComicSelect(comic)}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                          index === 1 ? 'bg-gray-400/20 text-gray-400' :
                          index === 2 ? 'bg-orange-600/20 text-orange-600' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          <span className="text-sm">{index + 1}</span>
                        </div>
                        <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                          <ImageWithFallback
                            src={comic.coverImage}
                            alt={comic.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate">{comic.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">{comic.author}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-yellow-400 flex items-center gap-1">
                            ⭐ {comic.rating}
                          </div>
                          <div className="text-muted-foreground hidden sm:block">
                            Ch. {comic.totalChapters}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* All Comics Grid */}
        <div>
          <h2 className="mb-4">All Manhwa</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {comics.map((comic) => (
              <ComicCard
                key={comic.id}
                comic={comic}
                isBookmarked={!!bookmarks[comic.id]}
                onBookmarkToggle={() =>
                  handleBookmarkToggle(comic.id)
                }
                onClick={() => onComicSelect(comic)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}