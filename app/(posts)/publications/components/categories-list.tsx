import Link from "next/link"
import { getCategories } from "@/lib/publications"
import { Badge } from "@/components/ui/badge"

export default async function CategoriesList() {
  const categories = await getCategories()

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <Link key={category} href={`/blog/category/${category}`}>
          <Badge
            variant="secondary"
            className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
          >
            {category}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
