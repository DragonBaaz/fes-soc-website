import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllSchemes } from "@/lib/data"
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function generateStaticParams() {
  const schemes = getAllSchemes()
  return schemes.map((scheme) => ({
    id: scheme.id,
  }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SchemeDetailPage({ params }: PageProps) {
  const { id } = await params
  const schemes = getAllSchemes()
  const scheme = schemes.find((s) => s.id === id)

  if (!scheme) {
    notFound()
  }

  const getPassFailBadge = (pass: boolean) => (
    <span className={`px-2 py-1 rounded text-xs font-bold ${
      pass 
        ? "bg-[#D1FAE5] text-[#065F46]" 
        : "bg-[#FEE2E2] text-[#991B1B]"
    }`}>
      {pass ? "PASS" : "FAIL"}
    </span>
  )

  const getClassificationStyles = (classification: string) => {
    switch (classification) {
      case "SOC": return "bg-[#16A34A] text-white"
      case "Near-SOC": return "bg-[#D97706] text-white"
      case "Non-SOC": return "bg-[#B91C1C] text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  const evidenceRows = [
    { label: "T1: Resource/Commons", result: scheme.tests.t1, text: scheme.evidence.t1 },
    { label: "T2: Dwellers/Inclusion", result: scheme.tests.t2, text: scheme.evidence.t2 },
    { label: "T3: Livelihood/Income", result: scheme.tests.t3, text: scheme.evidence.t3 },
    { label: "T4: Sustainability Lock", result: scheme.tests.t4, text: scheme.evidence.t4 },
  ]

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back to Department Link */}
        <Link 
          href={`/departments/${scheme.departmentSlug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#1B4332] hover:text-[#2D6A4F] mb-6 group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> 
          Back to {scheme.departmentName}
        </Link>

        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-500 gap-2 items-center">
          <Link href="/departments" className="hover:text-[#1B4332]">Departments</Link>
          <span>/</span>
          <Link href={`/departments/${scheme.departmentSlug}`} className="hover:text-[#1B4332]">
            {scheme.departmentName.replace(" Department", "")}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{scheme.name}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1B4332] mb-2">{scheme.name}</h1>
            {scheme.hindiName && (
              <p className="text-xl text-gray-500 italic font-serif">{scheme.hindiName}</p>
            )}
          </div>
          <div className="shrink-0 text-center">
            <Badge className={`text-lg px-4 py-1 mb-1 ${getClassificationStyles(scheme.classification)}`}>
              {scheme.classification}
            </Badge>
            <p className="text-sm font-bold text-gray-500">Diagnostic Score: {scheme.score}/4</p>
          </div>
        </div>

        {/* Objective Box */}
        <div className="bg-white border-l-4 border-[#1B4332] p-6 rounded-r-lg shadow-sm mb-10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1B4332] mb-2">Scheme Objective</h3>
          <p className="text-gray-700 leading-relaxed text-lg">{scheme.objective}</p>
        </div>

        {/* Evidence Table */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Diagnostic Evidence</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-1/4 font-bold text-[#1B4332]">SOC Point</TableHead>
                  <TableHead className="w-1/6 text-center font-bold text-[#1B4332]">Result</TableHead>
                  <TableHead className="font-bold text-[#1B4332]">Evidence & Findings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evidenceRows.map((row) => (
                  <TableRow key={row.label} className="align-top">
                    <TableCell className="font-semibold text-gray-700 py-4">{row.label}</TableCell>
                    <TableCell className="text-center py-4">{getPassFailBadge(row.result)}</TableCell>
                    <TableCell className="text-sm text-gray-600 leading-relaxed py-4">{row.text}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Upgrade Pathway */}
        {scheme.upgradePathway && scheme.upgradePathway.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6">
              {scheme.classification === "SOC" ? "Enhancement Suggestions" : "Upgrade Pathway"}
            </h2>
            <div className="grid gap-4">
              {scheme.upgradePathway.map((step, index) => (
                <Card 
                  key={index} 
                  className="border-l-4 border-l-[#1B4332] shadow-sm hover:shadow-md transition-shadow bg-white border-0"
                >
                  <CardContent className="p-6 flex gap-4">
                    <div className="text-3xl font-bold text-[#1B4332] shrink-0 w-8 text-center">
                      {index + 1}
                    </div>
                    <div className="text-gray-700 leading-relaxed">
                      {step}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
