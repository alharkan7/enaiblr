import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Latest", href: "/publications" },
  { name: "Blog", href: "/publications/category/blog" },
  { name: "Research", href: "/publications/category/research" },
  { name: "Data", href: "/publications/category/data" },
]

export default function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/publications" className="text-xl font-bold text-primary">
              Publications
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}