import { NextResponse } from 'next/server'
import { PRO_FEATURES } from '@/lib/constants'
import { createPaymentToken } from '@/lib/db/queries'
import { db } from '@/lib/db'
import { transactions } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function POST(request: Request) {
  const apiKey = process.env.MAYAR_API_KEY
  const apiUrl = process.env.MAYAR_API_URL
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Payment system is not properly configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { email, name, mobile, amount, userId, packageName } = body

    if (!email || !name || !mobile || !amount || !userId || !packageName) {
      return NextResponse.json(
        { error: 'Email, name, mobile, amount, userId and packageName are required' },
        { status: 400 }
      )
    }

    // Generate payment verification token
    const [paymentToken] = await createPaymentToken(userId, packageName)
    
    // Record transaction
    await db.insert(transactions).values({
      userId,
      name: packageName,
      amount: sql`${amount}::numeric`,
      commission: sql`CEIL((${amount} * 0.25) / 1000) * 1000::numeric`,
      status: 'pending',
      affiliate_code: body.referralCode || null,
      createdAt: new Date(),
    })

    // Calculate expiry date 24 hours from now
    const expiry = new Date()
    expiry.setHours(expiry.getHours() + 24)

    const payload = {
      name: name,
      email: email,
      amount:amount,
      mobile: mobile.replace(/\D/g, ''),
      redirectUrl: `${process.env.APP_URL}/payment/success?token=${paymentToken.token}`,
      description: `Enaiblr Pro ${packageName} Unlimited Access:\n${PRO_FEATURES.map(feature => `- ${feature}`).join('\n')}`,
      expired_at: expiry.toISOString(),
      success_url: `${process.env.APP_URL}/payment/success?token=${paymentToken.token}`,
      failure_url: `${process.env.APP_URL}/payment`,
    }

    const response = await fetch('https://api.mayar.id/hl/v1/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    
    if (data?.statusCode === 200 && data?.data?.link) {
      return NextResponse.json({ url: data.data.link })
    } else {
      console.error('Mayar API error:', data)
      return NextResponse.json(
        { error: data?.messages || 'Failed to create payment link' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
