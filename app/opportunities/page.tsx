"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { CharacterFadeIn } from "@/components/character-fade-in"
import { allDepartments } from "@/lib/data"

export default function OpportunitiesPage() {
  const nearSocSchemes = allDepartments.flatMap((dept) =>
    dept.schemes
      .filter((s) => s.classification === "Near-SOC")
      .map((s) => ({ ...s, departmentName: dept.department, departmentSlug: dept.slug }))
  )

  const departmentOptions = [
    "All",
    ...Array.from(new Set(nearSocSchemes.map((s) => s.departmentName.replace(" Department", "")))).sort(),
  ]

  const [selectedDepartment, setSelectedDepartment] = useState<string>("All")

  const filteredSchemes = useMemo(() => {
    if (selectedDepartment === "All") return nearSocSchemes
    return nearSocSchemes.filter(
      (scheme) => scheme.departmentName.replace(" Department", "") === selectedDepartment
    )
  }, [nearSocSchemes, selectedDepartment])

  const renderTestPill = (label: "T1" | "T2" | "T3" | "T4", pass: boolean) => (
    <span
      key={label}
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${
        pass ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"
      }`}
    >
      {label} {pass ? "PASS" : "FAIL"}
    </span>
  )

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <section className="mb-10">
          <h1 className="text-4xl font-bold text-[#1B4332] sm:text-5xl">Near-SOC Upgrade Opportunities</h1>
          <p className="mt-3 max-w-3xl text-gray-600 text-lg">
            These schemes pass 3 of 4 SOC tests. A single targeted design fix elevates each to full SOC.
          </p>
          <div className="mt-6 inline-flex items-center rounded-full bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white">
            {nearSocSchemes.length} schemes identified
          </div>
        </section>

        {/* Impact Estimate Banner */}
        <section className="mb-10 rounded-lg border-l-4 border-l-[#1B4332] bg-white px-6 py-8 shadow-sm border border-gray-100">
          {/* Scenario Label */}
          <div className="mb-6 flex items-center gap-2">
            <div className="inline-flex items-center rounded-full bg-[#1B4332]/10 px-3 py-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1B4332]">
                Projected Impact — If All Near-SOC Schemes Upgraded to SOC
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1: Total Income */}
            <div>
              <div className="text-3xl font-bold text-[#1B4332] mb-1">
                <CharacterFadeIn text={`₹${((nearSocSchemes.length * 5000 * 6000) / 10000000).toFixed(1)} Cr`} />
              </div>
              <p className="text-sm text-gray-600">
                <CharacterFadeIn text="Total incremental income" />
              </p>
            </div>

            {/* Stat 2: Beneficiary Households */}
            <div>
              <div className="text-3xl font-bold text-[#1B4332] mb-1">
                <CharacterFadeIn text={`${((nearSocSchemes.length * 5000) / 100000).toFixed(2)} Lakh HH`} />
              </div>
              <p className="text-sm text-gray-600">
                <CharacterFadeIn text="Households that would benefit" />
              </p>
            </div>

            {/* Stat 3: Average Score */}
            <div>
              <div className="text-3xl font-bold text-[#1B4332] mb-1">
                <CharacterFadeIn text="3/4 Tests" />
              </div>
              <p className="text-sm text-gray-600">
                <CharacterFadeIn text="Average current performance" />
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs italic text-gray-500">
              <CharacterFadeIn 
                text="Estimates based on conservative 5,000 HH/scheme average and ₹6,000/HH/year Delta-Y threshold. Actual beneficiary counts and impact vary by scheme."
                duration={4500}
              />
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="mb-10">
          <div className="flex flex-wrap gap-2">
            {departmentOptions.map((department) => {
              const selected = selectedDepartment === department
              return (
                <button
                  key={department}
                  type="button"
                  onClick={() => setSelectedDepartment(department)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    selected
                      ? "border-[#1B4332] bg-[#1B4332] text-white"
                      : "border-[#1B4332]/40 bg-white text-[#1B4332] hover:border-[#1B4332]"
                  }`}
                >
                  {department}
                </button>
              )
            })}
          </div>
        </section>

        {/* Opportunities Grid */}
        <section>
          {filteredSchemes.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
              No Near-SOC schemes in this department.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredSchemes.map((scheme) => (
                <article key={scheme.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <Link
                      href={`/departments/${scheme.departmentSlug}`}
                      className="rounded-full border border-[#2D6A4F] px-3 py-1 text-xs font-semibold text-[#2D6A4F] hover:bg-[#2D6A4F]/5"
                    >
                      {scheme.departmentName.replace(" Department", "")}
                    </Link>
                    <span className="text-xs font-bold text-gray-500">3/4 Tests Pass</span>
                  </div>

                  <h2 className="text-xl font-bold text-[#1B4332] leading-tight">
                    <Link href={`/schemes/${scheme.id}`} className="hover:underline">
                      {scheme.name}
                    </Link>
                  </h2>

                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">{scheme.objective}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {renderTestPill("T1", scheme.tests.t1)}
                    {renderTestPill("T2", scheme.tests.t2)}
                    {renderTestPill("T3", scheme.tests.t3)}
                    {renderTestPill("T4", scheme.tests.t4)}
                  </div>

                  {scheme.upgradePathway?.[0] && (
                    <blockquote className="mt-4 rounded-lg border border-[#FCD34D] bg-[#FEF3C7] px-4 py-3 text-sm text-[#92400E]">
                      "{scheme.upgradePathway[0]}"
                    </blockquote>
                  )}

                  <Link
                    href={`/schemes/${scheme.id}`}
                    className="mt-5 inline-flex text-sm font-semibold text-[#1B4332] hover:text-[#2D6A4F]"
                  >
                    View Full Analysis →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Bottom Note */}
        <p className="mt-12 text-center text-sm text-gray-500">
          As remaining department analyses are completed, this list will grow.
        </p>
      </main>
    </div>
  )
}
