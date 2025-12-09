import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Crown, Lock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdminLoginProps {
  onAdminLogin: () => void;
  onBackToApp: () => void;
}

export function AdminLogin({ onAdminLogin, onBackToApp }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'admin123') {
      setIsLoading(true);
      setTimeout(() => {
        toast.success('Welcome back, Admin!');
        onAdminLogin();
        setIsLoading(false);
      }, 1000);
    } else {
      toast.error('Invalid credentials. Try username: admin, password: admin123');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl mb-2">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Demo credentials for testing:
            </p>
            <div className="bg-accent/50 rounded-lg p-3 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Username:</span>
                <span>admin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Password:</span>
                <span>admin123</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={onBackToApp}
              className="text-sm"
            >
              ← Back to Main App
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
