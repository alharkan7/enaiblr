import { type PropsWithChildren } from "react"
import BlogHeader from "../components/header"
import BlogFooter from "../components/footer"
import CategoriesList from "../components/categories-list"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <header className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              Explore our latest thoughts, insights, and stories about AI, technology, and innovation.
            </p>
            <div className="mt-8">
              <CategoriesList />
            </div>
          </header>
          {children}
        </div>
      </main>
      <BlogFooter />
    </div>
  )
}