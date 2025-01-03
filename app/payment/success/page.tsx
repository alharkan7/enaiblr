'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  return (
    <div className="container max-w-6xl py-10">
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Thank you for your purchase. You will receive a confirmation email shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
