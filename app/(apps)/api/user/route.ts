import { NextResponse } from 'next/server'
import { auth } from '@/app/(auth)/auth'
import { getUser, updateUserProfile } from '@/lib/db/queries'

export async function GET() {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const users = await getUser(session.user.email)
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = users[0]
    return NextResponse.json({
      name: user.name,
      phone: user.phone
    })
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { name, phone } = await request.json()
    
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    const updatedUser = await updateUserProfile(session.user.email, { name, phone })
    return NextResponse.json(updatedUser[0])
  } catch (error) {
    console.error('Failed to update user data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
