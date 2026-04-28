import type { Metadata } from "next"
import { ComponentSpecPage } from "@/components/chrome/ComponentSpecPage"
import { componentSpecs } from "@/lib/componentSpecs"

const SPEC = componentSpecs.find(c => c.slug === "student-profile-bar-mobile")!

export const metadata: Metadata = {
  title: SPEC.name,
  description: SPEC.description,
}

export default function Page() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Legacy"
      overview={SPEC.description}
    />
  )
}
