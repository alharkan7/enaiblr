import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail } from "lucide-react"

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
  return (
    <footer className="border-t bg-muted/30">
      <div className="mt-2 mb-4 py-2 px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <form className="flex gap-2 max-w-md">
          <Input
            type="email"
            placeholder="Enter your email"
            className="bg-background"
          />
          <Button type="submit">Subscribe</Button>
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