'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Subscription {
  email: string;
  plan: string;
  validUntil: Date | null;
  createdAt: Date;
}

interface EditSubscriptionDialogProps {
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscriptionUpdated: () => void;
}

export function EditSubscriptionDialog({ 
  subscription, 
  open, 
  onOpenChange, 
  onSubscriptionUpdated 
}: EditSubscriptionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plan: subscription.plan,
    validUntil: subscription.validUntil ? format(new Date(subscription.validUntil), "yyyy-MM-dd") : "",
  });

  const handlePlanChange = (value: string) => {
    if (value === 'free') {
      setFormData({ 
        plan: value,
        validUntil: "", // Clear date when switching to Free
      });
    } else {
      // If switching to Pro and no date is set, set it to 30 days from now
      if (!formData.validUntil) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        setFormData({
          plan: value,
          validUntil: format(defaultDate, "yyyy-MM-dd"),
        });
      } else {
        setFormData({
          ...formData,
          plan: value,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.plan === 'pro' && !formData.validUntil) {
      toast.error('Expiration date is required for Pro plan');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/users-subscription/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: subscription.email,
          plan: formData.plan,
          validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
          createdAt: new Date(), // Update createdAt to now
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update subscription');
      }

      toast.success('Subscription updated successfully');
      onSubscriptionUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update subscription:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            {formData.plan === 'pro' 
              ? 'Set subscription expiration date for Pro plan.' 
              : 'Free plan has no expiration date.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right">
                Plan
              </Label>
              <Select
                value={formData.plan}
                onValueChange={handlePlanChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.plan === 'pro' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="validUntil" className="text-right">
                  Expiration
                </Label>
                <Input
                  type="date"
                  id="validUntil"
                  value={formData.validUntil}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
