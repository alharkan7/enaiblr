'use client'

import SearchPage from './components/SearchPage'
import { useEffect, useState } from 'react'
import { ProGate } from '@/components/pro-gate'

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
    <ProGate>
      <SearchPage initialQuery={params.q || ""} />
    </ProGate>
  )
}
