import ResearchHeader from "../research/components/header"
import ResearchFooter from "../research/components/footer"

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ResearchHeader />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {children}
        </div>
      </main>
      <ResearchFooter />
    </div>
  )
}