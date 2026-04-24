import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const classifications = [
  { label: "SOC", condition: "All 4 tests PASS, ≤1 governance flag absent", color: "bg-[#16A34A] text-white" },
  { label: "SOC with Governance Gaps", condition: "All 4 tests PASS, ≥2 governance flags absent", color: "bg-[#0D9488] text-white" },
  { label: "Near-SOC (Operational)", condition: "3 tests PASS — failure is T1, T2, or T3", color: "bg-[#D97706] text-white" },
  { label: "Near-SOC (Structural)", condition: "3 tests PASS — failure is T4 (extractive loop risk)", color: "bg-[#EA580C] text-white" },
  { label: "Non-SOC", condition: "2 or fewer tests PASS", color: "bg-[#B91C1C] text-white" },
]

const commonsCategories = [
  { label: "Natural / Ecological", detail: "Forests, pastures, water bodies, aquifers, fisheries, biodiversity" },
  { label: "Physical / Infrastructure", detail: "Common irrigation systems, village ponds, check dams, grazing reserves" },
  { label: "Social / Livelihood", detail: "Cooperative labour, shared agricultural practices, common livestock systems" },
  { label: "Knowledge / Cultural", detail: "Traditional knowledge, seed custodianship, community seed banks, cultural governance" },
  { label: "Institutional", detail: "Gram Sabha structures, customary community institutions, forest management bodies" },
  { label: "Digital / Information", detail: "Community data platforms, shared MIS, community monitoring dashboards" },
]

