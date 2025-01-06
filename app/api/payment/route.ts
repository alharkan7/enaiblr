import { NextResponse } from 'next/server'
import { PRO_FEATURES } from '@/lib/constants'

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
    const { email, name, mobile, amount } = body

    if (!email || !name || !mobile || !amount) {
      return NextResponse.json(
        { error: 'Email, name, mobile and amount are required' },
        { status: 400 }
      )
    }

    // Calculate expiry date 24 hours from now
    const expiry = new Date()
    expiry.setHours(expiry.getHours() + 24)

    const payload = {
      amount,
      description: `Enaiblr Pro Unlimited Access:\n${PRO_FEATURES.map(feature => `- ${feature}`).join('\n')}`,
      email: email,
      expired_at: expiry.toISOString(),
      success_url: `${process.env.APP_URL}/payment/success`,
      failure_url: `${process.env.APP_URL}/payment`,
      name,
      mobile: mobile.replace(/\D/g, ''),
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
