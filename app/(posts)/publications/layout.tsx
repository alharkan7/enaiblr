import BlogFooter from "./components/footer"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 pb-12 max-w-4xl">
          {children}
        </div>
      </main>
      <BlogFooter />
    </div>
  )
}