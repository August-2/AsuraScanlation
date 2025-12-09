import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Ad } from '../lib/types';
import { getAllAds } from '../lib/data-store';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdModalProps {
  show: boolean;
  onClose: () => void;
  onAdClick?: (ad: Ad) => void;
}

export function AdModal({ show, onClose, onAdClick }: AdModalProps) {
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (show) {
      // Get a random active ad
      const activeAds = getAllAds().filter(ad => ad.isActive);
      if (activeAds.length > 0) {
        const randomAd = activeAds[Math.floor(Math.random() * activeAds.length)];
        setCurrentAd(randomAd);
        setCountdown(5);
      } else {
        onClose();
      }
    }
  }, [show, onClose]);

  useEffect(() => {
    if (show && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [show, countdown]);

  const handleAdClick = () => {
    if (currentAd) {
      if (onAdClick) {
        onAdClick(currentAd);
      }
      
      // Handle special URLs
      if (currentAd.linkUrl === '#premium') {
        // This will be handled by the parent component
        onClose();
      } else if (currentAd.linkUrl === '#browse') {
        // This will be handled by the parent component
        onClose();
      } else if (currentAd.linkUrl.startsWith('http')) {
        window.open(currentAd.linkUrl, '_blank');
        onClose();
      }
    }
  };

  if (!currentAd) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Accessibility labels - visually hidden */}
        <DialogTitle className="sr-only">{currentAd.title}</DialogTitle>
        <DialogDescription className="sr-only">{currentAd.description}</DialogDescription>
        
        {/* Close button with countdown */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="secondary"
            size="icon"
            onClick={onClose}
            disabled={countdown > 0}
            className="rounded-full bg-background/80 backdrop-blur-sm"
          >
            {countdown > 0 ? (
              <span className="text-sm">{countdown}</span>
            ) : (
              <X className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Ad Image */}
        <div className="relative aspect-video">
          <ImageWithFallback
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Ad Content */}
        <div className="p-6 -mt-20 relative z-10">
          <div className="bg-card rounded-lg p-6 border border-border shadow-xl">
            <h2 className="mb-3">{currentAd.title}</h2>
            <p className="text-muted-foreground mb-6">
              {currentAd.description}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleAdClick}
                className="flex-1"
                size="lg"
              >
                {currentAd.buttonText}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={countdown > 0}
                size="lg"
              >
                {countdown > 0 ? `Skip (${countdown}s)` : 'Skip'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}