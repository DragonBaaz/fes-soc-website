import Link from "next/link"
import { allDepartments } from "@/lib/data"
import { Navbar } from "@/components/navbar"

export default function DepartmentsPage() {
  const totalSchemes = allDepartments.reduce((sum, d) => sum + d.totalSchemes, 0)

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#1B4332] mb-3">Departmental Diagnostics</h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            SOC diagnostic coverage across {allDepartments.length} state departments and {totalSchemes} schemes in Chhattisgarh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {allDepartments.map((dept) => {
            const soc = dept.summary?.soc || 0
            const socWithGaps = dept.summary?.socWithGaps || 0
            const nearSocOp = dept.summary?.nearSocOperational || 0
            const nearSocStruct = dept.summary?.nearSocStructural || 0
            const nonSoc = dept.summary?.nonSoc || 0
            const nearSocTotal = nearSocOp + nearSocStruct
            const socPct = ((soc / dept.totalSchemes) * 100).toFixed(0)

            return (
              <Link key={dept.slug} href={`/departments/${dept.slug}`}>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group h-full flex flex-col overflow-hidden">
                  {/* Card header — coloured top strip */}
                  <div className="h-1 w-full bg-[#1B4332]" />

                  <div className="p-5 flex flex-col flex-grow">
                    {/* Department name */}
                    <h2 className="text-sm font-bold text-[#1B4332] leading-snug mb-4 line-clamp-2 min-h-[36px] group-hover:underline">
                      {dept.department}
                    </h2>

                    {/* Stats row */}
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <div className="text-2xl font-bold text-[#1B4332] leading-none">{dept.totalSchemes}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5 font-semibold">Schemes</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#16A34A] leading-none">{soc}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5 font-semibold">SOC</div>
                      </div>
                    </div>

                    {/* Classification bar — green SOC / teal SOC-with-gaps / amber Near-SOC / gray Non-SOC */}
                    <div className="space-y-1">
                      <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-100">
                        <div className="bg-[#16A34A]" style={{ width: `${(soc / dept.totalSchemes) * 100}%` }} />
                        <div className="bg-[#0D9488]" style={{ width: `${(socWithGaps / dept.totalSchemes) * 100}%` }} />
                        <div className="bg-[#D97706]" style={{ width: `${(nearSocTotal / dept.totalSchemes) * 100}%` }} />
                        <div className="bg-gray-300" style={{ width: `${(nonSoc / dept.totalSchemes) * 100}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] font-semibold">
                        <span className="text-[#16A34A]">{socPct}% SOC</span>
                        <span className="text-gray-400">{dept.totalSchemes} schemes</span>
                      </div>
                    </div>

                    {/* Dominant finding — only if present */}
                    {dept.dominantFinding && (
                      <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex-grow flex items-end">
                        <p className="text-[11px] italic text-gray-500 line-clamp-2 leading-relaxed">
                          "{dept.dominantFinding}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
