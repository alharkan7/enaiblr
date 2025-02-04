'use client'

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/enaiblr",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/enaiblr",
    icon: Linkedin,
  },
  {
    name: "Email",
    href: "mailto:mail@enaiblr.com",
    icon: Mail,
  },
]

export default function PostFooter() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get('email')?.toString()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      const response = await fetch('/api/publications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) throw new Error('Failed to subscribe')

      toast.success("Successfully subscribed to our newsletter!")
      form.reset()
    } catch (error) {
      console.error(error)
      setError("Failed to subscribe. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="border-t bg-muted/30">
      <div className="mt-2 mb-4 py-2 px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md w-full">
          <div className="flex gap-2">
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="bg-background"
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting}>
              Subscribe
            </Button>
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </form>


        <div className="flex flex-col md:flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground text-center md:hidden">
              &copy; {new Date().getFullYear()} enaiblr.org |
            </p>
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              )
            })}
          </div>
          <p className="text-sm text-muted-foreground text-right hidden md:block">
            &copy; {new Date().getFullYear()} enaiblr.org
          </p>
        </div>
      </div>
    </footer>
  )
}