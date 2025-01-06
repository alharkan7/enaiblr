'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useSubscription } from '@/contexts/subscription-context'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { refreshSubscription } = useSubscription()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function updateSubscription() {
      if (!session?.user?.id) {
        router.push('/login')
        return
      }

      const token = searchParams.get('token')
      if (!token) {
        setError('Invalid payment verification')
        setStatus('error')
        return
      }

      try {
        const response = await fetch('/api/subscription/upgrade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to upgrade subscription')
        }

        await refreshSubscription()
        setStatus('success')
      } catch (error) {
        console.error('Failed to update subscription:', error)
        setError(error instanceof Error ? error.message : 'Failed to upgrade subscription')
        setStatus('error')
      }
    }

    updateSubscription()
  }, [session?.user?.id, router, refreshSubscription, searchParams])

  if (status === 'loading') {
    return (
      <div className="container min-h-screen max-w-6xl mx-auto flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center space-y-2 text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tighter text-foreground relative inline-block">
            enaiblr
          </h1>
        </div>
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
              </div>
              <CardTitle className="text-2xl">Processing Payment...</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Please wait while we verify your payment...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="container min-h-screen max-w-6xl mx-auto flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center space-y-2 text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tighter text-foreground relative inline-block">
            enaiblr
          </h1>
        </div>
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-2xl">Payment Verification Failed</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                {error}
              </p>
              <Link
                href="https://wa.me/+6281280077690"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Contact Help
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container min-h-screen max-w-6xl mx-auto flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center space-y-2 text-center mb-8">
        <h1 className="text-5xl font-bold tracking-tighter text-foreground relative inline-block">
          enaiblr
          <span className="absolute top-0 -right-10 text-xs font-medium text-primary-foreground bg-primary rounded-lg px-1 leading-normal tracking-normal">
            PRO
          </span>
        </h1>
        <p className="text-muted-foreground">
          Get Unlimited Access to All Features
        </p>
      </div>
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Thank you for your purchase.<br />Your account has been upgraded to Pro!
            </p>
            <div className="flex justify-center w-full">
              <Link
                href="/apps"
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Access Enaiblr Pro
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
