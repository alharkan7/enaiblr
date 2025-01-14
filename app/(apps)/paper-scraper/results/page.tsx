"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Paper {
  title: string
  authors: string
  year: string
  publisher: string
  doi: string
  type: string
  abstract: string
  url: string
}

export default function Results() {
  const searchParams = useSearchParams()
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch(`/api/papers?${searchParams.toString()}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch papers')
        }

        const data = await response.json()
        const formattedPapers = data.message.items.map((item: any) => ({
          title: item.title ? item.title[0] : "No title",
          authors: item.author ? item.author.map((a: any) => `${a.given || ""} ${a.family || ""}`).join(", ") : "No authors",
          year: item.published ? item.published["date-parts"][0][0] : "No year",
          publisher: item.publisher || "No publisher",
          doi: item.DOI ? `https://doi.org/${item.DOI}` : "",
          type: item.type || "No type",
          abstract: item.abstract ? item.abstract.replace(/<\/?[^>]+(>|$)/g, "") : "No abstract",
          url: item.URL || ""
        }))

        setPapers(formattedPapers)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (searchParams.get("keyword")) {
      fetchPapers()
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading papers...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">{error}</div>
          <Link href="/paper-scraper">
            <Button className="mt-4">Back to Search</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <Link href="/paper-scraper">
            <Button>New Search</Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Authors</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {papers.map((paper, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{paper.title}</TableCell>
                  <TableCell>{paper.authors}</TableCell>
                  <TableCell>{paper.year}</TableCell>
                  <TableCell>{paper.type}</TableCell>
                  <TableCell>
                    {paper.doi && (
                      <a
                        href={paper.doi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Paper
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}