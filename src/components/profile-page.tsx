import { useState, useEffect, useRef } from 'react';
import { User, Crown, BookMarked, LogOut, Calendar, Camera, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User as UserType } from '../lib/types';
import { PaymentModal } from './payment-modal';
import { toast } from 'sonner@2.0.3';

interface ProfilePageProps {
  user: UserType;
  onUserUpdate: (user: UserType) => void;
  onLogout: () => void;
  onNavigateToBookmarks: () => void;
}

export function ProfilePage({ user, onUserUpdate, onLogout, onNavigateToBookmarks }: ProfilePageProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpgradeToPremium = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (updatedUser: UserType) => {
    onUserUpdate(updatedUser);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProfilePicture(imageUrl);
        
        // Update user with new profile picture
        const updatedUser = {
          ...user,
          profilePicture: imageUrl,
        };
        localStorage.setItem('manhwa_user', JSON.stringify(updatedUser));
        onUserUpdate(updatedUser);
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setProfilePicture(url);
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      username,
      profilePicture,
    };
    localStorage.setItem('manhwa_user', JSON.stringify(updatedUser));
    onUserUpdate(updatedUser);
    setIsEditing(false);
    toast.success('Profile updated!');
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full">
              {/* Profile Picture */}
              <div className="relative group">
                <div 
                  className="w-20 h-20 rounded-full bg-primary flex items-center justify-center overflow-hidden cursor-pointer border-2 border-primary"
                  onClick={handleImageClick}
                >
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt={username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-primary-foreground" />
                  )}
                </div>
                <div 
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-100 transition-opacity cursor-pointer"
                  onClick={handleImageClick}
                >
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* User Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="username" className="text-xs">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profileUrl" className="text-xs">Profile Picture URL (optional)</Label>
                      <Input
                        id="profileUrl"
                        value={profilePicture}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        placeholder="https://..."
                        className="h-8"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="mb-1">{user.username}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full md:w-auto">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 md:flex-initial">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} className="flex-1 md:flex-initial">
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="flex-1 md:flex-initial">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" onClick={onLogout} className="flex-1 md:flex-initial">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Premium Status */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Crown className={`w-5 h-5 ${user.isPremium ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3>Premium Membership</h3>
              </div>
              
              {user.isPremium ? (
                <div>
                  <Badge variant="default" className="mb-2 bg-gradient-to-r from-primary to-purple-600">
                    Active Premium Member
                  </Badge>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Valid until {user.premiumUntil?.toLocaleDateString()}
                  </p>
                  <div className="mt-4 p-4 bg-accent rounded-lg">
                    <h4 className="mb-2">Premium Benefits</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Read new chapters 7 days early</li>
                      <li>• Ad-free reading experience</li>
                      <li>• Support your favorite authors</li>
                      <li>• Exclusive premium-only content</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-4">
                    Upgrade to Premium to get early access to new chapters and support creators
                  </p>
                  <Button onClick={handleUpgradeToPremium}>
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="p-6 cursor-pointer transition-colors"
            onClick={onNavigateToBookmarks}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookMarked className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1">My Bookmarks</h3>
                <p className="text-sm text-muted-foreground">View all saved comics</p>
              </div>
            </div>
          </Card>
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