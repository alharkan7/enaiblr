'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession } from 'next-auth/react'
import { PRO_FEATURES } from '@/lib/constants'
import { AppsHeader } from '@/components/apps-header'
import { subscriptionPackagesUS } from '@/config/subscriptionPackages'

export default function PaymentPage() {
  const { data: session } = useSession()
  const [loadingPackage, setLoadingPackage] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [activePackageIndex, setActivePackageIndex] = useState<number | null>(null)
  const [userData, setUserData] = useState<{ name: string | null, phone: string | null } | null>(null)

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

  useEffect(() => {
    // Check URL parameters
    const params = new URLSearchParams(window.location.search)
    const refCode = params.get('ref')

    if (refCode) {
      // If URL has referral code, save it and use it
      localStorage.setItem('referralCode', refCode)
      setReferralCode(refCode)
    } else {
      // If no URL parameter, check localStorage
      const savedCode = localStorage.getItem('referralCode')
      if (savedCode) {
        setReferralCode(savedCode)
      }
    }
  }, []) // This effect runs only once on component mount

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const refCode = params.get('ref')
      if (refCode) {
        setReferralCode(refCode)
      }
    }
  }, [window?.location?.search]) // This effect runs when URL changes

  const handlePayment = async (pkg: typeof subscriptionPackagesUS[0], index: number) => {
    if (!session?.user?.email || !name || !mobile) {
      alert('Please fill in your name and phone number')
      return
    }

    setLoadingPackage(index)
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
          amount: pkg.priceTotal,
          userId: session.user.id,
          packageName: pkg.name,
          referralCode,
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
      setLoadingPackage(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative">
        <div className="[&>header]:!static">
          <AppsHeader />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="container max-w-6xl py-10">
          <div className="mx-auto flex flex-col items-center space-y-2 text-center">
            <h1 className="text-5xl font-bold tracking-tighter mb-2 text-foreground relative inline-block">
              enaiblr
              <span className="absolute top-0 -right-10 text-xs font-medium text-primary-foreground bg-primary rounded-lg px-1 leading-normal tracking-normal">
                PRO
              </span>
            </h1>
            <p className="text-muted-foreground">
              Get Unlimited Access to All Features
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-4xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subscriptionPackagesUS.map((pkg, index) => (
                <Card key={index}>
                  <CardHeader className="text-center">
                    <CardTitle className="mb-2">{pkg.title}</CardTitle>
                    <div className="!mb-2 text-center">
                      <div className="mb-3">
                        <span className="text-xl text-muted-foreground relative">
                          <span className="relative">
                            ${pkg.priceOriginal.toLocaleString('en-US')}
                            <span className="absolute left-0 right-0 top-1/2 border-t-2 border-current transform -rotate-12" />
                          </span>
                          <span className="ml-2 text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">{pkg.discount}% Off</span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 items-center">
                        <div className="flex items-center">
                          <span className="text-4xl !text-primary font-bold">${pkg.price.toLocaleString('en-US')}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        <div className="inline-block text-sm bg-secondary text-muted-foreground rounded-full py-1 px-2">${pkg.priceTotal.toLocaleString('en-US')} Total</div>
                      </div>
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
                    </div>

                    <div className={`mx-auto mt-6 max-w-md px-4 ${activePackageIndex === index ? '' : 'hidden'}`}>
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
                            placeholder="08xxxxxxxxxx"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                          />
                        </div>
                        {activePackageIndex !== null && (
                          <div className="space-y-2">
                            <Label htmlFor="referralCode">Referral Code</Label>
                            <Input
                              id="referralCode"
                              type="text"
                              placeholder="Enter referral code (optional)"
                              value={referralCode}
                              onChange={(e) => setReferralCode(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => {
                        if (!session?.user?.email || !name || !mobile) {
                          setActivePackageIndex(index)
                        } else {
                          handlePayment(pkg, index)
                        }
                      }}
                      disabled={loadingPackage !== null}
                      className="w-full"
                    >
                      {loadingPackage === index ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please wait
                        </>
                      ) : (
                        'Upgrade Now'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}