import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

const footerLinks = {
  Resources: [
    { name: "Documentation", href: "/docs" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  Categories: [
    { name: "Tutorials", href: "/blog/category/tutorials" },
    { name: "News", href: "/blog/category/news" },
    { name: "Technology", href: "/blog/category/technology" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
}

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/enaiblr",
    icon: Github,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/enaiblr",
    icon: Twitter,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/enaiblr",
    icon: Linkedin,
  },
  {
    name: "Email",
    href: "mailto:contact@enaiblr.com",
    icon: Mail,
  },
]

export default function PostFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subscribe to our newsletter</h3>
            <p className="text-muted-foreground">
              Get the latest articles and insights delivered to your inbox.
            </p>
            <form className="flex gap-2 max-w-md">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="grid gap-8 sm:grid-cols-3">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
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
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Enaiblr. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </footer>
  )
}