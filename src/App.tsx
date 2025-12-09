import { useState, useEffect } from 'react';
import { NavigationBar } from './components/navigation-bar';
import { AuthDialog } from './components/auth-dialog';
import { HomePage } from './components/home-page';
import { BrowsePage } from './components/browse-page';
import { BookmarksPage } from './components/bookmarks-page';
import { ComicDetailPage } from './components/comic-detail-page';
import { ReaderPage } from './components/reader-page';
import { ProfilePage } from './components/profile-page';
import { AdminLogin } from './components/admin-login';
import { AdminDashboard } from './components/admin-dashboard';
import { Toaster } from './components/ui/sonner';
import { getUser, logout as authLogout } from './lib/auth';
import { User, Comic, Chapter } from './lib/types';

type Page = 'home' | 'browse' | 'bookmarks' | 'comic-detail' | 'reader' | 'profile' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    
    // Check if accessing admin route
    const hash = window.location.hash;
    if (hash === '#admin') {
      setCurrentPage('admin-login');
    }
  }, []);

  const handleLogin = () => {
    setShowAuthDialog(true);
  };

  const handleAdminLoginClick = () => {
    setShowAuthDialog(false);
    setCurrentPage('admin-login');
  };

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    setCurrentPage('home');
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setCurrentPage('home');
    window.location.hash = '';
  };

  const handleBackToApp = () => {
    setCurrentPage('home');
    window.location.hash = '';
  };

  const handleNavigate = (page: string) => {
    if ((page === 'profile' || page === 'bookmarks') && !user) {
      handleLogin();
      return;
    }
    setCurrentPage(page as Page);
    setSelectedComic(null);
    setSelectedChapter(null);
  };

  const handleNavigateToBookmarks = () => {
    setCurrentPage('bookmarks');
  };

  const handleComicSelect = (comic: Comic) => {
    setSelectedComic(comic);
    setCurrentPage('comic-detail');
  };

  const handleReadChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setCurrentPage('reader');
  };

  const handleBackFromDetail = () => {
    setSelectedComic(null);
    setCurrentPage('home');
  };

  const handleBackFromReader = () => {
    setSelectedChapter(null);
    setCurrentPage('comic-detail');
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <div className="dark min-h-screen">
      {/* Only show NavigationBar if not in admin pages */}
      {currentPage !== 'admin-login' && currentPage !== 'admin-dashboard' && (
        <NavigationBar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'home' && (
        <HomePage
          onComicSelect={handleComicSelect}
          isLoggedIn={!!user}
        />
      )}

      {currentPage === 'browse' && (
        <BrowsePage
          onComicSelect={handleComicSelect}
          isLoggedIn={!!user}
        />
      )}

      {currentPage === 'bookmarks' && (
        <BookmarksPage
          onBack={() => setCurrentPage('home')}
          onComicSelect={handleComicSelect}
          isLoggedIn={!!user}
        />
      )}

      {currentPage === 'comic-detail' && selectedComic && (
        <ComicDetailPage
          comic={selectedComic}
          user={user}
          onBack={handleBackFromDetail}
          onReadChapter={handleReadChapter}
          onUserUpdate={handleUserUpdate}
        />
      )}

      {currentPage === 'reader' && selectedComic && selectedChapter && (
        <ReaderPage
          comic={selectedComic}
          chapter={selectedChapter}
          user={user}
          onBack={handleBackFromReader}
        />
      )}

      {currentPage === 'profile' && user && (
        <ProfilePage
          user={user}
          onUserUpdate={handleUserUpdate}
          onLogout={handleLogout}
          onNavigateToBookmarks={handleNavigateToBookmarks}
        />
      )}

      {currentPage === 'admin-login' && (
        <AdminLogin
          onAdminLogin={handleAdminLogin}
          onBackToApp={handleBackToApp}
        />
      )}

      {currentPage === 'admin-dashboard' && (
        <AdminDashboard
          onLogout={handleAdminLogout}
        />
      )}

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={handleAuthSuccess}
        onAdminLoginClick={handleAdminLoginClick}
      />

      <Toaster />
    </div>
  );
}