import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllSchemes } from "@/lib/data"
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
      case "SOC with Governance Gaps": return "bg-[#0D9488] text-white"
      case "Near-SOC (Operational)": return "bg-[#D97706] text-white"
      case "Near-SOC (Structural)": return "bg-[#EA580C] text-white"
      case "Non-SOC": return "bg-[#B91C1C] text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  // Governance flag display labels
  const getFlagLabel = (flag: string): { label: string; severity: string } => {
    const labels: Record<string, { label: string; severity: string }> = {
      'T1.5': { label: 'Boundary Unmapped', severity: 'low' },
      'T2.4': { label: 'No Grievance Mechanism', severity: 'medium' },
      'T2.5': { label: 'Women\'s Representation Gap', severity: 'medium' },
      'T3.5': { label: 'Non-Monetary Benefits Untracked', severity: 'low' },
      'T4.6': { label: 'No Community Monitoring', severity: 'high' },
    }
    return labels[flag] || { label: flag, severity: 'unknown' }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#DC2626'
      case 'medium': return '#D97706'
      case 'low': return '#6B7280'
      default: return '#6B7280'
    }
  }

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

        {/* Metadata Strip */}
        {(scheme.tier || scheme.nodalMinistry || scheme.budgetOutlay || scheme.reach || scheme.commonsType || scheme.commonsTrack) && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Tier</p>
                <p className="text-sm text-gray-700">{scheme.tier || 'Not classified'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Nodal Ministry</p>
                <p className="text-sm text-gray-700">{scheme.nodalMinistry || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Budget Outlay</p>
                <p className="text-sm text-gray-700">{scheme.budgetOutlay || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Reach</p>
                <p className="text-sm text-gray-700">{scheme.reach || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Commons Type</p>
                <p className="text-sm text-gray-700">{scheme.commonsType || 'Not classified'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Commons Track</p>
                <p className="text-sm text-gray-700 capitalize">{scheme.commonsTrack || 'Not classified'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Governance Flags */}
        {scheme.governanceFlags && scheme.governanceFlags.length > 0 && (
          <Alert className="bg-[#FEF3C7] border-[#D97706] text-[#92400E] mb-8 print:mb-4 print:bg-yellow-50 print:border-yellow-300 print:text-yellow-900">
            <AlertDescription>
              <h3 className="font-bold mb-3 print:text-sm">Governance Flags</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-1 print:gap-1">
                {scheme.governanceFlags.map((flag, idx) => {
                  const { label, severity } = getFlagLabel(flag)
                  return (
                    <div key={idx} className="flex items-start gap-3 print:gap-2 print:text-xs">
                      <div 
                        className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: getSeverityColor(severity) }}
                      />
                      <div className="text-sm print:text-xs">
                        <span className="font-semibold">{flag}:</span> {label}
                      </div>
                    </div>
                  )
                })}
              </div>
              {scheme.classification === "SOC with Governance Gaps" && (
                <p className="text-xs mt-3 italic print:text-[10px]">This scheme passes all 4 tests but has governance gaps. Addressing these would convert it to a clean SOC classification.</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Evidence/Sub-Parameters Section */}
        <div className="mb-12 print:mb-6 print:page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-[#1B4332] mb-6 print:text-xl print:mb-3">Diagnostic Evidence</h2>
          
          {/* Accordion View */}
          {scheme.subParameters ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Accordion type="single" collapsible defaultValue="t1" className="w-full">
                {[
                  { test: 't1', label: 'T1: Resource is a Commons', pass: scheme.tests.t1 },
                  { test: 't2', label: 'T2: Dwellers Benefit', pass: scheme.tests.t2 },
                  { test: 't3', label: 'T3: Clear Economic Opportunity', pass: scheme.tests.t3 },
                  { test: 't4', label: 'T4: Sustainability Lock', pass: scheme.tests.t4 },
                ].map(({ test, label, pass }) => {
                  const testKey = test as 't1' | 't2' | 't3' | 't4'
                  const subParams = scheme.subParameters![testKey]
                  
                  return (
                    <AccordionItem key={test} value={test} className="border-b last:border-0">
                      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-700">{label}</span>
                        {pass ? (
                          <Badge className="bg-[#D1FAE5] text-[#065F46]">PASS</Badge>
                        ) : (
                          <Badge className="bg-[#FEE2E2] text-[#991B1B]">FAIL</Badge>
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 bg-gray-50">
                        {/* Sub-parameters table */}
                        <Table className="mb-4 print:text-xs print:mb-2">
                          <TableHeader>
                            <TableRow className="bg-white border-b-2 border-gray-200 print:bg-gray-50">
                              <TableHead className="font-bold text-[#1B4332] w-1/4 print:text-[10px]">Sub-Parameter</TableHead>
                              <TableHead className="font-bold text-[#1B4332] w-1/4 print:text-[10px]">Score</TableHead>
                              <TableHead className="font-bold text-[#1B4332] w-1/4 print:text-[10px]">Status</TableHead>
                              <TableHead className="font-bold text-[#1B4332] print:text-[10px]">Note</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(subParams as Record<string, any>).map(([paramId, param]) => (
                              <TableRow key={paramId} className="border-b border-gray-200 last:border-0">
                                <TableCell className="font-mono text-xs font-semibold text-[#1B4332]">{paramId}</TableCell>
                                <TableCell className="text-sm font-mono">
                                  {typeof param.score === 'number' ? param.score.toFixed(2) : param.score}
                                </TableCell>
                                <TableCell>
                                  {param.flag ? (
                                    <span className="text-xs bg-[#FEF08A] text-[#92400E] px-2 py-1 rounded">Flag</span>
                                  ) : param.pass ? (
                                    <span className="text-xs bg-[#D1FAE5] text-[#065F46] px-2 py-1 rounded">✓</span>
                                  ) : param.pass === false ? (
                                    <span className="text-xs bg-[#FEE2E2] text-[#991B1B] px-2 py-1 rounded">✗</span>
                                  ) : (
                                    <span className="text-xs text-gray-500">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-xs text-gray-600">{param.note || ''}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        {/* Evidence summary string */}
                        <div className="bg-white border border-gray-200 p-3 rounded text-xs font-mono text-gray-600 whitespace-pre-wrap">
                          {scheme.evidence[testKey]}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          ) : (
            // Simple table view when sub-parameters are not available
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
                  {[
                    { label: "T1: Resource/Commons", result: scheme.tests.t1, text: scheme.evidence.t1 },
                    { label: "T2: Dwellers/Inclusion", result: scheme.tests.t2, text: scheme.evidence.t2 },
                    { label: "T3: Livelihood/Income", result: scheme.tests.t3, text: scheme.evidence.t3 },
                    { label: "T4: Sustainability Lock", result: scheme.tests.t4, text: scheme.evidence.t4 },
                  ].map((row) => (
                    <TableRow key={row.label} className="align-top">
                      <TableCell className="font-semibold text-gray-700 py-4">{row.label}</TableCell>
                      <TableCell className="text-center py-4">{getPassFailBadge(row.result)}</TableCell>
                      <TableCell className="text-sm text-gray-600 leading-relaxed py-4">{row.text}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Upgrade Pathway */}
        {scheme.upgradePathway && scheme.upgradePathway.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6">
              {scheme.classification === "SOC" && "Enhancement Opportunities"}
              {scheme.classification === "SOC with Governance Gaps" && "Governance Gap Remediation"}
              {scheme.classification === "Near-SOC (Operational)" && "Upgrade Pathway — Operational Fix Required"}
              {scheme.classification === "Near-SOC (Structural)" && "Upgrade Pathway — Structural Redesign Required"}
              {scheme.classification === "Non-SOC" && "Upgrade Pathway"}
            </h2>

            {scheme.classification === "Near-SOC (Structural)" && (
              <Alert className="bg-[#FEE2E2] border-[#DC2626] text-[#991B1B] mb-6">
                <AlertDescription>
                  <p className="font-bold mb-2">Critical: T4 Failure Indicates Structural Extractive Loop</p>
                  <p className="text-sm">This scheme is generating income from the commons without a structural guarantee the commons will survive. Scheme redesign, not operational adjustment, is required.</p>
                </AlertDescription>
              </Alert>
            )}

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

        {/* References */}
        {scheme.references && scheme.references.length > 0 && (
          <div className="mb-12 print:mb-6">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6 print:text-xl print:mb-3">Data Sources & References</h2>
            <div className="space-y-4 print:space-y-2">
              {scheme.references.map((ref) => (
                <Card key={ref.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gray-200 text-gray-700">{ref.id}</Badge>
                          {ref.verified && <Badge className="bg-[#D1FAE5] text-[#065F46]">Verified</Badge>}
                          {!ref.verified && <Badge className="bg-[#FEF08A] text-[#92400E]">Pending</Badge>}
                        </div>
                        <a 
                          href={ref.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-[#1B4332] hover:underline block mb-2"
                        >
                          {ref.title} ↗
                        </a>
                        <div className="flex flex-wrap gap-2 items-center mb-2">
                          <Badge variant="outline" className="capitalize text-xs">{ref.type.replace(/_/g, ' ')}</Badge>
                          <span className="text-xs text-gray-500">Accessed: {ref.accessed}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Supports:</p>
                        <div className="flex flex-wrap gap-1">
                          {ref.relevantTo.map((param) => (
                            <Badge key={param} variant="outline" className="text-xs bg-gray-50">
                              {param}
                            </Badge>
                          ))}
                        </div>
                      </div>
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
