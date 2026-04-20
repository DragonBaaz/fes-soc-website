import { Navbar } from "@/components/navbar"
import { getAllSchemes } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function NearSOCPage() {
  const allSchemes = getAllSchemes()
  const nearSOCSchemes = allSchemes.filter(s => s.classification === "Near-SOC")

  // Group by failing test
  const failsT1 = nearSOCSchemes.filter(s => !s.tests.t1)
  const failsT2 = nearSOCSchemes.filter(s => !s.tests.t2)
  const failsT3 = nearSOCSchemes.filter(s => !s.tests.t3)
  const failsT4 = nearSOCSchemes.filter(s => !s.tests.t4)

  const testSections = [
    {
      testId: "T4",
      testName: "Sustainability Lock",
      schemes: failsT4,
      description: "Add mandatory replenishment rules, extraction/replenishment ratio monitoring (≤1.2), annual monitoring frequency, and financial penalty or O&M fund mechanisms.",
      color: "text-[#DC2626]",
      bgColor: "bg-[#FEE2E2]",
      borderColor: "border-[#DC2626]"
    },
    {
      testId: "T3",
      testName: "Clear Economic Opportunity",
      schemes: failsT3,
      description: "Establish mandated livelihood output indicators, guarantee incremental income ≥₹5,000/HH/year, define at least 1 income pathway, and create market or institutional offtake mechanisms.",
      color: "text-[#D97706]",
      bgColor: "bg-[#FEF3C7]",
      borderColor: "border-[#D97706]"
    },
    {
      testId: "T1",
      testName: "Resource is a Commons",
      schemes: failsT1,
      description: "Establish legal communal ownership (Type A/B/D), formalize community access rights, ensure >50% expenditure on non-private assets, and achieve excludability score ≥1.",
      color: "text-[#8B5CF6]",
      bgColor: "bg-[#F3E8FF]",
      borderColor: "border-[#8B5CF6]"
    },
    {
      testId: "T2",
      testName: "Dwellers Benefit",
      schemes: failsT2,
      description: "Guarantee ≥70% local beneficiaries, ≥40% marginalised beneficiaries, and mandatory community representative body in governance.",
      color: "text-[#0891B2]",
      bgColor: "bg-[#CFFAFE]",
      borderColor: "border-[#0891B2]"
    }
  ].filter(s => s.schemes.length > 0)

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[#1B4332] mb-3">
            Near-SOC Upgrade Watchlist
          </h1>
          <p className="text-xl text-gray-600">
            {nearSOCSchemes.length} schemes passing 3 of 4 SOC tests — one targeted design change away from full compliance
          </p>
        </div>

        {/* Summary Pills */}
        <div className="mb-12 flex flex-wrap gap-3">
          {[
            { testId: "T4", count: failsT4.length, color: "bg-[#FEE2E2] text-[#DC2626]" },
            { testId: "T3", count: failsT3.length, color: "bg-[#FEF3C7] text-[#D97706]" },
            { testId: "T1", count: failsT1.length, color: "bg-[#F3E8FF] text-[#8B5CF6]" },
            { testId: "T2", count: failsT2.length, color: "bg-[#CFFAFE] text-[#0891B2]" }
          ].filter(p => p.count > 0).map(pill => (
            <div key={pill.testId} className={`${pill.color} px-4 py-2 rounded-full font-bold text-sm`}>
              {pill.testId} Fails: {pill.count}
            </div>
          ))}
        </div>

        {/* Test Sections */}
        {testSections.map((section) => (
          <div key={section.testId} className="mb-16">
            {/* Section Header */}
            <div className={`${section.bgColor} border-l-4 ${section.borderColor} p-6 rounded-r-lg mb-8`}>
              <h2 className={`text-2xl font-bold ${section.color} mb-2`}>
                Failing {section.testId}: {section.testName} ({section.schemes.length} schemes)
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {section.description}
              </p>
            </div>

            {/* Scheme Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {section.schemes.map(scheme => {
                const passingTests = [
                  { id: "T1", pass: scheme.tests.t1 },
                  { id: "T2", pass: scheme.tests.t2 },
                  { id: "T3", pass: scheme.tests.t3 },
                  { id: "T4", pass: scheme.tests.t4 }
                ].filter(t => t.pass).map(t => t.id)

                return (
                  <Card key={scheme.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-6">
                      {/* Scheme Name */}
                      <Link href={`/schemes/${scheme.id}`}>
                        <h3 className="text-lg font-bold text-[#1B4332] hover:underline mb-3 line-clamp-2">
                          {scheme.name}
                        </h3>
                      </Link>

                      {/* Department Pill */}
                      <Link href={`/departments/${scheme.departmentSlug}`}>
                        <div className="inline-block mb-4 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full hover:bg-gray-200">
                          {scheme.departmentName.replace(" Department", "")}
                        </div>
                      </Link>

                      {/* Test Results */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {/* Failing Test */}
                        <div className={`${section.bgColor} ${section.color} px-3 py-1 rounded font-bold text-xs`}>
                          {section.testId} FAIL
                        </div>
                        
                        {/* Passing Tests */}
                        <div className="flex gap-1">
                          {passingTests.map(test => (
                            <div key={test} className="bg-[#D1FAE5] text-[#065F46] px-2 py-1 rounded font-bold text-xs">
                              {test} ✓
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Fix Hint */}
                      {scheme.upgradePathway && scheme.upgradePathway.length > 0 && (
                        <div className="bg-[#FEF3C7] border border-[#FCD34D] p-3 rounded mb-4">
                          <p className="text-xs font-semibold text-[#D97706] mb-1">Quick Fix:</p>
                          <p className="text-sm text-gray-700">{scheme.upgradePathway[0]}</p>
                        </div>
                      )}

                      {/* Score Badge */}
                      <div className="text-right text-lg font-bold text-[#1B4332]">
                        {scheme.score}/4
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-8">
          <p>Near-SOC Schemes Database • Foundation for Ecological Security (FES) | April 2026</p>
        </div>
      </main>
    </div>
  )
}
