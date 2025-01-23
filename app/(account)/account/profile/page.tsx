'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from 'next-auth/react'
import { ChevronLeft } from "lucide-react"
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react';
import { toast } from "sonner"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export default function UserProfile() {
  const { data: session } = useSession()
  const router = useRouter()
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    createdAt: null as string | null,
    plan: 'free' as 'free' | 'pro',
    validUntil: null as string | null
  })
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user')
          if (!response.ok) {
            throw new Error('Failed to fetch user data')
          }
          const userInfo = await response.json()
          setUser({
            name: userInfo.name || '',
            email: userInfo.email,
            phone: userInfo.phone || '',
            avatar: userInfo.avatar || '',
            createdAt: userInfo.createdAt,
            plan: userInfo.plan || 'free',
            validUntil: userInfo.validUntil || null
          })
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }
    fetchUser()
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated user data to your backend
    console.log("Updated user data:", user)
    console.log("New password:", newPassword)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setIsAvatarLoading(true);
    try {
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update avatar');
      }

      const { url } = await response.json();
      setUser(prev => ({ ...prev, avatar: url }));
      toast.success('Avatar updated', {
        description: 'Your profile picture has been updated successfully.'
      });
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar', {
        description: 'Please try again.'
      });
    } finally {
      setIsAvatarLoading(false);
    }
  }

  const handleSaveChanges = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Password mismatch', {
        description: 'The new password and confirmation do not match.'
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          password: newPassword || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Clear password fields after successful update
      setNewPassword('');
      setConfirmPassword('');

      toast.success('Profile updated', {
        description: 'Your profile has been updated successfully.'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        description: 'Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="flex items-center p-1"
              onClick={() => router.push('/apps')}
            >
              <ChevronLeft className="" />
              Back
            </Button>
            <Button
              variant="outline"
              className="flex items-center outline outline-1 outline-primary/80"
              onClick={() => router.push('/account/affiliate')}
            >
              Affiliate
            </Button>
          </div>
        </CardHeader>

        <CardTitle className="text-2xl font-bold text-center mb-4">Account Settings</CardTitle>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                  disabled={isAvatarLoading}
                />
                <Label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-muted hover:bg-primary bg-opacity-20 text-muted-foreground hover:text-primary-foreground rounded-full p-2 cursor-pointer ${isAvatarLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isAvatarLoading ? 'Uploading...' : 'Edit'}
                </Label>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Change Password
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showNewPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Account Information
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-2">
              <p className="text-left"><strong>Registered</strong></p>
              <p className="text-center">:</p>
              <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }) : 'N/A'}</p>
              <p className="text-left"><strong>Plan</strong></p>
              <p className="text-center">:</p>
              <p className="flex items-start justify-between gap-4">
                {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                <button
                  onClick={() => router.push('/payment')}
                  className="text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/80 rounded-full px-2 py-0.5 transition-colors"
                >
                  {user.plan === 'pro' ? 'Extend Enaiblr Pro ↗' : 'Get Enaiblr Pro ↗'}
                </button>
              </p>
              {user.plan === 'pro' && user.validUntil && (
                <>
                  <p className="text-left"><strong>Expiration</strong></p>
                  <p className="text-center">:</p>
                  <p className="flex items-start justify-between gap-4">
                    {new Date(user.validUntil).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </>
              )}
            </div>

            <Button
              onClick={handleSaveChanges}
              disabled={isSaving || (newPassword !== '' && newPassword !== confirmPassword)}
              className='w-full rounded-full'
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
          <div className="mt-2 pt-2">
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={() => {
                signOut({
                  callbackUrl: '/apps',
                  redirect: true
                });
              }}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
