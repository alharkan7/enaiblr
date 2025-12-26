'use client'

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Logo from "./logo";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/enaiblrorg",
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

const footerLinks = [
  {
    section: "Enaiblr",
    links: [
      { name: "About Us", href: "/" },
      { name: "AI Platform", href: "/apps" },
    ],
  },
  {
    section: "Product",
    links: [
      { name: "Enaiblr Pro", href: "/ai-platform" },
      { name: "Affiliate", href: "/affiliate" },
    ],
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
      <div className="mt-2 mb-4 py-2 px-4 flex flex-col md:flex-row justify-between items-start gap-6">


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

        <div className="grid grid-cols-2 gap-8 sm:gap-16 w-full md:w-auto">
          {footerLinks.map((section) => (
            <div key={section.section} className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-medium">{section.section}</h4>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col w-full md:w-auto md:flex-col items-center md:items-end gap-2">
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="items-end hidden md:flex">
              <Logo />
            </div>
            <p className="text-sm text-muted-foreground text-right hidden md:block">
              &copy; <Link href="/" className="hover:text-primary transition-colors">enaiblr.org</Link>
            </p>
            <div className="flex items-center gap-2 md:hidden">
              <p className="text-sm text-muted-foreground">
                &copy; <Link href="/" className="hover:text-primary transition-colors">enaiblr.org</Link> |
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
                    <Icon className="h-4 w-4" />
                  </Link>
                )
              })}
            </div>
            <div className="hidden md:flex items-end gap-2">
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
                    <Icon className="h-4 w-4" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}