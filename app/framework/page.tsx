import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function FrameworkPage() {
  const tests = [
    {
      id: "T1",
      title: "Resource is a Commons",
      description: "Evaluates whether the resource base is legally owned communally and managed with formal access rights.",
      thresholds: [
        "Legal ownership: Type A, B, or D",
        "Community access right formalised",
        ">50% spend on non-private assets",
        "Excludability score ≥1"
      ]
    },
    {
      id: "T2",
      title: "Dwellers Benefit",
      description: "Ensures local, marginalised populations capture the primary benefits and have governance voice.",
      thresholds: [
        "≥70% local beneficiaries",
        "≥40% marginalised beneficiaries",
        "Mandatory community representative body"
      ]
    },
    {
      id: "T3",
      title: "Clear Economic Opportunity",
      description: "Confirms the scheme generates measurable, incremental livelihood income with assured offtake.",
      thresholds: [
        "Mandated livelihood output indicator",
        "Incremental income ≥₹5,000/HH/year",
        "At least 1 income pathway",
        "Market/institutional offtake mechanism"
      ]
    },
    {
      id: "T4",
      title: "Sustainability Lock",
      description: "Guarantees the resource base is not depleted through mandatory replenishment rules and monitoring.",
      thresholds: [
        "Mandatory replenishment rule",
        "Extraction/replenishment ratio ≤1.2",
        "Monitoring frequency ≥annual",
        "Financial penalty or O&M fund exists"
      ]
    }
  ]

  const subParams = [
    { test: "T1.1", param: "Ownership Type", detail: "Legal classification (A/B/D)" },
    { test: "T1.2", param: "Access Right", detail: "Community access formally recognised" },
    { test: "T1.3", param: "Non-Private Expenditure", detail: "Fraction ≥0.50" },
    { test: "T1.4", param: "Excludability Score", detail: "Score ≥1" },
    { test: "T2.1", param: "Local Beneficiaries", detail: "Fraction ≥0.70" },
    { test: "T2.2", param: "Marginalised Share", detail: "Fraction ≥0.40" },
    { test: "T2.3", param: "Governance Body", detail: "Mandatory community representative" },
    { test: "T3.1", param: "Income Indicator", detail: "Livelihood output mandated" },
    { test: "T3.3", param: "Pathway Diversity", detail: "Count ≥1" },
    { test: "T3.4", param: "Offtake Mechanism", detail: "Market or institutional" },
    { test: "Δ-Y", param: "Incremental Income", detail: "≥₹5,000/HH/year" },
    { test: "T4.1", param: "Replenishment Rule", detail: "Mandatory provision" },
    { test: "T4.2", param: "E/R Ratio", detail: "≤1.2" },
    { test: "T4.3", param: "Monitoring Frequency", detail: "≥annual" },
    { test: "T4.4/T4.5", param: "Penalty/O&M Fund", detail: "At least one mechanism" }
  ]

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center lg:text-left">
          <h1 className="text-5xl font-bold text-[#1B4332] mb-3">
            SOC Policy Diagnostic Framework
          </h1>
          <p className="text-xl text-[#2D6A4F] font-semibold">
            Shared-Outcome Commons — Methodology and Scoring Guide
          </p>
        </div>

        {/* Intro Paragraph */}
        <div className="mb-16 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-lg text-gray-700 leading-relaxed space-y-4">
            <span className="block">
              The SOC framework evaluates government schemes against four independent tests to determine whether they deliver commons-based livelihoods. 
              A scheme is SOC-compliant only if it <strong>passes all four tests</strong>. Near-SOC schemes pass 3 of 4 and are candidates for targeted upgrade.
            </span>
          </p>
        </div>

        {/* The Four Tests */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-8">The Four Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => (
              <Card key={test.id} className="bg-white border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-1 bg-linear-to-r from-[#1B4332] to-[#2D6A4F]" />
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-lg shrink-0">
                      {test.id}
                    </div>
                    <div className="grow">
                      <CardTitle className="text-lg font-bold text-[#1B4332]">
                        {test.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Thresholds:</p>
                    <ul className="space-y-2">
                      {test.thresholds.map((threshold, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-[#2D6A4F] font-bold shrink-0">•</span>
                          <span>{threshold}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Classification System */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-8">Classification System</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SOC */}
            <div className="rounded-xl p-8 border-2 border-[#10B981] bg-[#D1FAE5]">
              <h3 className="text-2xl font-bold text-[#047857] mb-3">SOC</h3>
              <p className="text-sm text-[#047857] font-semibold mb-4">All 4 tests PASS</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Scheme structurally generates commons-based livelihoods with sustainable resource management and equitable local benefit.
              </p>
            </div>

            {/* Near-SOC */}
            <div className="rounded-xl p-8 border-2 border-[#F59E0B] bg-[#FEF3C7]">
              <h3 className="text-2xl font-bold text-[#B45309] mb-3">Near-SOC</h3>
              <p className="text-sm text-[#B45309] font-semibold mb-4">Exactly 3 tests PASS</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                One targeted design fix required. Typically missing either governance clarity, market linkage, or sustainability mechanism.
              </p>
            </div>

            {/* Non-SOC */}
            <div className="rounded-xl p-8 border-2 border-[#EF4444] bg-[#FEE2E2]">
              <h3 className="text-2xl font-bold text-[#991B1B] mb-3">Non-SOC</h3>
              <p className="text-sm text-[#991B1B] font-semibold mb-4">2 or fewer tests PASS</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Architectural redesign required. Scheme lacks fundamental commons logic or resource sustainability framework.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Parameters Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-8">Sub-Parameters Reference</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-[#1B4332]/5">
                <TableRow>
                  <TableHead className="font-bold text-[#1B4332]">Test</TableHead>
                  <TableHead className="font-bold text-[#1B4332]">Sub-Parameter</TableHead>
                  <TableHead className="font-bold text-[#1B4332]">Threshold / Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subParams.map((param, idx) => (
                  <TableRow key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <TableCell className="font-bold text-[#1B4332] py-3">
                      <span className="bg-[#1B4332]/10 px-3 py-1 rounded-full text-sm">{param.test}</span>
                    </TableCell>
                    <TableCell className="text-gray-700 font-medium py-3">{param.param}</TableCell>
                    <TableCell className="text-gray-600 text-sm py-3 italic">{param.detail}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-8">
          <p className="font-semibold text-gray-600 mb-1">Framework developed by</p>
          <p>Foundation for Ecological Security (FES) | IIM Raipur Internship | April 2026</p>
        </div>
      </main>
    </div>
  )
}
