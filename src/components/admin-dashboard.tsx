import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  BookOpen, 
  Crown, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Plus,
  Save,
  Calendar,
  Lock,
  Unlock,
  RefreshCw,
  DollarSign,
  Eye,
  EyeOff
} from 'lucide-react';
import { Comic, Chapter, Ad } from '../lib/types';
import { 
  getAllComics, 
  getChapters, 
  createComic, 
  updateComic, 
  deleteComic,
  createChapter,
  updateChapter,
  deleteChapter,
  getAllAds,
  createAd,
  updateAd,
  deleteAd,
  resetData
} from '../lib/data-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [comics, setComics] = useState<Comic[]>([]);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [editingComic, setEditingComic] = useState<Comic | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [showComicDialog, setShowComicDialog] = useState(false);
  const [showChapterDialog, setShowChapterDialog] = useState(false);
  const [showAdDialog, setShowAdDialog] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const loadComics = () => {
    const comicsData = getAllComics();
    setComics(comicsData);
  };

  const loadChapters = () => {
    if (selectedComic) {
      const chaptersData = getChapters(selectedComic.id);
      setChapters(chaptersData);
    }
  };

  const loadAds = () => {
    const adsData = getAllAds();
    setAds(adsData);
  };

  useEffect(() => {
    loadComics();
    loadAds();
  }, []);

  useEffect(() => {
    loadChapters();
  }, [selectedComic]);

  const handleAddComic = () => {
    setIsCreatingNew(true);
    setEditingComic({
      id: `comic-${Date.now()}`,
      title: '',
      author: '',
      coverImage: '',
      description: '',
      genres: [],
      rating: 0,
      status: 'ongoing',
      totalChapters: 0,
    });
    setShowComicDialog(true);
  };

  const handleSaveComic = () => {
    if (!editingComic) return;

    if (!editingComic.title || !editingComic.author) {
      toast.error('Please fill in title and author');
      return;
    }

    if (isCreatingNew) {
      createComic(editingComic);
      toast.success('Comic created successfully');
    } else {
      updateComic(editingComic.id, editingComic);
      toast.success('Comic updated successfully');
    }

    loadComics();
    setShowComicDialog(false);
    setEditingComic(null);
    setIsCreatingNew(false);
  };

  const handleDeleteComic = (comicId: string) => {
    if (confirm('Are you sure you want to delete this comic? All chapters will be deleted.')) {
      deleteComic(comicId);
      loadComics();
      if (selectedComic?.id === comicId) {
        setSelectedComic(null);
      }
      toast.success('Comic deleted successfully');
    }
  };

  const handleAddChapter = () => {
    if (!selectedComic) return;

    setIsCreatingNew(true);
    const nextNumber = chapters.length + 1;
    setEditingChapter({
      id: `${selectedComic.id}-${nextNumber}`,
      comicId: selectedComic.id,
      number: nextNumber,
      title: `Chapter ${nextNumber}: `,
      releaseDate: new Date(),
      premiumReleaseDate: new Date(),
      isLocked: false,
      pages: [],
    });
    setShowChapterDialog(true);
  };

  const handleSaveChapter = () => {
    if (!editingChapter) return;

    if (!editingChapter.title) {
      toast.error('Please fill in chapter title');
      return;
    }

    if (isCreatingNew) {
      createChapter(editingChapter);
      toast.success('Chapter created successfully');
    } else {
      updateChapter(editingChapter.comicId, editingChapter.id, editingChapter);
      toast.success('Chapter updated successfully');
    }

    loadChapters();
    loadComics(); // Reload to update totalChapters count
    setShowChapterDialog(false);
    setEditingChapter(null);
    setIsCreatingNew(false);
  };

  const handleDeleteChapter = (chapter: Chapter) => {
    if (confirm('Are you sure you want to delete this chapter?')) {
      deleteChapter(chapter.comicId, chapter.id);
      loadChapters();
      loadComics(); // Reload to update totalChapters count
      toast.success('Chapter deleted successfully');
    }
  };

  const handleToggleChapterLock = (chapter: Chapter) => {
    updateChapter(chapter.comicId, chapter.id, { isLocked: !chapter.isLocked });
    loadChapters();
    toast.success(`Chapter ${chapter.isLocked ? 'unlocked' : 'locked'}`);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
      resetData();
      loadComics();
      setSelectedComic(null);
      toast.success('Data reset successfully');
    }
  };

  const handleAddAd = () => {
    setIsCreatingNew(true);
    setEditingAd({
      id: `ad-${Date.now()}`,
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      buttonText: 'Learn More',
      isActive: true,
      showFrequency: 'every-2',
      createdAt: new Date(),
    });
    setShowAdDialog(true);
  };

  const handleSaveAd = () => {
    if (!editingAd) return;

    if (!editingAd.title || !editingAd.imageUrl || !editingAd.linkUrl) {
      toast.error('Please fill in title, image URL, and link');
      return;
    }

    if (isCreatingNew) {
      createAd(editingAd);
      toast.success('Ad created successfully');
    } else {
      updateAd(editingAd.id, editingAd);
      toast.success('Ad updated successfully');
    }

    loadAds();
    setShowAdDialog(false);
    setEditingAd(null);
    setIsCreatingNew(false);
  };

  const handleDeleteAd = (adId: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      deleteAd(adId);
      loadAds();
      toast.success('Ad deleted successfully');
    }
  };

  const handleToggleAdActive = (ad: Ad) => {
    updateAd(ad.id, { isActive: !ad.isActive });
    loadAds();
    toast.success(`Ad ${ad.isActive ? 'deactivated' : 'activated'}`);
  };

  // Calculate stats dynamically
  const totalChapters = comics.reduce((sum, comic) => sum + comic.totalChapters, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your manhwa platform</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleResetData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Data
              </Button>
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <h3 className="text-2xl mb-1">1,247</h3>
                <p className="text-xs text-green-500">+23 today</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Premium Users</p>
                <h3 className="text-2xl mb-1">389</h3>
                <p className="text-xs text-muted-foreground">31.2% conversion</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Comics</p>
                <h3 className="text-2xl mb-1">{comics.length}</h3>
                <p className="text-xs text-muted-foreground">{totalChapters} chapters</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenue (MTD)</p>
                <h3 className="text-2xl mb-1">₩4,850,000</h3>
                <p className="text-xs text-green-500">+12.5% vs last month</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="comics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="comics">Comics</TabsTrigger>
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="ads">Ads</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Comics Tab */}
          <TabsContent value="comics" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2>Manage Comics ({comics.length})</h2>
              <Button onClick={handleAddComic}>
                <Plus className="w-4 h-4 mr-2" />
                Add Comic
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comics.map((comic) => (
                <Card key={comic.id} className="overflow-hidden">
                  <div className="relative aspect-[3/4]">
                    {comic.coverImage ? (
                      <ImageWithFallback
                        src={comic.coverImage}
                        alt={comic.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-2 left-2">{comic.status}</Badge>
                  </div>
                  <div className="p-4">
                    <h4 className="mb-1 line-clamp-1">{comic.title || 'Untitled'}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{comic.author || 'Unknown'}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {comic.genres.slice(0, 2).map(genre => (
                        <Badge key={genre} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-yellow-400">⭐ {comic.rating}</span>
                      <span className="text-muted-foreground">{comic.totalChapters} chapters</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setIsCreatingNew(false);
                          setEditingComic(comic);
                          setShowComicDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedComic(comic);
                        }}
                      >
                        Chapters
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteComic(comic.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chapters Tab */}
          <TabsContent value="chapters" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2>Manage Chapters</h2>
                {selectedComic && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Editing: {selectedComic.title} ({chapters.length} chapters)
                  </p>
                )}
              </div>
              {selectedComic && (
                <Button onClick={handleAddChapter}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Chapter
                </Button>
              )}
            </div>

            {selectedComic ? (
              chapters.length > 0 ? (
                <div className="space-y-2">
                  {chapters.map((chapter) => (
                    <Card key={chapter.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4>Chapter {chapter.number}: {chapter.title.split(': ')[1] || chapter.title}</h4>
                            {chapter.isLocked ? (
                              <Badge variant="destructive" className="gap-1">
                                <Lock className="w-3 h-3" />
                                Premium Only
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1">
                                <Unlock className="w-3 h-3" />
                                Free
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Premium: {new Date(chapter.premiumReleaseDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Free: {new Date(chapter.releaseDate).toLocaleDateString()}
                            </div>
                            <div>Pages: {chapter.pages.length}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={chapter.isLocked ? "outline" : "secondary"}
                            onClick={() => handleToggleChapterLock(chapter)}
                          >
                            {chapter.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsCreatingNew(false);
                              setEditingChapter(chapter);
                              setShowChapterDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteChapter(chapter)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12">
                  <div className="text-center text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="mb-4">No chapters yet</p>
                    <Button onClick={handleAddChapter}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Chapter
                    </Button>
                  </div>
                </Card>
              )
            ) : (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a comic from the Comics tab to manage its chapters</p>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Ads Tab */}
          <TabsContent value="ads" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2>Manage Ads ({ads.length})</h2>
              <Button onClick={handleAddAd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Ad
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ads.map((ad) => (
                <Card key={ad.id} className="overflow-hidden">
                  <div className="relative aspect-[3/4]">
                    {ad.imageUrl ? (
                      <ImageWithFallback
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-2 left-2">{ad.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  <div className="p-4">
                    <h4 className="mb-1 line-clamp-1">{ad.title || 'Untitled'}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{ad.linkUrl || 'Unknown'}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-yellow-400">⭐ {ad.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setIsCreatingNew(false);
                          setEditingAd(ad);
                          setShowAdDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteAd(ad.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2>User Management</h2>
              <div className="flex gap-2">
                <Input placeholder="Search users..." className="w-64" />
              </div>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left p-4">User</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Joined</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: '1', username: 'reader123', email: 'reader@example.com', isPremium: true, joinDate: '2024-01-15' },
                      { id: '2', username: 'manhwa_fan', email: 'fan@example.com', isPremium: false, joinDate: '2024-02-20' },
                      { id: '3', username: 'premium_user', email: 'premium@example.com', isPremium: true, joinDate: '2024-03-10' },
                      { id: '4', username: 'casual_reader', email: 'casual@example.com', isPremium: false, joinDate: '2024-04-05' },
                      { id: '5', username: 'vip_member', email: 'vip@example.com', isPremium: true, joinDate: '2024-05-12' },
                    ].map((user) => (
                      <tr key={user.id} className="border-b border-border last:border-0">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <span>{user.username}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{user.email}</td>
                        <td className="p-4">
                          {user.isPremium ? (
                            <Badge className="bg-gradient-to-r from-primary to-purple-600">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          ) : (
                            <Badge variant="outline">Free</Badge>
                          )}
                        </td>
                        <td className="p-4 text-muted-foreground">{user.joinDate}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Comic Dialog */}
      <Dialog open={showComicDialog} onOpenChange={setShowComicDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreatingNew ? 'Add New Comic' : 'Edit Comic'}</DialogTitle>
            <DialogDescription>
              {isCreatingNew ? 'Add a new comic to your library' : 'Update comic information'}
            </DialogDescription>
          </DialogHeader>
          
          {editingComic && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={editingComic.title}
                  onChange={(e) => setEditingComic({ ...editingComic, title: e.target.value })}
                  placeholder="Enter comic title"
                />
              </div>

              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={editingComic.author}
                  onChange={(e) => setEditingComic({ ...editingComic, author: e.target.value })}
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={editingComic.description}
                  onChange={(e) => setEditingComic({ ...editingComic, description: e.target.value })}
                  placeholder="Enter comic description"
                />
              </div>

              <div>
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  value={editingComic.coverImage}
                  onChange={(e) => setEditingComic({ ...editingComic, coverImage: e.target.value })}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editingComic.rating}
                    onChange={(e) => setEditingComic({ ...editingComic, rating: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingComic.status}
                    onValueChange={(value: 'ongoing' | 'completed') => 
                      setEditingComic({ ...editingComic, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="genres">Genres (comma-separated)</Label>
                <Input
                  id="genres"
                  value={editingComic.genres.join(', ')}
                  onChange={(e) => setEditingComic({ 
                    ...editingComic, 
                    genres: e.target.value.split(',').map(g => g.trim()).filter(g => g)
                  })}
                  placeholder="Action, Fantasy, Adventure"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowComicDialog(false);
                    setEditingComic(null);
                    setIsCreatingNew(false);
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveComic}>
                  <Save className="w-4 h-4 mr-2" />
                  {isCreatingNew ? 'Create Comic' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Chapter Dialog */}
      <Dialog open={showChapterDialog} onOpenChange={setShowChapterDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{isCreatingNew ? 'Add New Chapter' : 'Edit Chapter'}</DialogTitle>
            <DialogDescription>
              {isCreatingNew ? 'Add a new chapter' : 'Update chapter details'}
            </DialogDescription>
          </DialogHeader>
          
          {editingChapter && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="chapterTitle">Chapter Title *</Label>
                <Input
                  id="chapterTitle"
                  value={editingChapter.title}
                  onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
                  placeholder="Chapter 1: The Beginning"
                />
              </div>

              <div>
                <Label htmlFor="chapterNumber">Chapter Number</Label>
                <Input
                  id="chapterNumber"
                  type="number"
                  value={editingChapter.number}
                  onChange={(e) => setEditingChapter({ ...editingChapter, number: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isLocked"
                  checked={editingChapter.isLocked}
                  onChange={(e) => setEditingChapter({ ...editingChapter, isLocked: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isLocked" className="cursor-pointer">
                  Premium Only (Locked for free users)
                </Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowChapterDialog(false);
                    setEditingChapter(null);
                    setIsCreatingNew(false);
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveChapter}>
                  <Save className="w-4 h-4 mr-2" />
                  {isCreatingNew ? 'Create Chapter' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Ad Dialog */}
      <Dialog open={showAdDialog} onOpenChange={setShowAdDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{isCreatingNew ? 'Add New Ad' : 'Edit Ad'}</DialogTitle>
            <DialogDescription>
              {isCreatingNew ? 'Add a new ad' : 'Update ad details'}
            </DialogDescription>
          </DialogHeader>
          
          {editingAd && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="adTitle">Ad Title *</Label>
                <Input
                  id="adTitle"
                  value={editingAd.title}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  placeholder="Ad Title"
                />
              </div>

              <div>
                <Label htmlFor="adImageUrl">Ad Image URL *</Label>
                <Input
                  id="adImageUrl"
                  value={editingAd.imageUrl}
                  onChange={(e) => setEditingAd({ ...editingAd, imageUrl: e.target.value })}
                  placeholder="https://example.com/ad.jpg"
                />
              </div>

              <div>
                <Label htmlFor="adLinkUrl">Ad Link URL *</Label>
                <Input
                  id="adLinkUrl"
                  value={editingAd.linkUrl}
                  onChange={(e) => setEditingAd({ ...editingAd, linkUrl: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="adButtonText">Ad Button Text</Label>
                <Input
                  id="adButtonText"
                  value={editingAd.buttonText}
                  onChange={(e) => setEditingAd({ ...editingAd, buttonText: e.target.value })}
                  placeholder="Learn More"
                />
              </div>

              <div>
                <Label htmlFor="adDescription">Ad Description</Label>
                <Textarea
                  id="adDescription"
                  rows={4}
                  value={editingAd.description}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                  placeholder="Enter ad description"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingAd.isActive}
                  onChange={(e) => setEditingAd({ ...editingAd, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active
                </Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAdDialog(false);
                    setEditingAd(null);
                    setIsCreatingNew(false);
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveAd}>
                  <Save className="w-4 h-4 mr-2" />
                  {isCreatingNew ? 'Create Ad' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}