'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PaymentPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')

  const handlePayment = async () => {
    if (!email || !mobile) {
      alert('Please fill in your email and phone number')
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_MAYAR_API_KEY
    if (!apiKey) {
      console.error('Mayar API key is not configured')
      alert('Payment system is not properly configured. Please contact support.')
      return
    }

    setLoading(true)
    try {
      // Calculate expiry date 24 hours from now
      const expiry = new Date()
      expiry.setHours(expiry.getHours() + 24)

      const payload = {
        name: 'Enaiblr Pro User',
        email: email,
        amount: 170000,
        mobile: mobile.replace(/\D/g, ''),
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        description: 'Upgrade to Enaiblr Pro - Access all premium features',
        expiredAt: expiry.toISOString()
      }

      console.log('Sending payment request with payload:', payload)

      const response = await fetch('https://api.mayar.id/hl/v1/payment/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      console.log('Payment response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        result
      })

      if (result?.statusCode === 200 && result?.data?.link) {
        window.location.href = result.data.link
      } else {
        console.error('Error creating payment link:', {
          status: response.status,
          statusText: response.statusText,
          result
        })
        alert(`Failed to create payment link: ${result?.messages || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('An error occurred while processing your payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-6xl py-10">
      <div className="mx-auto flex flex-col items-center space-y-6 text-center">
        <h1 className="text-3xl font-bold">Upgrade to Pro</h1>
        <p className="text-muted-foreground">
          Get access to all premium features and unlimited usage
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>
              Access all premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Access to all AI tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Unlimited usage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Priority support</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Phone Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your phone number (e.g., 085xxxxxxxxx)"
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
  )
}