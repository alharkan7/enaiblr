import Link from "next/link"
import { getCategories } from "@/lib/publications"
import { Badge } from "@/components/ui/badge"

export default async function CategoriesList() {
  const categories = await getCategories()

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {
        categories.map((category) => {
          const slug = category.toLowerCase();
          const displayText = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

          return (
            <Link key={category} href={`/publications/category/${slug}`}>
              <Badge
                variant="secondary"
                className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                {displayText}
              </Badge>
            </Link>
          );
        })
      }
    </div>
  )
}