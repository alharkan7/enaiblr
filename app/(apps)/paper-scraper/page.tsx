"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    keyword: "",
    limit: 10,
    type: "",
    yearStart: "",
    yearEnd: "",
    openAccess: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams = new URLSearchParams({
      keyword: formData.keyword,
      limit: formData.limit.toString(),
      type: formData.type,
      yearStart: formData.yearStart,
      yearEnd: formData.yearEnd,
      openAccess: formData.openAccess.toString()
    })
    router.push(`/paper-scraper/results?${searchParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Paper Search</h1>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Input 
                type="text" 
                placeholder="Enter keywords to search papers" 
                className="text-lg"
                value={formData.keyword}
                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="limit">Limit</Label>
                <Input 
                  type="number" 
                  id="limit" 
                  placeholder="Number of results"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: parseInt(e.target.value) || 10 })}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="journal-article">Journal Article</SelectItem>
                    <SelectItem value="book-chapter">Book Chapter</SelectItem>
                    <SelectItem value="proceedings-article">Conference Paper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year-start">Year (Start)</Label>
                <Input 
                  type="number" 
                  id="year-start" 
                  placeholder="Start year"
                  value={formData.yearStart}
                  onChange={(e) => setFormData({ ...formData, yearStart: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="year-end">Year (End)</Label>
                <Input 
                  type="number" 
                  id="year-end" 
                  placeholder="End year"
                  value={formData.yearEnd}
                  onChange={(e) => setFormData({ ...formData, yearEnd: e.target.value })}
                />
              </div>
            </div>
            {/* <div className="flex items-center space-x-2 mb-6">
              <Checkbox 
                id="open-access" 
                checked={formData.openAccess}
                onCheckedChange={(checked) => setFormData({ ...formData, openAccess: checked as boolean })}
              />
              <Label htmlFor="open-access">Open Access only</Label>
            </div> */}
            <Button type="submit" className="w-full">Search Papers</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
