"use client"

import { Navbar } from "@/components/navbar"
import { allDepartments, getTotalByClassification, getTotalSchemesWithFlags } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts"

export default function DashboardPage() {
  // Sort departments by total schemes for better visualization
  const sortedDepts = [...allDepartments].sort((a, b) => b.totalSchemes - a.totalSchemes)

  const chartData = sortedDepts.map(dept => {
    const soc = dept.summary?.soc || 0
    const socWithGaps = dept.summary?.socWithGaps || 0
    const nearSoc = (dept.summary?.nearSocOperational || 0) + (dept.summary?.nearSocStructural || 0)
    const nonSoc = dept.summary?.nonSoc || 0

    return {
      name: dept.department.replace(" Department", ""),
      soc,
      socWithGaps,
      nearSoc,
      nonSoc,
      total: dept.totalSchemes
    }
  })

  const totalSchemes = allDepartments.reduce((acc, d) => acc + d.totalSchemes, 0)
  const totalSoc = getTotalByClassification("SOC")
  const totalSocWithGaps = getTotalByClassification("SOC with Governance Gaps")
  const totalNearSocOp = getTotalByClassification("Near-SOC (Operational)")
  const totalNearSocStruct = getTotalByClassification("Near-SOC (Structural)")
  const totalNonSoc = getTotalByClassification("Non-SOC")
  const schemesWithFlags = getTotalSchemesWithFlags()
  const socRate = ((totalSoc / totalSchemes) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#1B4332] mb-4">Diagnostic Dashboard</h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            A comparative landscape of policy effectiveness across Chhattisgarh's government architecture.
          </p>
        </div>

        {/* Global Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 print:grid-cols-2 print:gap-4 print:mb-6">
          <Card className="border-l-4 border-l-[#16A34A] bg-white print:shadow-none">
            <CardHeader className="pb-2 print:pb-1">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider print:text-xs">Clean SOC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-[#16A34A] print:text-2xl">{totalSoc}</div>
              <p className="text-xs text-gray-400 mt-2 font-medium print:text-[10px] print:mt-1">All 4 tests PASS, no governance gaps</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-[#2D6A4F] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">SOC w/ Gaps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-[#2D6A4F]">{totalSocWithGaps}</div>
              <p className="text-xs text-gray-400 mt-2 font-medium">{schemesWithFlags} schemes with governance flags</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#D97706] bg-white cursor-pointer hover:shadow-md transition-shadow">
            <Link href="/near-soc" className="block">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Near-SOC (All)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-[#D97706]">
                  {totalNearSocOp + totalNearSocStruct}
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">3 tests PASS, upgrade pathway available</p>
                <p className="text-xs text-[#D97706] font-semibold mt-3">View all →</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="border-l-4 border-l-gray-400 bg-white">
             <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Non-SOC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-gray-500">{totalNonSoc}</div>
              <p className="text-xs text-gray-400 mt-2 font-medium">Major redesign required</p>
            </CardContent>
          </Card>
        </div>

        {/* Comparative Landscape (Stacked Bar Chart) */}
        <Card className="bg-white border-gray-200 shadow-sm mb-12 print:shadow-none print:mb-6 print:page-break-inside-avoid">
          <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between print:border-b-2 print:pb-3">
            <div>
              <CardTitle className="text-xl font-bold text-[#1B4332] print:text-lg">Comparative Sectoral Performance</CardTitle>
              <p className="text-sm text-gray-500 mt-1 print:text-xs">Classification distribution by department</p>
            </div>
            <div className="flex gap-3 text-xs font-bold flex-wrap">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#16A34A]"/> SOC</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#2D6A4F]"/> SOC w/ Gaps</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#D97706]"/> Near-SOC</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-300"/> Non-SOC</div>
            </div>
          </CardHeader>
          <CardContent className="pt-10 h-125">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                barSize={32}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false}
                  tickLine={false}
                  width={150}
                  tick={{ fill: '#1B4332', fontSize: 11, fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="soc" stackId="a" fill="#16A34A" />
                <Bar dataKey="socWithGaps" stackId="a" fill="#2D6A4F" />
                <Bar dataKey="nearSoc" stackId="a" fill="#D97706" />
                <Bar dataKey="nonSoc" stackId="a" fill="#D1D5DB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Scorecards */}
        <div className="mb-12 print:mb-6">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-8 print:text-2xl print:mb-4">Department Scorecards</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-3 print:gap-3">
            {allDepartments.map((dept) => {
              const soc = dept.summary?.soc || 0
              const socWithGaps = dept.summary?.socWithGaps || 0
              const nearSocOp = dept.summary?.nearSocOperational || 0
              const nearSocStruct = dept.summary?.nearSocStructural || 0
              const nonSoc = dept.summary?.nonSoc || 0
              const nearSocTotal = nearSocOp + nearSocStruct

              const commonPct = (((soc + socWithGaps) / dept.totalSchemes) * 100).toFixed(0)
              const isMuted = soc === 0 && socWithGaps === 0
              const hasGreenBorder = soc >= 3

              return (
                <Card
                  key={dept.slug}
                  className={`border-0 shadow-sm hover:shadow-md transition-all overflow-hidden ${
                    hasGreenBorder ? "border-l-4 border-l-[#16A34A]" : ""
                  } ${isMuted ? "bg-gray-100" : "bg-white"}`}
                >
                  <CardHeader className={`pb-3 ${isMuted ? "bg-gray-100" : "bg-white"}`}>
                    <CardTitle className={`text-base font-bold line-clamp-2 ${
                      isMuted ? "text-gray-500" : "text-[#1B4332]"
                    }`}>
                      {dept.department.replace(" Department", "")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={isMuted ? "bg-gray-100" : "bg-white"}>
                    {/* Classification Mini Bar */}
                    <div className="mb-4">
                      <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        <div className="bg-[#16A34A]" style={{ width: `${(soc / dept.totalSchemes) * 100}%` }} />
                        <div className="bg-[#2D6A4F]" style={{ width: `${(socWithGaps / dept.totalSchemes) * 100}%` }} />
                        <div className="bg-[#D97706]" style={{ width: `${(nearSocTotal / dept.totalSchemes) * 100}%` }} />
                        <div className="bg-gray-300" style={{ width: `${(nonSoc / dept.totalSchemes) * 100}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-gray-500 font-bold mt-2">
                        <span>{((soc / dept.totalSchemes) * 100).toFixed(0)}% SOC</span>
                        <span>{dept.totalSchemes} Total</span>
                      </div>
                    </div>

                    {/* Commons Alignment Score */}
                    <div className={`mb-4 p-2 rounded text-center ${
                      isMuted ? "bg-gray-200" : "bg-[#16A34A]/10"
                    }`}>
                      <div className={`text-sm font-bold ${
                        isMuted ? "text-gray-500" : "text-[#16A34A]"
                      }`}>
                        {commonPct}% Commons-Aligned
                      </div>
                    </div>

                    {/* View Link */}
                    <Link 
                      href={`/departments/${dept.slug}`}
                      className={`inline-flex items-center gap-1 font-semibold text-sm transition-colors ${
                        isMuted 
                          ? "text-gray-500 hover:text-gray-700" 
                          : "text-[#1B4332] hover:text-[#2D6A4F]"
                      }`}
                    >
                      View <span>→</span>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm border-t border-gray-200 pt-8">
          <p>© 2026 FES SOC Diagnostic Website • Data provided by Foundation for Ecological Security</p>
        </div>
      </main>
    </div>
  )
}
