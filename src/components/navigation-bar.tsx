import { useState } from "react";
import {
  Menu,
  X,
  Home,
  BookOpen,
  User,
  Crown,
  BookMarked,
  Shield,
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { User as UserType } from "../lib/types";

interface NavigationBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: UserType | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function NavigationBar({
  currentPage,
  onNavigate,
  user,
  onLogin,
  onLogout,
}: NavigationBarProps) {
  const [open, setOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "browse", label: "Browse", icon: BookOpen },
    { id: "bookmarks", label: "Bookmarks", icon: BookMarked },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="https://asuracomic.net/images/logo.webp"
            alt="AsuraScans Logo"
            className="h-10 w-auto"
          />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentPage === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.isPremium && (
                <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-purple-600">
                  <Crown className="w-4 h-4" />
                  <span className="text-sm">Premium</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate("profile")}
                className="hidden md:flex rounded-full overflow-hidden"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={onLogin}
              className="hidden md:flex"
            >
              Login
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}

                <div className="border-t border-border my-2" />

                {user ? (
                  <>
                    <button
                      onClick={() => {
                        onNavigate("profile");
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg"
                    >
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                      <span>Profile</span>
                    </button>
                    {user.isPremium && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-purple-600 mx-4">
                        <Crown className="w-4 h-4" />
                        <span className="text-sm">
                          Premium Member
                        </span>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        onLogout();
                        setOpen(false);
                      }}
                      className="mx-4"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      onLogin();
                      setOpen(false);
                    }}
                    className="mx-4"
                  >
                    Login
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}