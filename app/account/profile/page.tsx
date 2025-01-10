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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

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
            <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
            <div className="w-[72px]" /> {/* Spacer to center the title */}
          </div>
        </CardHeader>
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
                />
                <Label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer"
                >
                  Edit
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
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
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
                  {user.plan === 'pro' ? 'Extend 30 Days ↗' : 'Get Enaiblr Pro ↗'}
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

            <Button type="submit" className="w-full rounded-full !mt-10">Save Changes</Button>
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
