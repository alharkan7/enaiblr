'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession } from 'next-auth/react'
import { PRO_FEATURES } from '@/lib/constants'
import { AppsHeader } from '@/components/apps-header'

export default function PaymentPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [userData, setUserData] = useState<{ name: string | null, phone: string | null } | null>(null)

  const price = 39000
  const originalPrice = 99000

  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user')
          const data = await response.json()
          setUserData(data)
          if (data.name) setName(data.name)
          if (data.phone) setMobile(data.phone)
        } catch (error) {
          console.error('Failed to fetch user data:', error)
        }
      }
    }
    fetchUserData()
  }, [session?.user?.email])

  const handlePayment = async () => {
    if (!session?.user?.email || !name || !mobile) {
      alert('Please fill in your name and phone number')
      return
    }

    setLoading(true)
    try {
      // Update user profile first
      await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone: mobile,
        }),
      })

      // Then proceed with payment
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          name,
          mobile,
          amount: price,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment')
      }

      // Redirect to Mayar payment page
      window.location.href = data.url
    } catch (error) {
      console.error('Payment error:', error)
      alert('Failed to initiate payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppsHeader />
      <div className="flex flex-1 items-center justify-center">
        <div className="container max-w-6xl py-10">
          <div className="mx-auto flex flex-col items-center space-y-2 text-center">
            <h1 className="text-5xl font-bold tracking-tighter mb-2 text-foreground relative inline-block">
              enaiblr
              <span className="absolute top-0 -right-10 text-xs font-medium text-primary-foreground bg-primary rounded-lg px-1 leading-normal tracking-normal">
                PRO
              </span>
            </h1>
            {/* <p className="text-muted-foreground">
              Get access to all premium features and unlimited usage
            </p> */}
          </div>

          <div className="mx-auto mt-10 max-w-md">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="mb-2">Unlimited Access</CardTitle>
                <CardDescription>
                  Get Access to All Apps and Features
                </CardDescription>
                <div className="!mt-6 !mb-4 text-center">
                  <div className="mb-1">
                    <span className="text-xl text-muted-foreground relative">
                      <span className="relative">
                        Rp{originalPrice.toLocaleString('id-ID')}
                        <span className="absolute left-0 right-0 top-1/2 border-t-2 border-current transform -rotate-12" />
                      </span>
                    </span>
                  </div>
                  <span className="text-4xl !text-primary font-bold">Rp{price.toLocaleString('id-ID')}</span>
                  <span className="text-muted-foreground">/bulan</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    {(isExpanded ? PRO_FEATURES : PRO_FEATURES.slice(0, 8)).map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="h-5 w-5 shrink-0 text-primary mr-1" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {PRO_FEATURES.length > 8 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => setIsExpanded(!isExpanded)}
                      >
                        {isExpanded ? 'Show Less' : `Show All ${PRO_FEATURES.length} Features`}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={session?.user?.email || ''}
                        readOnly
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Phone Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="085xxxxxxxxx"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}