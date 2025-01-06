'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useSubscription } from '@/contexts/subscription-context'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { refreshSubscription } = useSubscription()

  useEffect(() => {
    async function updateSubscription() {
      if (!session?.user?.id) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch('/api/subscription/upgrade', {
          method: 'POST',
        })
        
        if (!response.ok) {
          throw new Error('Failed to upgrade subscription')
        }

        await refreshSubscription()
      } catch (error) {
        console.error('Failed to update subscription:', error)
        router.push('/dashboard?subscription=error')
      }
    }

    updateSubscription()
  }, [session?.user?.id, router, refreshSubscription])

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
            <p className="text-muted-foreground">
              Thank you for your purchase. Your account has been upgraded to Pro!
            </p>
          </CardContent>
        </Card>
        <div className="flex justify-center w-full">
          <Link
            href="/apps"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Access Enaiblr Pro
          </Link>
        </div>
      </div>
    </div>
  )
}
