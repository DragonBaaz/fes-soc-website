"use client"

import { useState, useMemo } from "react"
import { Search as SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllSchemes } from "@/lib/data"

const spotlightSchemes = [
  "Mahamaya Scheme",
  "Pradhan Mantri Awas Yojana",
  "MGNREGA",
  "National Rural Livelihood Mission",
  "Pradhan Mantri Gram Sadak Yojana"
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const allSchemes = getAllSchemes()
  const normalizedQuery = query.toLowerCase()

  const filteredSchemes = useMemo(() => {
    if (!query.trim()) return []
    return allSchemes.filter((scheme) => {
      const name = scheme.name?.toLowerCase() ?? ""
      const objective = scheme.objective?.toLowerCase() ?? ""
      const department = scheme.departmentName?.toLowerCase() ?? ""

      return (
        name.includes(normalizedQuery) ||
        objective.includes(normalizedQuery) ||
        department.includes(normalizedQuery)
      )
    })
  }, [query, normalizedQuery, allSchemes])

  const getClassificationBadge = (classification: string) => {
    const variants = {
      SOC: "bg-[#16A34A] text-white",
      "Near-SOC": "bg-[#B45309] text-white",
      "Non-SOC": "bg-[#B91C1C] text-white"
    }
    return variants[classification as keyof typeof variants] || "bg-gray-500 text-white"
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-[#1B4332] sm:text-5xl">
            Search Schemes
          </h1>
          <p className="text-lg text-gray-600">
            Find and explore government schemes by name, objective, or department
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search schemes, objectives, or departments..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-2 border-[#2D6A4F] focus:border-[#D97706] rounded-lg"
            />
          </div>
        </div>

        {/* Search Results */}
        {query.trim() && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-[#1B4332]">
              Search Results ({filteredSchemes.length})
            </h2>
            {filteredSchemes.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredSchemes.map((scheme, index) => (
                  <Card
                    key={`${scheme.departmentSlug ?? scheme.departmentName ?? "unknown"}-${scheme.id}-${index}`}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-[#1B4332]">
                          {scheme.name}
                        </CardTitle>
                        <Badge className={getClassificationBadge(scheme.classification)}>
                          {scheme.classification}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#2D6A4F] font-medium">
                        {scheme.departmentName}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {scheme.objective}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Score: {scheme.score}/4</span>
                        <span>•</span>
                        <span>T1: {scheme.t1 ? "✓" : "✗"}</span>
                        <span>T2: {scheme.t2 ? "✓" : "✗"}</span>
                        <span>T3: {scheme.t3 ? "✓" : "✗"}</span>
                        <span>T4: {scheme.t4 ? "✓" : "✗"}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No schemes found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or browse all schemes.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Spotlight Schemes (when no query) */}
        {!query.trim() && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-[#1B4332]">
              Spotlight Schemes
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {spotlightSchemes.map((schemeName, index) => {
                const scheme = allSchemes.find(s => s.name === schemeName)
                if (!scheme) return null
                return (
                  <Card
                    key={`${scheme.departmentSlug ?? scheme.departmentName ?? "unknown"}-${scheme.id}-${index}`}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-[#1B4332]">
                          {scheme.name}
                        </CardTitle>
                        <Badge className={getClassificationBadge(scheme.classification)}>
                          {scheme.classification}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#2D6A4F] font-medium">
                        {scheme.departmentName}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {scheme.objective}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Score: {scheme.score}/4</span>
                        <span>•</span>
                        <span>T1: {scheme.t1 ? "✓" : "✗"}</span>
                        <span>T2: {scheme.t2 ? "✓" : "✗"}</span>
                        <span>T3: {scheme.t3 ? "✓" : "✗"}</span>
                        <span>T4: {scheme.t4 ? "✓" : "✗"}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Browse All Link */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Want to explore all schemes? Browse by department or view the dashboard.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/departments"
              className="inline-flex items-center px-6 py-3 bg-[#1B4332] text-white font-medium rounded-lg hover:bg-[#2D6A4F] transition-colors"
            >
              Browse Departments
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-[#D97706] text-white font-medium rounded-lg hover:bg-[#B45309] transition-colors"
            >
              View Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
