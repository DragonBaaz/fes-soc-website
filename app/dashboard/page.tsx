"use client"

import { Navbar } from "@/components/navbar"
import { allDepartments } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
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

  const chartData = sortedDepts.map(dept => ({
    name: dept.department.replace(" Department", ""),
    soc: dept.summary.soc,
    nearSoc: dept.summary.nearSoc,
    nonSoc: dept.summary.nonSoc,
    total: dept.totalSchemes
  }))

  const totalSchemes = allDepartments.reduce((acc, d) => acc + d.totalSchemes, 0)
  const totalSoc = allDepartments.reduce((acc, d) => acc + d.summary.soc, 0)
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-l-4 border-l-[#16A34A] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Overall SOC Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-[#1B4332]">{socRate}%</div>
              <p className="text-xs text-gray-400 mt-2 font-medium">{totalSoc} of {totalSchemes} schemes are SOC-compliant</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-[#D97706] bg-white cursor-pointer hover:shadow-md transition-shadow">
            <Link href="/opportunities" className="block">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Near-SOC Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-[#D97706]">
                  {allDepartments.reduce((acc, d) => acc + d.summary.nearSoc, 0)}
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">Schemes requiring only minor structural adjustment</p>
                <p className="text-xs text-[#D97706] font-semibold mt-3">View all →</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="border-l-4 border-l-[#1E3A5F] bg-white">
             <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-[#1E3A5F]">{allDepartments.length}</div>
              <p className="text-xs text-gray-400 mt-2 font-medium">Mapped and indexed in diagnostic database</p>
            </CardContent>
          </Card>
        </div>

        {/* Comparative Landscape (Stacked Bar Chart) */}
        <Card className="bg-white border-gray-200 shadow-sm mb-12">
          <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-[#1B4332]">Comparative Sectoral Performance</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Classification distribution by department</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#16A34A]"/> SOC</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#D97706]"/> NEAR-SOC</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-300"/> NON-SOC</div>
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
                <Bar dataKey="soc" stackId="a" fill="#16A34A" radius={[0, 0, 0, 0]} />
                <Bar dataKey="nearSoc" stackId="a" fill="#D97706" />
                <Bar dataKey="nonSoc" stackId="a" fill="#e5e7eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Scorecards */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-8">Department Scorecards</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {allDepartments.map((dept) => {
              const socPct = ((dept.summary.soc / dept.totalSchemes) * 100).toFixed(0)
              const socAdjacentPct = (((dept.summary.soc + dept.summary.nearSoc) / dept.totalSchemes) * 100).toFixed(0)
              const isMuted = dept.summary.soc === 0
              const hasGreenBorder = dept.summary.soc >= 3

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
                    {/* Large SOC Percentage */}
                    <div className="mb-4">
                      <div className={`text-4xl font-extrabold ${
                        isMuted ? "text-gray-400" : "text-[#1B4332]"
                      }`}>
                        {socPct}%
                      </div>
                      <div className={`text-xs font-bold uppercase tracking-wider ${
                        isMuted ? "text-gray-400" : "text-gray-500"
                      }`}>
                        SOC Rate
                      </div>
                    </div>

                    {/* Mini Stats Row */}
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 text-center">
                        <div className={`text-lg font-bold ${
                          isMuted ? "text-gray-400" : "text-[#16A34A]"
                        }`}>
                          {dept.summary.soc}
                        </div>
                        <div className={`text-[9px] font-bold uppercase ${
                          isMuted ? "text-gray-400" : "text-gray-500"
                        }`}>
                          SOC
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className={`text-lg font-bold ${
                          isMuted ? "text-gray-400" : "text-[#D97706]"
                        }`}>
                          {dept.summary.nearSoc}
                        </div>
                        <div className={`text-[9px] font-bold uppercase ${
                          isMuted ? "text-gray-400" : "text-gray-500"
                        }`}>
                          Near
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className={`text-lg font-bold ${
                          isMuted ? "text-gray-400" : "text-gray-400"
                        }`}>
                          {dept.summary.nonSoc}
                        </div>
                        <div className={`text-[9px] font-bold uppercase ${
                          isMuted ? "text-gray-400" : "text-gray-500"
                        }`}>
                          Non
                        </div>
                      </div>
                    </div>

                    {/* SOC-Adjacent Rate */}
                    <div className={`mb-4 p-2 rounded text-center ${
                      isMuted ? "bg-gray-200" : "bg-[#D97706]/10"
                    }`}>
                      <div className={`text-sm font-bold ${
                        isMuted ? "text-gray-500" : "text-[#D97706]"
                      }`}>
                        {socAdjacentPct}% SOC-adjacent
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

        {/* Methodology Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>© 2026 FES SOC Diagnostic Website • Data provided by Foundation for Ecological Security</p>
        </div>
      </main>
    </div>
  )
}
