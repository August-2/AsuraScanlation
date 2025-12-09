import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Crown, Check, CreditCard, Smartphone, Zap } from 'lucide-react';
import { User } from '../lib/types';
import { toast } from 'sonner@2.0.3';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSuccess: (user: User) => void;
}

type PlanType = 'monthly' | 'yearly';
type PaymentMethod = 'card' | 'kakaopay' | 'naverpay';

export function PaymentModal({ open, onOpenChange, user, onSuccess }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    monthly: {
      price: '₩9,900',
      duration: '/ month',
      savings: null,
    },
    yearly: {
      price: '₩99,000',
      duration: '/ year',
      savings: 'Save 17%',
    },
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    // Basic validation
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCVC) {
        toast.error('Please fill in all card details');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const premiumUntil = new Date();
      if (selectedPlan === 'monthly') {
        premiumUntil.setMonth(premiumUntil.getMonth() + 1);
      } else {
        premiumUntil.setFullYear(premiumUntil.getFullYear() + 1);
      }

      const updatedUser: User = {
        ...user,
        isPremium: true,
        premiumUntil,
      };

      // Save to localStorage
      localStorage.setItem('manhwa_user', JSON.stringify(updatedUser));

      setIsProcessing(false);
      toast.success('Welcome to Premium! 🎉');
      onSuccess(updatedUser);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            <DialogTitle>Upgrade to Premium</DialogTitle>
          </div>
          <DialogDescription>
            Get early access to new chapters and support your favorite creators
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Plan Selection */}
          <div>
            <h3 className="mb-3">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className={`p-4 cursor-pointer transition-all ${
                  selectedPlan === 'monthly'
                    ? 'border-primary ring-2 ring-primary'
                    : 'border-border'
                }`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4>Monthly</h4>
                    <p className="text-muted-foreground text-sm">Perfect for trying out</p>
                  </div>
                  {selectedPlan === 'monthly' && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-2xl">{plans.monthly.price}</span>
                  <span className="text-muted-foreground text-sm mb-1">{plans.monthly.duration}</span>
                </div>
              </Card>

              <Card
                className={`p-4 cursor-pointer transition-all relative ${
                  selectedPlan === 'yearly'
                    ? 'border-primary ring-2 ring-primary'
                    : 'border-border'
                }`}
                onClick={() => setSelectedPlan('yearly')}
              >
                {plans.yearly.savings && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-purple-600">
                    {plans.yearly.savings}
                  </Badge>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4>Yearly</h4>
                    <p className="text-muted-foreground text-sm">Best value</p>
                  </div>
                  {selectedPlan === 'yearly' && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-2xl">{plans.yearly.price}</span>
                  <span className="text-muted-foreground text-sm mb-1">{plans.yearly.duration}</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Premium Benefits */}
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-purple-600/10 border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-primary" />
              <h4>Premium Benefits</h4>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Read new chapters 7 days early</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Ad-free reading experience</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Support your favorite creators</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Exclusive premium-only content</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Cancel anytime, no commitment</span>
              </li>
            </ul>
          </Card>

          {/* Payment Method Selection */}
          <div>
            <h3 className="mb-3">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
              <div className="space-y-3">
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-primary' : 'border-border'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5" />
                      <span>Credit / Debit Card</span>
                    </Label>
                  </div>
                </Card>

                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    paymentMethod === 'kakaopay' ? 'border-primary' : 'border-border'
                  }`}
                  onClick={() => setPaymentMethod('kakaopay')}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="kakaopay" id="kakaopay" />
                    <Label htmlFor="kakaopay" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="w-5 h-5" />
                      <span>KakaoPay</span>
                    </Label>
                  </div>
                </Card>

                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    paymentMethod === 'naverpay' ? 'border-primary' : 'border-border'
                  }`}
                  onClick={() => setPaymentMethod('naverpay')}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="naverpay" id="naverpay" />
                    <Label htmlFor="naverpay" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="w-5 h-5" />
                      <span>Naver Pay</span>
                    </Label>
                  </div>
                </Card>
              </div>
            </RadioGroup>
          </div>

          {/* Card Details (only shown for card payment) */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '');
                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                    setCardNumber(formatted);
                  }}
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2, 4)}` : value;
                      setCardExpiry(formatted);
                    }}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cardCVC">CVC</Label>
                  <Input
                    id="cardCVC"
                    placeholder="123"
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ''))}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <Card className="p-4 bg-accent">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{plans[selectedPlan].price}</span>
            </div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
              <span className="text-muted-foreground">Tax</span>
              <span>₩0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="text-xl">{plans[selectedPlan].price}</span>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Subscribe Now
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By subscribing, you agree to our Terms of Service and Privacy Policy. 
            You can cancel your subscription anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}