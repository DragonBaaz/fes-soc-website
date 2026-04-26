import { Navbar } from "@/components/navbar"
import Hero from "@/components/Hero"
import FrameworkCards from "@/components/FrameworkCards"
import { allDepartments } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const totalDepartments = allDepartments.length;
  const totalSchemes = allDepartments.reduce((acc, dept) => acc + dept.totalSchemes, 0);
  const totalSoc = allDepartments.reduce((acc, dept) => acc + dept.summary.soc, 0);
  const totalNearSoc = allDepartments.reduce((acc, dept) => acc + (dept.summary.nearSocStructural || 0) + (dept.summary.nearSocOperational || 0), 0);
  const socRate = totalSchemes > 0 ? ((totalSoc / totalSchemes) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* By the Numbers Section */}
        <div className="bg-white border-y border-gray-200 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#1B4332] text-center mb-8">Diagnostic by the Numbers</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Departments", value: totalDepartments },
                { label: "Schemes Analysed", value: totalSchemes },
                { label: "SOC Compliant", value: totalSoc, color: "text-[#16A34A]" },
                { label: "Near-SOC", value: totalNearSoc, color: "text-[#D97706]" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-4xl font-extrabold ${stat.color || "text-[#1B4332]"}`}>{stat.value}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FrameworkCards />
        
        {/* Scheme of the Day Spotlight */}
        {(() => {
          const socSchemes = allDepartments.flatMap((dept) =>
            dept.schemes
              .filter((s) => s.classification === "SOC")
              .map((s) => ({
                ...s,
                departmentSlug: dept.slug,
                departmentName: dept.department,
              }))
          );
          
          if (socSchemes.length === 0) return null;
          
          const index = new Date().getDate() % socSchemes.length;
          const spotlightScheme = socSchemes[index];
          const day = new Date().getDate();
          
          return (
            <div className="py-16 px-4">
              <div className="max-w-2xl mx-auto">
                {/* Intro Section */}
                <div className="text-center mb-8">
                  <div className="inline-block mb-4">
                    <span className="text-4xl">✨</span>
                  </div>
                  <h2 className="text-3xl font-bold text-[#1B4332] mb-3">
                    Scheme of the Day
                  </h2>
                  <p className="text-gray-600 leading-relaxed max-w-xl mx-auto">
                    Every day, we feature a different <span className="font-semibold text-[#16A34A]">fully successful SOC scheme</span>. 
                    Explore real examples of policies that passed all four cornerstone tests and are making a genuine impact. 
                    A new discovery awaits you every day!
                  </p>
                </div>
                
                {/* Spotlight Card */}
                <Card className="border-none shadow-lg bg-linear-to-br from-[#F0F9F3] to-[#FAFAF7] overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                  {/* Day indicator badge */}
                  <div className="absolute top-4 right-4 bg-[#D97706] text-white rounded-full w-14 h-14 flex items-center justify-center text-center">
                    <div>
                      <div className="text-xs font-bold uppercase">Day</div>
                      <div className="text-lg font-bold">{day}</div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3 pt-6">
                    <div className="mb-4 pr-20">
                      <Link
                        href={`/departments/${spotlightScheme.departmentSlug}`}
                        className="inline-block rounded-full border border-[#2D6A4F] bg-white px-4 py-1.5 text-xs font-bold text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white transition-all duration-200"
                      >
                        📍 {spotlightScheme.departmentName.replace(" Department", "")}
                      </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold text-[#1B4332] leading-tight">
                      {spotlightScheme.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-5">
                    {/* Objective */}
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {spotlightScheme.objective}
                    </p>
                    
                    {/* All Tests Passed Badge */}
                    <div className="flex items-center gap-3 bg-[#D1FAE5] rounded-lg px-4 py-3 border border-[#6EE7B7]">
                      <span className="text-2xl">✅</span>
                      <div>
                        <div className="font-bold text-[#065F46] text-sm">All 4 Tests Passed</div>
                        <div className="text-xs text-[#047857]">This scheme meets all SOC criteria</div>
                      </div>
                    </div>
                    
                    {/* Test badges inline */}
                    <div className="flex flex-wrap gap-2">
                      {["T1", "T2", "T3", "T4"].map((test) => (
                        <span
                          key={test}
                          className="rounded-lg bg-white border border-[#16A34A] px-3 py-1.5 text-xs font-bold text-[#16A34A] shadow-sm"
                        >
                          ✓ {test}
                        </span>
                      ))}
                    </div>
                    
                    {/* Upgrade pathway insight */}
                    {spotlightScheme.upgradePathway && spotlightScheme.upgradePathway.length > 0 && (
                      <div className="bg-white border-l-4 border-l-[#D97706] px-4 py-3 rounded">
                        <p className="text-xs uppercase font-bold text-[#D97706] mb-1">💡 Key Insight</p>
                        <p className="text-sm text-gray-600 italic">
                          "{spotlightScheme.upgradePathway[0]}"
                        </p>
                      </div>
                    )}
                    
                    {/* CTA Button */}
                    <Link
                      href={`/schemes/${spotlightScheme.id}`}
                      className="block bg-[#1B4332] text-white font-semibold py-3 rounded-lg text-center hover:bg-[#2D6A4F] transition-colors duration-200 w-full"
                    >
                      🔍 Explore This Scheme in Detail
                    </Link>
                  </CardContent>
                </Card>
                
                {/* Curiosity prompt */}
                <div className="text-center mt-6 text-sm text-gray-500">
                  <p>Come back tomorrow to discover a different SOC success story!</p>
                </div>
              </div>
            </div>
          );
        })()}
        
        {/* Department Overview Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#1B4332]">Department Overview</h2>
            <Link href="/departments" className="text-sm font-semibold text-[#1B4332] hover:underline">
              View all 35 departments →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allDepartments.slice(0, 8).map((dept) => (
              <Link key={dept.slug} href={`/departments/${dept.slug}`}>
                <Card className="hover:shadow-md transition-shadow h-full border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-[#1B4332] line-clamp-1">
                      {dept.department.replace(" Department", "")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-100">
                      <div
                        className="bg-[#16A34A]"
                        style={{ width: `${(dept.summary.soc / dept.totalSchemes) * 100}%` }}
                      />
                      <div
                        className="bg-[#D97706]"
                        style={{ width: `${(((dept.summary.nearSocStructural || 0) + (dept.summary.nearSocOperational || 0)) / dept.totalSchemes) * 100}%` }}
                      />
                      <div
                        className="bg-gray-300"
                        style={{ width: `${(dept.summary.nonSoc / dept.totalSchemes) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-medium">
                      <span>{dept.summary.soc} SOC</span>
                      <span>{dept.totalSchemes} Total</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Key Finding Callout */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-[#D97706]/10 border border-[#D97706]/20 p-8 text-center rounded-lg">
            <h2 className="text-2xl font-bold text-[#D97706] mb-4">Key Finding</h2>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
              While 85% of schemes address public needs, only <strong>{socRate}%</strong> meet the full diagnostic criteria for 
              <strong> Shared-Outcome Commons</strong>, highlighting a critical gap in structural community agency.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
