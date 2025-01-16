import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('keyword')
    const limit = searchParams.get('limit') || '10'
    
    let url = `https://api.crossref.org/works?query=${keyword}&rows=${limit}`
    let filters = []

    if (searchParams.get('yearStart') && searchParams.get('yearEnd')) {
      filters.push(`from-pub-date:${searchParams.get('yearStart')},until-pub-date:${searchParams.get('yearEnd')}`)
    }

    if (searchParams.get('type')) {
      filters.push(`type:${searchParams.get('type')}`)
    }

    // if (searchParams.get('openAccess') === 'true') {
    //   filters.push('is-oa:true')
    // }

    if (filters.length > 0) {
      url += `&filter=${filters.join(',')}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch papers')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch papers' },
      { status: 500 }
    )
  }
}
