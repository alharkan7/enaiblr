import BlogHeader from "./components/header"
import BlogFooter from "./components/footer"

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
          {children}
        </div>
      </main>
      <BlogFooter />
    </div>
  )
}