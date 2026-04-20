import Link from "next/link"
import { allDepartments } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#1B4332] mb-4">Departmental Diagnostics</h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            A comprehensive mapping of 35 state departments, evaluating their policy structures 
            against the Shared-Outcome Commons (SOC) framework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allDepartments.map((dept) => (
            <Link key={dept.slug} href={`/departments/${dept.slug}`}>
              <Card className="hover:shadow-lg transition-all duration-300 h-full border-gray-200 group flex flex-col">
                <CardHeader className="pb-3 border-b border-gray-50 bg-white group-hover:bg-gray-50">
                  <CardTitle className="text-base font-bold text-[#1B4332] line-clamp-2 min-h-[40px]">
                    {dept.department}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex-grow">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-2xl font-bold text-[#1B4332] leading-none">{dept.totalSchemes}</div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-semibold">Total Schemes</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#16A34A] leading-none">{dept.summary.soc}</div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-semibold">SOC Rated</div>
                    </div>
                  </div>

                  {/* Diagnostic Bar */}
                  <div className="space-y-1.5">
                    <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                      <div 
                        className="bg-[#16A34A] transition-all" 
                        style={{ width: `${(dept.summary.soc / dept.totalSchemes) * 100}%` }} 
                      />
                      <div 
                        className="bg-[#D97706] transition-all" 
                        style={{ width: `${(dept.summary.nearSoc / dept.totalSchemes) * 100}%` }} 
                      />
                      <div 
                        className="bg-gray-300 transition-all" 
                        style={{ width: `${(dept.summary.nonSoc / dept.totalSchemes) * 100}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                      <span className="text-[#16A34A]">{((dept.summary.soc / dept.totalSchemes) * 100).toFixed(0)}% SOC</span>
                      <span>{dept.totalSchemes} Schemes</span>
                    </div>
                  </div>

                  {/* Dominant Finding Callout */}
                  <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                    <p className="text-xs italic text-gray-600 line-clamp-2 leading-relaxed">
                      "{dept.dominantFinding}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {/* Empty placeholders to reach 35 if needed (visual only for now) */}
          {Array.from({ length: Math.max(0, 12 - allDepartments.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-3 shadow-inner" />
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
