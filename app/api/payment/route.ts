import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const apiKey = process.env.MAYAR_API_KEY
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Payment system is not properly configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { email, mobile } = body

    // Calculate expiry date 24 hours from now
    const expiry = new Date()
    expiry.setHours(expiry.getHours() + 24)

    const payload = {
      amount: 170000,
      description: 'Upgrade to Enaiblr Pro - Access all premium features',
      email: email,
      mobile: mobile.replace(/\D/g, ''),
      expired_at: expiry.toISOString(),
      success_url: `${process.env.APP_URL}/payment/success`,
      failure_url: `${process.env.APP_URL}/payment`,
      customer_name: 'Enaiblr Pro User'
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
