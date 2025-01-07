'use client'

import SearchPage from './components/SearchPage'
import { useEffect, useState } from 'react'

export default function Page({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const [params, setParams] = useState<{ q?: string }>({});

  useEffect(() => {
    searchParams.then(setParams);
  }, [searchParams]);

  return (
      <SearchPage initialQuery={params.q || ""} />
  )
}
