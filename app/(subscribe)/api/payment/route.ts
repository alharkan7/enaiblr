import { NextResponse } from 'next/server'
import { PRO_FEATURES } from '@/lib/constants'
import { createPaymentToken } from '@/lib/db/queries'
import { getAffiliateByCode } from '@/lib/db/affiliate-queries'
import { db } from '@/lib/db'
import { transactions } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function POST(request: Request) {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY
  const storeId = process.env.LEMON_SQUEEZY_STORE_ID

  if (!apiKey || !storeId) {
    return NextResponse.json(
      { error: 'Payment system is not properly configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { email, name, userId, packageName, amount } = body

    if (!email || !name || !userId || !packageName) {
      return NextResponse.json(
        { error: 'Email, name, userId and packageName are required' },
        { status: 400 }
      )
    }

    // Get the correct variant ID based on package name
    const variantId = packageName === '1 Month'
      ? process.env.LEMON_SQUEEZY_VARIANT_ID_1MONTH
      : process.env.LEMON_SQUEEZY_VARIANT_ID_4MONTH

    if (!variantId) {
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 }
      )
    }

    // Generate payment verification token
    const [paymentToken] = await createPaymentToken(userId, packageName)

    // Get affiliator ID if referral code is provided
    let affiliatorId = null
    if (body.referralCode) {
      const affiliate = await getAffiliateByCode(body.referralCode)
      if (affiliate) {
        affiliatorId = affiliate.userId
      }
    }

    // Record transaction
    await db.insert(transactions).values({
      userId,
      name: packageName,
      amount: sql`${amount}::numeric`,
      commission: sql`ROUND((${amount} * 0.25)::numeric, 2)`,
      status: 'pending',
      affiliate_code: body.referralCode || null,
      affiliator: affiliatorId,
      createdAt: new Date(),
    })

    // Create checkout with Lemon Squeezy
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: storeId
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId
              }
            }
          },
          attributes: {
            custom_price: Math.round(amount * 100), // Convert to cents
            checkout_data: {
              email,
              name,
              custom: {
                user_id: userId,
                payment_token: paymentToken.token,
              }
            },
            product_options: {
              name: `Enaiblr Pro ${packageName}`,
              description: `Enaiblr Pro ${packageName} Unlimited Access:\n${PRO_FEATURES.map(feature => `- ${feature}`).join('\n')}`,
              redirect_url: `${process.env.APP_URL}/payment/success?token=${paymentToken.token}`,
              receipt_button_text: "Access Your Account",
              receipt_link_url: `${process.env.APP_URL}/dashboard`,
              receipt_thank_you_note: "Thank you for subscribing to Enaiblr Pro!"
            },
            checkout_options: {
              embed: false,
              media: true,
              logo: true,
              desc: true,
              discount: true,
              button_color: "#0066FF"
            }
          }
        }
      })
    })

    const data = await response.json()

    if (data?.data?.attributes?.url) {
      return NextResponse.json({ url: data.data.attributes.url })
    } else {
      console.error('Lemon Squeezy API error:', data)
      return NextResponse.json(
        { error: 'Failed to create payment link' },
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