const t1Params = [
  { id: "T1.1", param: "Governance / Ownership Type", type: "Categorical (5 classes)", threshold: "A1 / B / D / E — or A2 if T1.2 ≥ 1", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200" },
  { id: "T1.2", param: "Community Access or Practice Right", type: "Ordinal 0–2", threshold: "≥ 1", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200" },
  { id: "T1.3", param: "Non-Private Resource Expenditure (θ₁)", type: "Continuous [0,1]", threshold: "≥ 0.50", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200" },
  { id: "T1.4", param: "Excludability of Resource Benefits", type: "Ordinal 0–2", threshold: "≥ 1", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200" },
  { id: "T1.5", param: "Resource Boundary Demarcation", type: "Binary", threshold: "Enhancement", gate: "Flag if 0", gateStyle: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "T1.6", param: "No Active Legal Encumbrance", type: "Binary", threshold: "= 1", gate: "Hard — auto-fail if 0", gateStyle: "bg-red-50 text-red-700 border-red-200" },
]

const t1Classes = [
  { code: "A1", desc: "State/public land governed for community use (GP-jurisdiction, notified grazing reserve)", qualifies: true },
  { code: "A2", desc: "State/public land managed for state revenue (mining lease, PSU use, plantation)", qualifies: null },
  { code: "B",  desc: "Community land / CPR governed by traditional institution or village body", qualifies: true },
  { code: "C",  desc: "Private land / privately owned property", qualifies: false },
  { code: "D",  desc: "Mixed (e.g., aquifer underlying state and private land) — if community access rights established", qualifies: true },
  { code: "E",  desc: "Intangible commons — traditional knowledge, seed systems, cultural practices, governance norms", qualifies: true },
]

const t2Params = [
  { id: "T2.1", param: "Fraction of Local Dwellers as Beneficiaries (θ₂)", type: "Continuous [0,1]", threshold: "≥ 0.70", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200", note: "'Local' follows customary use area for pastoral/mobile communities — not a fixed 10 km radius" },
  { id: "T2.2", param: "Marginalised Beneficiary Share (θ₃)", type: "Continuous [0,1]", threshold: "≥ 0.40", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200", note: "SC / ST / de-notified tribes / landless / women-headed / differently-abled-headed households" },
  { id: "T2.3", param: "Functional Community Representative Body", type: "Binary", threshold: "= 1 (functional)", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200", note: "Must have ≥2 documented meetings in prior 12 months with recorded resolutions. Paper-only committees score 0." },
  { id: "T2.4", param: "Grievance / Voice Mechanism", type: "Binary", threshold: "Soft gate", gate: "Flag if 0", gateStyle: "bg-amber-50 text-amber-700 border-amber-200", note: "Absence does not fail T2 but is recorded as a governance gap" },
  { id: "T2.5", param: "Women's Representation ≥ 33% in Governance Body", type: "Binary", threshold: "Enhancement", gate: "Flag if 0", gateStyle: "bg-amber-50 text-amber-700 border-amber-200", note: "Consistent with 73rd Constitutional Amendment provisions" },
]

const t3Params = [
  { id: "T3.1", param: "Livelihood / Income Output Indicator Mandated", type: "Binary", threshold: "= 1", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200", note: "Includes indirect pathways for intangible commons — economic mechanism must be articulated in scheme documents" },
  { id: "T3.2", param: "Incremental Income ΔY / HH / year", type: "Continuous (₹)", threshold: "Observed ≥ ₹3,000 · Projected ≥ ₹5,000", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200", note: "Lower threshold for observed data — real conservative data is more reliable than DPR projections. Projected-only pass is provisional." },
  { id: "T3.3", param: "Income Pathway Diversity", type: "Ordinal 0–3", threshold: "≥ 1", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200", note: "Includes intangible pathways: GI-tagged produce premium, community seed sales, ecotourism from cultural practices, BMC benefit-sharing" },
  { id: "T3.4", param: "Market / Institutional Offtake Mechanism", type: "Binary", threshold: "= 1", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200", note: "Includes GI tags, BMC agreements, community seed variety registration, fair trade certification with institutional buyer" },
  { id: "T3.5", param: "Non-Monetary Livelihood Indicator Tracked", type: "Binary", threshold: "Enhancement", gate: "Flag if 0", gateStyle: "bg-amber-50 text-amber-700 border-amber-200", note: "Food security, nutritional diversity, fodder availability, medicinal plant access. Schemes near ΔY threshold with T3.5=0 likely undercounting true benefit." },
]

const t4Params = [
  { id: "T4.1", param: "Mandatory Replenishment or Continuity Rule", type: "Binary", threshold: "= 1", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200", note: "For intangible commons: documentation mandate, seed bank replenishment obligation, or youth knowledge-transfer component mandated in scheme design" },
  { id: "T4.2", param: "ρ Ratio (natural) / Vitality Index (intangible)", type: "Conditional", threshold: "ρ ≤ 1.2 · VI ≥ 1", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200", note: "Track determined by T1.1 category. ρ = extraction ÷ replenishment. VI: 0=declining / 1=stable / 2=growing." },
  { id: "T4.3", param: "Monitoring & Public Disclosure Frequency", type: "Ordinal 0–3", threshold: "≥ 1 (≥ 2 if climate-stressed)", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200", note: "0=none · 1=annual govt only · 2=quarterly community-accessible · 3=real-time dashboard. Climate-stressed zones require quarterly minimum." },
  { id: "T4.4", param: "Financial Penalty for Non-Compliance", type: "Binary", threshold: "= 1 or T4.5 = 1", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200", note: "Fund withholding, reduced allocation, or disqualification if replenishment obligation unmet" },
  { id: "T4.5", param: "Post-Scheme Continuity Mechanism", type: "Binary", threshold: "= 1 or T4.4 = 1", gate: "Hard", gateStyle: "bg-red-50 text-red-700 border-red-200", note: "For intangible commons: BMC with ongoing mandate, registered seed custodian group, cultural institution with succession plan" },
  { id: "T4.6", param: "Community-Led Monitoring Participation", type: "Binary", threshold: "Enhancement", gate: "Primary upgrade lever", gateStyle: "bg-amber-50 text-amber-700 border-amber-200", note: "Community participation in resource health monitoring — social audits, VER, community monitoring committees. Most critical structural gap for Near-SOC (Structural) schemes." },
  { id: "T4.7", param: "Climate Vulnerability Conditional", type: "Binary trigger", threshold: "Raises T4.3 threshold", gate: "Conditional", gateStyle: "bg-gray-50 text-gray-700 border-gray-200", note: "CGWB over-exploited block / ISFR high fire-risk zone / NDMA drought-prone block / high out-migration community → T4.3 minimum upgrades to ≥ 2" },
]

const governanceFlags = [
  { id: "T1.5", label: "Boundary Unmapped", desc: "Resource boundary not demarcated — T4.2 measurement unreliable", severity: "Low", severityStyle: "bg-gray-100 text-gray-600" },
  { id: "T2.4", label: "No Grievance Mechanism", desc: "No formal channel for excluded community members to raise objections", severity: "Medium", severityStyle: "bg-amber-100 text-amber-700" },
  { id: "T2.5", label: "Women's Representation Gap", desc: "Women below 33% in governance body", severity: "Medium", severityStyle: "bg-amber-100 text-amber-700" },
  { id: "T3.5", label: "Non-Monetary Benefits Untracked", desc: "Food, fodder, medicine access not measured — benefit may be undercounted", severity: "Low", severityStyle: "bg-gray-100 text-gray-600" },
  { id: "T4.6", label: "No Community Monitoring", desc: "All monitoring conducted by government agencies only — community has no role in resource health observation", severity: "High", severityStyle: "bg-red-100 text-red-700" },
]

const allParams = [
  { id: "T1.1", param: "Governance/Ownership Type", type: "Categorical", threshold: "A1/B/D/E (or A2 if T1.2≥1)", gate: "Hard" },
  { id: "T1.2", param: "Community Access/Practice Right", type: "Ordinal 0–2", threshold: "≥ 1", gate: "Hard" },
  { id: "T1.3", param: "Non-Private Expenditure θ₁", type: "Continuous", threshold: "≥ 0.50", gate: "Hard" },
  { id: "T1.4", param: "Excludability of Benefits", type: "Ordinal 0–2", threshold: "≥ 1", gate: "Hard" },
  { id: "T1.5", param: "Resource Boundary Demarcated", type: "Binary", threshold: "Enhancement", gate: "Flag if 0" },
  { id: "T1.6", param: "No Active Legal Encumbrance", type: "Binary", threshold: "= 1", gate: "Hard (auto-fail)" },
  { id: "T2.1", param: "Local Dwellers Fraction θ₂", type: "Continuous", threshold: "≥ 0.70", gate: "Hard" },
  { id: "T2.2", param: "Marginalised Beneficiary Share θ₃", type: "Continuous", threshold: "≥ 0.40", gate: "Hard" },
  { id: "T2.3", param: "Functional Governance Body", type: "Binary", threshold: "= 1 (functional)", gate: "Hard" },
  { id: "T2.4", param: "Grievance/Voice Mechanism", type: "Binary", threshold: "Soft gate", gate: "Flag if 0" },
  { id: "T2.5", param: "Women ≥33% in Governance", type: "Binary", threshold: "Enhancement", gate: "Flag if 0" },
  { id: "T3.1", param: "Livelihood Output Mandated", type: "Binary", threshold: "= 1", gate: "Hard" },
  { id: "T3.2", param: "Incremental Income ΔY", type: "Continuous ₹", threshold: "Observed ≥₹3,000 · Projected ≥₹5,000", gate: "Hard" },
  { id: "T3.3", param: "Income Pathway Diversity", type: "Ordinal 0–3", threshold: "≥ 1", gate: "Hard" },
  { id: "T3.4", param: "Market/Institutional Offtake", type: "Binary", threshold: "= 1", gate: "Hard" },
  { id: "T3.5", param: "Non-Monetary Benefits Tracked", type: "Binary", threshold: "Enhancement", gate: "Flag if 0" },
  { id: "T4.1", param: "Mandatory Replenishment Rule", type: "Binary", threshold: "= 1", gate: "Hard" },
  { id: "T4.2", param: "ρ Ratio / Vitality Index", type: "Conditional", threshold: "ρ ≤ 1.2 · VI ≥ 1", gate: "Hard" },
  { id: "T4.3", param: "Monitoring & Disclosure Frequency", type: "Ordinal 0–3", threshold: "≥1 (≥2 if climate-stressed)", gate: "Hard" },
  { id: "T4.4", param: "Financial Penalty Exists", type: "Binary", threshold: "= 1 or T4.5 = 1", gate: "Hard" },
  { id: "T4.5", param: "Post-Scheme Continuity Mechanism", type: "Binary", threshold: "= 1 or T4.4 = 1", gate: "Hard" },
  { id: "T4.6", param: "Community-Led Monitoring", type: "Binary", threshold: "Enhancement", gate: "Primary upgrade lever" },
  { id: "T4.7", param: "Climate Vulnerability Trigger", type: "Binary trigger", threshold: "Conditional", gate: "Raises T4.3" },
]

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl font-bold text-[#1B4332] mb-8 print:text-2xl print:mb-4">{children}</h2>
}

function TestCard({
  id, title, description, params, passLogic, children
}: {
  id: string
  title: string
  description: string
  params: typeof t1Params
  passLogic: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-10 print:mb-6 print:break-inside-avoid">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-lg shrink-0 print:w-8 print:h-8 print:text-sm">
          {id}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#1B4332] print:text-lg">{title}</h3>
          <p className="text-gray-600 text-sm mt-0.5 print:text-xs">{description}</p>
        </div>
      </div>

      {children}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto print:shadow-none print:border-gray-300 mb-4">
        <Table>
          <TableHeader className="bg-gray-50 print:bg-gray-100">
            <TableRow>
              <TableHead className="font-bold text-[#1B4332] w-16 print:text-xs">ID</TableHead>
              <TableHead className="font-bold text-[#1B4332] print:text-xs">Parameter</TableHead>
              <TableHead className="font-bold text-[#1B4332] print:text-xs hidden md:table-cell">Type</TableHead>
              <TableHead className="font-bold text-[#1B4332] print:text-xs">Threshold</TableHead>
              <TableHead className="font-bold text-[#1B4332] print:text-xs">Gate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {params.map((row, idx) => (
              <TableRow key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <TableCell className="font-mono font-bold text-[#1B4332] text-sm py-3 print:text-xs print:py-1">{row.id}</TableCell>
                <TableCell className="py-3 print:py-1">
                  <p className="text-sm font-medium text-gray-800 print:text-xs">{row.param}</p>
                  {"note" in row && row.note && (
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed print:hidden">{row.note}</p>
                  )}
                </TableCell>
                <TableCell className="text-xs text-gray-600 py-3 print:py-1 hidden md:table-cell print:text-[10px]">{row.type}</TableCell>
                <TableCell className="text-sm text-gray-700 py-3 print:text-xs print:py-1">{row.threshold}</TableCell>
                <TableCell className="py-3 print:py-1">
                  <Badge variant="outline" className={`text-xs ${row.gateStyle}`}>
                    {row.gate}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-lg p-4 print:p-2 print:text-xs">
        <p className="text-xs font-bold text-[#1B4332] uppercase tracking-widest mb-2 print:mb-1">Pass / Fail Logic</p>
        <p className="text-sm text-gray-700 font-mono leading-relaxed print:text-xs">{passLogic}</p>
      </div>
    </div>
  )
}

export default function FrameworkPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-6xl print:py-6 print:px-2">

        {/* Header */}
        <div className="mb-16 print:mb-8">
          <h1 className="text-5xl font-bold text-[#1B4332] mb-3 print:text-3xl">
            SOC Diagnostic Framework
          </h1>
          <p className="text-xl text-[#2D6A4F] font-semibold mb-4 print:text-base">
            Quantitative Sub-Parameters for Deterministic Commons Classification
          </p>
          <p className="text-base text-gray-600 leading-relaxed max-w-4xl print:text-sm">
            The Shared-Outcome Commons (SOC) framework is a policy-analytic tool that classifies government schemes by whether they structurally function as commons-based economic opportunities — as opposed to private-good subsidies or pure public-infrastructure provisions. Twenty-three sub-parameters across four tests produce a deterministic, auditable classification for any scheme.
          </p>
        </div>

        {/* Definition of Commons */}
        <div className="mb-16 print:mb-8">
          <SectionHeading>Definition of Commons</SectionHeading>

          <div className="bg-white border-l-4 border-[#1B4332] p-8 rounded-r-lg shadow-sm mb-8 print:p-4 print:shadow-none print:border-gray-400">
            <p className="text-lg text-gray-700 leading-relaxed font-serif italic print:text-sm">
              A &lsquo;commons&rsquo; is any resource — natural, physical, social, cultural, or knowledge-based — that is (a) not exclusively privately owned or controlled, (b) accessible to a defined community by legal right, customary practice, or constitutional spirit, and (c) whose degradation, enclosure, or neglect imposes costs on that community&rsquo;s ecological, economic, or cultural wellbeing. Commons are defined primarily by their governance regime — collective stewardship and shared benefit — not by legal ownership category alone.
            </p>
          </div>

          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Categories of Commons Recognised</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 print:grid-cols-3 print:gap-2">
            {commonsCategories.map((cat) => (
              <div key={cat.label} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm print:shadow-none print:p-2">
                <p className="text-sm font-bold text-[#1B4332] mb-1 print:text-xs">{cat.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed print:hidden">{cat.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Master Decision Rule */}
        <div className="mb-16 print:mb-8">
          <SectionHeading>Master Decision Rule</SectionHeading>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 print:shadow-none print:border-gray-300">
            <Table>
              <TableHeader className="bg-gray-50 print:bg-gray-100">
                <TableRow>
                  <TableHead className="font-bold text-[#1B4332] w-2/5 print:text-xs">Classification</TableHead>
                  <TableHead className="font-bold text-[#1B4332] print:text-xs">Condition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classifications.map((c) => (
                  <TableRow key={c.label}>
                    <TableCell className="py-4 print:py-2">
                      <Badge className={`${c.color} text-sm px-3 py-1 print:text-xs print:px-2 print:py-0`}>
                        {c.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4 print:text-xs print:py-2">{c.condition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-white border-l-4 border-[#EA580C] p-6 rounded-r-lg print:p-3 print:shadow-none">
            <p className="text-sm font-bold text-[#EA580C] uppercase tracking-widest mb-2 print:text-xs">Near-SOC (Structural) — Highest-Priority Upgrade Target</p>
            <p className="text-sm text-gray-700 leading-relaxed print:text-xs">
              A T4 failure is treated as more severe than a T1–T3 failure. It indicates an extractive feedback loop — the scheme generates income from the commons but contains no structural lock against depletion. This is a design flaw requiring scheme redesign, not an implementation gap that can be corrected operationally.
            </p>
          </div>
        </div>

        {/* Four Tests */}
        <div className="mb-16 print:mb-8">
          <SectionHeading>The Four Tests</SectionHeading>

          {/* T1 */}
          <TestCard
            id="T1"
            title="Resource is a Commons"
            description="Verifies that the scheme's primary resource qualifies as a commons — not exclusively privately owned, accessible to a defined community by right, and without active diversion."
            params={t1Params}
            passLogic="[T1.1 ∈ {A1, B, D, E}] OR [T1.1 = A2 AND T1.2 ≥ 1] AND T1.2 ≥ 1 AND θ₁ ≥ 0.50 AND T1.4 ≥ 1 AND T1.6 = 1  →  PASS"
          >
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4 print:shadow-none print:border-gray-300">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-xs font-bold text-[#1B4332] uppercase tracking-widest">T1.1 Ownership Class Reference</p>
              </div>
              <Table>
                <TableBody>
                  {t1Classes.map((cls) => (
                    <TableRow key={cls.code} className="border-b border-gray-100 last:border-0">
                      <TableCell className="font-mono font-bold text-[#1B4332] w-12 py-2 print:text-xs">{cls.code}</TableCell>
                      <TableCell className="text-sm text-gray-700 py-2 print:text-xs">{cls.desc}</TableCell>
                      <TableCell className="text-right py-2">
                        {cls.qualifies === true && <Badge className="bg-[#D1FAE5] text-[#065F46] text-xs">Commons</Badge>}
                        {cls.qualifies === false && <Badge className="bg-[#FEE2E2] text-[#991B1B] text-xs">Not Commons</Badge>}
                        {cls.qualifies === null && <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-xs">Conditional</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TestCard>

          {/* T2 */}
          <TestCard
            id="T2"
            title="Dwellers Benefit"
            description="Ensures the geographically and economically proximate community is the primary beneficiary — screening out schemes that exploit commons but channel gains to distant actors or elite capture within the community."
            params={t2Params}
            passLogic="θ₂ ≥ 0.70 AND θ₃ ≥ 0.40 AND T2.3 = 1  →  PASS     |     T2.4 = 0 → Governance gap flag     |     T2.5 = 0 → Upgrade pathway flag"
          />

          {/* T3 */}
          <TestCard
            id="T3"
            title="Clear Economic Opportunity"
            description="Confirms the scheme translates commons access into a measurable income or livelihood stream — ruling out purely protective or infrastructure schemes where no economic pathway exists for dwellers."
            params={t3Params}
            passLogic="T3.1 = 1 AND ΔY ≥ ₹3,000 (observed) or ≥ ₹5,000 (projected) AND T3.3 ≥ 1 AND T3.4 = 1  →  PASS"
          >
            <div className="grid grid-cols-2 gap-3 mb-4 print:gap-2">
              <div className="bg-white border border-gray-200 rounded-lg p-4 print:p-2">
                <p className="text-xs font-bold text-[#1B4332] uppercase tracking-widest mb-1 print:text-[10px]">Observed ΔY</p>
                <p className="text-2xl font-bold text-[#1B4332] print:text-base">₹3,000</p>
                <p className="text-xs text-gray-500 mt-1 print:text-[10px]">Verified from evaluations or MIS. Governs when available.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 print:p-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 print:text-[10px]">Projected ΔY</p>
                <p className="text-2xl font-bold text-gray-700 print:text-base">₹5,000</p>
                <p className="text-xs text-gray-500 mt-1 print:text-[10px]">From DPR / scheme guidelines. Pass is provisional — re-verify at mid-term.</p>
              </div>
            </div>
          </TestCard>

          {/* T4 */}
          <TestCard
            id="T4"
            title="Sustainability Lock"
            description="The most diagnostic test. Checks for a structurally mandated replenishment or continuity obligation — preventing the scheme from creating an extractive feedback loop where economic opportunity accelerates depletion without a binding correction mechanism."
            params={t4Params}
            passLogic="T4.1 = 1 AND [ρ ≤ 1.2 (natural) OR VI ≥ 1 (intangible)] AND T4.3 ≥ 1 [or ≥ 2 if T4.7 triggered] AND (T4.4 = 1 OR T4.5 = 1)  →  PASS"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 print:gap-2">
              <div className="bg-white border border-gray-200 rounded-lg p-4 print:p-2">
                <p className="text-xs font-bold text-[#1B4332] uppercase tracking-widest mb-2 print:text-[10px]">T4.2 — Natural Commons Track</p>
                <p className="text-sm text-gray-700 leading-relaxed print:text-xs">
                  <span className="font-mono font-bold">ρ = Extraction ÷ Replenishment</span><br />
                  ρ ≤ 1.0 = sustainable · ρ ≤ 1.2 = acceptable · ρ &gt; 1.2 = fail<br />
                  <span className="text-xs text-gray-500">Applies to water, forest biomass, soil, fisheries, pasture.</span>
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 print:p-2">
                <p className="text-xs font-bold text-[#1B4332] uppercase tracking-widest mb-2 print:text-[10px]">T4.2 — Intangible Commons Track</p>
                <p className="text-sm text-gray-700 leading-relaxed print:text-xs">
                  <span className="font-mono font-bold">VI: 0 = declining · 1 = stable · 2 = growing</span><br />
                  VI ≥ 1 = pass · VI = 0 = fail<br />
                  <span className="text-xs text-gray-500">Applies to T1.1=E: knowledge, cultural, seed, institutional commons.</span>
                </p>
              </div>
            </div>
          </TestCard>
        </div>

        {/* Governance Flags */}
        <div className="mb-16 print:mb-8">
          <SectionHeading>Governance Flags</SectionHeading>

          <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-3xl print:text-xs print:mb-3">
            Enhancement variables do not fail individual tests. They accumulate at the Master Decision Rule level. A scheme that passes all four tests but has ≥ 2 flags absent is classified as <strong>SOC with Governance Gaps</strong> rather than a clean SOC. Each flag also identifies a targeted upgrade action.
          </p>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-gray-300">
            <Table>
              <TableHeader className="bg-gray-50 print:bg-gray-100">
                <TableRow>
                  <TableHead className="font-bold text-[#1B4332] w-20 print:text-xs">Flag</TableHead>
                  <TableHead className="font-bold text-[#1B4332] print:text-xs">Label</TableHead>
                  <TableHead className="font-bold text-[#1B4332] print:text-xs">What It Signals</TableHead>
                  <TableHead className="font-bold text-[#1B4332] w-24 print:text-xs">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {governanceFlags.map((flag, idx) => (
                  <TableRow key={flag.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <TableCell className="font-mono font-bold text-[#1B4332] py-3 print:text-xs print:py-1">{flag.id}</TableCell>
                    <TableCell className="font-semibold text-gray-800 text-sm py-3 print:text-xs print:py-1">{flag.label}</TableCell>
                    <TableCell className="text-sm text-gray-600 py-3 print:text-xs print:py-1">{flag.desc}</TableCell>
                    <TableCell className="py-3 print:py-1">
                      <Badge className={`text-xs ${flag.severityStyle}`}>{flag.severity}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Consolidated Reference */}
        <div className="mb-16 print:mb-8 print:break-inside-avoid">
          <SectionHeading>Consolidated Sub-Parameter Reference</SectionHeading>
          <p className="text-sm text-gray-600 mb-6 print:text-xs print:mb-3">All 23 sub-parameters across four tests.</p>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto print:shadow-none print:border-gray-300">
            <Table>
              <TableHeader className="bg-[#1B4332] print:bg-[#1B4332]">
                <TableRow>
                  <TableHead className="font-bold text-white w-16 print:text-[10px]">ID</TableHead>
                  <TableHead className="font-bold text-white print:text-[10px]">Parameter</TableHead>
                  <TableHead className="font-bold text-white print:text-[10px] hidden md:table-cell">Type</TableHead>
                  <TableHead className="font-bold text-white print:text-[10px]">Threshold</TableHead>
                  <TableHead className="font-bold text-white print:text-[10px]">Gate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allParams.map((row, idx) => {
                  const isHard = row.gate.startsWith("Hard")
                  const isFlag = row.gate.startsWith("Flag") || row.gate === "Primary upgrade lever"
                  return (
                    <TableRow key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <TableCell className="font-mono font-bold text-[#1B4332] text-sm py-2 print:text-[10px] print:py-1">{row.id}</TableCell>
                      <TableCell className="text-sm text-gray-700 py-2 print:text-[10px] print:py-1">{row.param}</TableCell>
                      <TableCell className="text-xs text-gray-500 py-2 print:text-[10px] print:py-1 hidden md:table-cell">{row.type}</TableCell>
                      <TableCell className="text-sm text-gray-700 py-2 print:text-[10px] print:py-1">{row.threshold}</TableCell>
                      <TableCell className="py-2 print:py-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            isHard ? "bg-red-50 text-red-700 border-red-200" :
                            isFlag ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {row.gate}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-12 pt-8 border-t border-gray-300 text-center text-xs text-gray-600">
          <p className="font-semibold text-gray-700 mb-1">SOC Policy Diagnostic Framework</p>
          <p>Foundation for Ecological Security (FES) · IIM Raipur · {new Date().getFullYear()}</p>
        </div>

      </main>
    </div>
  )
}
