import Link from "next/link"
import { notFound } from "next/navigation"
import { getDepartmentBySlug, allDepartments } from "@/lib/data"
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PrintButton } from "@/components/print-button"

export function generateStaticParams() {
  return allDepartments.map((dept) => ({
    slug: dept.slug,
  }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DepartmentDetailPage({ params }: PageProps) {
  const { slug } = await params
  const dept = getDepartmentBySlug(slug)

  if (!dept) {
    notFound()
  }


  const getStatusStyle = (pass: boolean) => 
    pass 
      ? "bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-[10px]" 
      : "bg-red-50 text-red-500 px-2 py-1 rounded text-[10px]"

  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case "SOC": return "bg-[#16A34A] text-white"
      case "Near-SOC": return "bg-[#B45309] text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <div className="print:hidden">
        <Navbar />
      </div>
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header & Back Link */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <Link href="/departments" className="text-sm font-semibold text-[#1B4332] hover:underline flex items-center gap-1 print:hidden">
              ← Back to Departments
            </Link>
            <PrintButton />
          </div>
          <h1 className="text-4xl font-bold text-[#1B4332] print:text-5xl print:mb-4">{dept.department}</h1>
          <div className="print:hidden text-sm text-gray-600 mt-2">Department Diagnostic Report • {new Date().getFullYear()}</div>
        </div>

        {/* Improved Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 print:hidden">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-1 md:col-span-3">
             <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-3xl font-bold text-[#1B4332]">{dept.totalSchemes}</div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total Schemes Analysed</div>
                </div>
                <div className="h-10 w-px bg-gray-200 hidden sm:block" />
                <div className="flex gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#16A34A]" />
                      <span className="text-xl font-bold text-[#16A34A]">{dept.summary.soc}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">SOC Compliant</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#D97706]" />
                      <span className="text-xl font-bold text-[#D97706]">{dept.summary.nearSoc}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Near-SOC</span>
                  </div>
                </div>
             </div>
          </div>
          <div className="bg-[#1B4332] p-6 rounded-xl text-white shadow-sm flex flex-col justify-center">
            <div className="text-3xl font-bold">{((dept.summary.soc / dept.totalSchemes) * 100).toFixed(0)}%</div>
            <div className="text-[10px] uppercase tracking-wider opacity-80 font-bold">Department Score</div>
          </div>
        </div>

        {/* Sectoral Dominant Finding */}
        <div className="mb-12 bg-white border border-gray-200 p-8 rounded-xl shadow-sm relative overflow-hidden print:shadow-none print:border-gray-300 print:break-inside-avoid">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-24 h-24 text-[#1B4332]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14H15.017C13.9124 14 13.017 13.1046 13.017 12V5C13.017 3.89543 13.9124 3 15.017 3H21.017C22.1216 3 23.017 3.89543 23.017 5V12C23.017 13.1046 22.1216 14 21.017 14H21.017V16C21.017 18.7614 18.7784 21 16.017 21H14.017ZM3.01693 21L3.01693 18C3.01693 16.8954 3.91236 16 5.01693 16H8.01693V14H4.01693C2.91236 14 2.01693 13.1046 2.01693 12V5C2.01693 3.89543 2.91236 3 4.01693 3H10.0169C11.1215 3 12.0169 3.89543 12.0169 5V12C12.0169 13.1046 11.1215 14 10.0169 14H10.0169V16C10.0169 18.7614 7.77836 21 5.01693 21H3.01693Z" />
            </svg>
          </div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Sectoral Insight</h3>
          <p className="text-2xl font-serif text-[#1B4332] leading-snug">
            {dept.dominantFinding}
          </p>
          {dept.dominantFailure && (
            <div className="mt-6 flex gap-4 items-start">
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold shrink-0">CRITICAL BARRIER</div>
              <p className="text-sm text-gray-600 mt-1 italic">"{dept.dominantFailure}"</p>
            </div>
          )}
        </div>

        {/* Schemes Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12 print:break-inside-avoid print:shadow-none print:border-gray-300 print:page-break-after-avoid">
          <div className="p-6 border-b border-gray-100 print:p-4 print:border-gray-300">
            <h2 className="text-xl font-bold text-[#1B4332] print:text-lg">Scheme Diagnostic Matrix</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 print:bg-white print:border-b-2 print:border-b-[#1B4332]">
                <TableRow>
                  <TableHead className="font-bold text-[#1B4332]">Scheme Name</TableHead>
                  <TableHead className="text-center font-bold text-[#1B4332]">T1</TableHead>
                  <TableHead className="text-center font-bold text-[#1B4332]">T2</TableHead>
                  <TableHead className="text-center font-bold text-[#1B4332]">T3</TableHead>
                  <TableHead className="text-center font-bold text-[#1B4332]">T4</TableHead>
                  <TableHead className="text-center font-bold text-[#1B4332] print:hidden">Score</TableHead>
                  <TableHead className="text-right font-bold text-[#1B4332]">Classification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dept.schemes.map((scheme) => (
                  <TableRow key={scheme.id} className="hover:bg-gray-50/50 print:hover:bg-white print:border-b print:border-b-gray-200">
                    <TableCell className="font-medium print:text-sm">
                      <div className="print:hidden">
                        <Link href={`/schemes/${scheme.id}`} className="text-[#1B4332] hover:underline">
                          {scheme.name}
                        </Link>
                        <div className="text-[10px] text-gray-400 mt-1">{scheme.hindiName}</div>
                      </div>
                      <div className="hidden print:block">{scheme.name}</div>
                    </TableCell>
                    <TableCell className="text-center print:text-sm">
                      <span className={`${getStatusStyle(scheme.tests.t1)} print:bg-white print:text-[#1B4332] print:p-0 print:rounded-none print:text-xs`}>
                        {scheme.tests.t1 ? "✓" : "✗"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center print:text-sm">
                      <span className={`${getStatusStyle(scheme.tests.t2)} print:bg-white print:text-[#1B4332] print:p-0 print:rounded-none print:text-xs`}>
                        {scheme.tests.t2 ? "✓" : "✗"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center print:text-sm">
                      <span className={`${getStatusStyle(scheme.tests.t3)} print:bg-white print:text-[#1B4332] print:p-0 print:rounded-none print:text-xs`}>
                        {scheme.tests.t3 ? "✓" : "✗"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center print:text-sm">
                      <span className={`${getStatusStyle(scheme.tests.t4)} print:bg-white print:text-[#1B4332] print:p-0 print:rounded-none print:text-xs`}>
                        {scheme.tests.t4 ? "✓" : "✗"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-bold print:hidden">{scheme.score}/4</TableCell>
                    <TableCell className="text-right print:text-sm">
                      <Badge className={`${getClassificationBadge(scheme.classification)} print:text-xs print:px-1 print:py-0`}>
                        {scheme.classification}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Structural Findings */}
        <div className="mb-12 print:mb-8 print:break-inside-avoid">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-8 print:text-2xl print:mb-4">Structural Findings</h2>
          
          {/* Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 print:grid-cols-1 print:gap-4 print:mb-6">
            {/* Dominant Problem */}
            <Card className="border-l-4 border-l-[#DC2626] bg-white shadow-sm overflow-hidden print:shadow-none print:border-gray-300 print:break-inside-avoid">
              <CardContent className="p-8 print:p-4">
                <h3 className="text-xs font-bold text-[#DC2626] uppercase tracking-widest mb-4 print:text-[10px] print:mb-2">Dominant Problem</h3>
                <p className="text-gray-700 leading-relaxed text-lg print:text-sm print:leading-relaxed">
                  {dept.structuralFindings.dominantProblem}
                </p>
              </CardContent>
            </Card>

            {/* SOC Exception */}
            <Card className="border-l-4 border-l-[#16A34A] bg-white shadow-sm overflow-hidden print:shadow-none print:border-gray-300 print:break-inside-avoid">
              <CardContent className="p-8 print:p-4">
                <h3 className="text-xs font-bold text-[#16A34A] uppercase tracking-widest mb-4 print:text-[10px] print:mb-2">SOC Exception</h3>
                <p className="text-gray-700 leading-relaxed text-lg print:text-sm print:leading-relaxed">
                  {dept.structuralFindings.socException}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cross-Cutting Upgrade Priorities */}
          <div className="mb-12 print:mb-6 print:break-inside-avoid">
            <h3 className="text-2xl font-bold text-[#1B4332] mb-6 print:text-lg print:mb-3">Cross-Cutting Upgrade Priorities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-3">
              {dept.structuralFindings.crossCuttingPriorities.map((priority, index) => (
                <Card key={index} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden print:shadow-none print:border-gray-300 print:hover:shadow-none print:break-inside-avoid">
                  <CardContent className="p-6 flex gap-4 print:p-3 print:gap-2">
                    <div className="text-2xl font-bold text-[#1B4332] shrink-0 w-10 text-center print:text-lg print:w-6">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-0.5 print:text-sm print:leading-relaxed print:pt-0">
                      {priority}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* State-Specific Context */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm print:shadow-none print:border-gray-300 print:p-4 print:break-inside-avoid">
            <h3 className="text-2xl font-bold text-[#1B4332] mb-6 print:text-lg print:mb-3">State-Specific Context</h3>
            <ul className="space-y-4 print:space-y-2">
              {dept.structuralFindings.contextualFactors.map((factor, index) => (
                <li key={index} className="flex gap-4 items-start text-gray-700 leading-relaxed print:text-sm print:gap-2">
                  <span className="text-[#1B4332] font-bold shrink-0 mt-1 print:mt-0">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-12 pt-8 border-t border-gray-300 text-center text-xs text-gray-600">
          <p className="font-semibold text-gray-700 mb-2">SOC Policy Diagnostic</p>
          <p>Foundation for Ecological Security • IIM Raipur • {new Date().getFullYear()}</p>
          <p className="mt-4 text-gray-500">This report was generated from the SOC Diagnostic Database</p>
        </div>
      </main>
    </div>
  )
}
