'use client'

import SearchPage from './components/SearchPage'
import { Sidebar } from '@/components/Sidebar'
import { useEffect, useState } from 'react'
import { AnimatedBackground } from '@/components/animated-background'

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
    <>
      <Sidebar />
      <AnimatedBackground />
      <SearchPage initialQuery={params.q || ""} />
    </>
  )
}
