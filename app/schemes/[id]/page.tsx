import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllSchemes } from "@/lib/data"
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Master Dictionary of all extracted questions
const QUESTION_LABELS: Record<string, string> = {
  "Q1": "Scheme Name", "Q2": "Department / Implementing Agency", "Q3": "Scheme Guidelines / Reference Documents", "Q4": "Primary Resource Type", "Q5": "Describe resource (location, type, size, boundaries)", "Q6": "Is the resource boundary demarcated in a public document?", "Q7": "Basis for community access or practice right", "Q8": "Is there any active legal or administrative process that could override community access?", "Q9": "Total scheme expenditure (last FY or project period)", "Q10": "Expenditure on common/public/community resources", "Q11": "Expenditure on private assets or assets benefiting only private individuals", "Q12": "θ₁ = Expenditure on commons ÷ Total expenditure", "Q13": "Supporting documents for financial questions", "Q14": "Are the benefits of the resource excludable?", "Q15": "Total number of scheme beneficiaries", "Q16": "Beneficiaries residing within the operational commons area (local dwellers)", "Q17": "Definition of 'local' applied for this audit", "Q18": "θ₂ = Local beneficiaries ÷ Total beneficiaries", "Q19": "Number of beneficiaries from marginalised households", "Q20": "θ₃ = Marginalised beneficiaries ÷ Total beneficiaries", "Q21": "Are traditional knowledge holders included as primary beneficiaries?", "Q22": "Is there a formally constituted community representative body?", "Q23": "Does the governance body have ≥33% women's representation?", "Q24": "Is there a formal grievance/voice mechanism for non-beneficiaries?", "Q25": "Does the scheme mandate a livelihood or income output indicator or pathway?", "Q26": "Incremental income per beneficiary household per year (ΔY)", "Q27": "How many distinct livelihood pathways are enabled by the scheme?", "Q28": "Is there a market or institutional offtake mechanism for produce or services?", "Q29": "Does the scheme track any non-monetary livelihood indicators?", "Q30": "Does the scheme mandate a replenishment/renewal rule for the commons resource?", "Q31": "Which sustainability track applies to this scheme?", "Q32": "ρ = Annual extraction ÷ Annual replenishment", "Q33": "Vitality Index", "Q34": "Monitoring frequency for the commons resource / replenishment compliance", "Q35": "Is the commons resource under documented climate/ecological stress?", "Q36": "Is there a penalty or sanction mechanism for violation of rules?", "Q37": "Is there a documented mechanism for post-scheme continuity of governance?", "Q38": "Does the community have a formal monitoring role?"
}

// Master Dictionary for Schema Logic & Context
const QUESTION_METADATA: Record<string, any> = {
  "Q4": { valid_values: { "A1": "State/public land/resource formally notified for community use", "A2": "State/public land/resource managed for state revenue", "B": "Community land / Common Pool Resource governed by community or traditional institution", "C": "Private land or property (AUTOMATIC FAIL)", "D": "Mixed — describe both components", "E": "Intangible/knowledge/cultural/institutional commons" } },
  "Q6": { valid_values: { "Yes": "Attached map, survey number, GP resolution, or boundary description exists", "No": "No public boundary document" } },
  "Q7": { valid_values: { "0": "Purely administrative discretion; no legal or customary basis", "1": "Customary/traditionally recognised right", "2": "Statutory/legally enforceable right" }, pass_threshold: "T1.2 ≥ 1" },
  "Q8": { valid_values: { "No": "No active diversion order, mining lease, land-use change, SEZ, compulsory acquisition, or equivalent", "Yes": "Active override exists (AUTOMATIC FAIL)" } },
  "Q10": { include: "Outputs flowing to non-excludable or community-level benefits: common land, water bodies, watersheds, community forests, common pastures, intangible commons, infrastructure on common land serving entire community.", exclude: "Expenditure where outputs flow exclusively to private actors, even if located on common land." },
  "Q12": { pass_threshold: "θ₁ ≥ 0.50", formula: { lhs: "θ₁", num: "Q10", den: "Q9" } },
  "Q14": { valid_values: { "0": "Fully excludable — one private actor only", "1": "Partially excludable — defined group, non-members excluded", "2": "Non-excludable — benefits accessible to entire community" }, pass_threshold: "T1.4 ≥ 1" },
  "Q17": { valid_values: { "Settled_communities": "Within GP/block/watershed or 10 km radius of the commons", "Pastoral_mobile_seasonal": "Within the customary use area as documented" } },
  "Q18": { pass_threshold: "θ₂ ≥ 0.70", formula: { lhs: "θ₂", num: "Q16", den: "Q15" } },
  "Q19": { include: "SC / ST / de-notified tribes / landless / women-headed / differently-abled-headed / elderly-headed" },
  "Q20": { pass_threshold: "θ₃ ≥ 0.40", formula: { lhs: "θ₃", num: "Q19", den: "Q15" } },
  "Q22": { pass_threshold: "ALL three sub-answers = Yes" },
  "Q23": { valid_values: { "Yes": "≥33% women per 73rd Constitutional Amendment", "No": "Below 33% or not documented" } },
  "Q24": { valid_values: { "Yes": "Institutionally mandated mechanism (Gram Sabha complaint process, Social Audit, MIS grievance portal)", "No": "No formal mechanism" } },
  "Q25": { valid_values: { "Yes": "Mandatory output indicator measuring income/livelihood OR explicit livelihood pathway articulated", "No": "Outputs are purely physical infrastructure with no livelihood sub-indicator" }, pass_threshold: "T3.1 = Yes" },
  "Q26": { pass_threshold: "Observed ≥ ₹3,000 OR Projected ≥ ₹5,000" },
  "Q27": { valid_values: { "0": "None", "1": "Single pathway", "2": "Two pathways", "3": "Three or more" }, pass_threshold: "T3.3 ≥ 1" },
  "Q28": { valid_values: { "Yes": "Guaranteed buyer or institutional demand channel exists and is operational", "No": "Purely market-dependent with no institutional backstop" }, pass_threshold: "T3.4 = Yes" },
  "Q29": { valid_values: { "Yes": "MIS/evaluation tracks ≥1 non-monetary metric", "No": "Only monetary metrics" } },
  "Q30": { valid_values: { "Yes": "Guidelines/DPR mandate a replenishment rule", "No": "No replenishment/renewal obligation in official scheme design" }, pass_threshold: "T4.1 = Yes" },
  "Q31": { valid_values: { "RhoRatio": "Natural/physical commons", "VitalityIndex": "Intangible/knowledge/cultural commons" } },
  "Q32": { pass_threshold: "ρ ≤ 1.2" },
  "Q33": { pass_threshold: "VI ≥ 1 with required core component" },
  "Q34": { valid_values: { "0": "No scheduled monitoring", "1": "Annual monitoring only", "2": "Semi-annual or more frequent monitoring", "3": "Continuous / real-time" }, pass_threshold: "≥ 1 (or ≥ 2 if climate stressed)" },
  "Q35": { valid_values: { "Yes": "Resource lies in an officially notified stress zone", "No": "No notified stress classification" } },
  "Q36": { valid_values: { "Yes": "Documented penalty exists", "No": "No enforceable consequence for violation" } },
  "Q37": { valid_values: { "Yes": "Institutional handover plan exists", "No": "No continuity provision" } },
  "Q38": { valid_values: { "Yes": "Scheme mandates community monitoring", "No": "Monitoring is purely departmental" } }
};

export function generateStaticParams() {
  const schemes = getAllSchemes()
  return schemes.map((scheme: any) => ({
    id: scheme.id, 
  }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SchemeDetailPage({ params }: PageProps) {
  const { id } = await params
  const schemes = getAllSchemes()
  const legacyScheme = schemes.find((s: any) => s.id === id)

  if (!legacyScheme || !legacyScheme.canonicalData) {
    notFound()
  }

  const scheme = legacyScheme.canonicalData

  const score = ['t1', 't2', 't3', 't4'].filter(
    t => scheme.tests?.[t as keyof typeof scheme.tests]?.status === 'PASS' || scheme.tests?.[t as keyof typeof scheme.tests]?.status === 'PASS-PROVISIONAL'
  ).length;

  // Strict thematic gradients instead of standard traffic light colors
  const getClassificationStyles = (classification: string) => {
    switch (classification) {
      case "SOC": return "bg-[#1B4332] text-white" 
      case "SOC with Governance Gaps": return "bg-[#2D6A4F] text-white"
      case "Near-SOC (Operational)": return "bg-[#40916C] text-white"
      case "Near-SOC (Structural)": return "bg-[#52B788] text-white"
      case "Adjacent / Non-SOC": return "bg-[#74A58F] text-white" // Replaced the red with a soft muted sage
      default: return "bg-[#9CA3AF] text-white"
    }
  }

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

  // Strict thematic dots replacing the warning ambers/reds
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#1B4332' // Deep green for primary alerts
      case 'medium': return '#40916C' // Mid green for secondary alerts
      case 'low': return '#9CA3AF' // Slate for minor notes
      default: return '#9CA3AF'
    }
  }

  const allQuestions = {
    ...(scheme.tests?.t1?.questionValues || {}),
    ...(scheme.tests?.t2?.questionValues || {}),
    ...(scheme.tests?.t3?.questionValues || {}),
    ...(scheme.tests?.t4?.questionValues || {})
  };

  const sortedQIDs = Object.keys(allQuestions).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10);
    const numB = parseInt(b.replace(/\D/g, ''), 10);
    return numA - numB;
  });

  const allUnverified = [
    ...(scheme.tests?.t1?.unverifiedFields || []),
    ...(scheme.tests?.t2?.unverifiedFields || []),
    ...(scheme.tests?.t3?.unverifiedFields || []),
    ...(scheme.tests?.t4?.unverifiedFields || [])
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Link 
          href={`/departments/${scheme.departmentSlug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#1B4332] hover:text-[#2D6A4F] mb-6 group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> 
          Back to {scheme.departmentName}
        </Link>

        <nav className="flex mb-6 text-sm text-gray-500 gap-2 items-center flex-wrap">
          <Link href="/departments" className="hover:text-[#1B4332] whitespace-nowrap">Departments</Link>
          <span>/</span>
          <Link href={`/departments/${scheme.departmentSlug}`} className="hover:text-[#1B4332] whitespace-nowrap">
            {scheme.departmentName.replace(" Department", "")}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-full">{scheme.schemeName}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-[#1B4332] mb-2 break-words">{scheme.schemeName}</h1>
          </div>
          <div className="shrink-0 text-center md:text-right">
            <Badge className={`text-lg px-4 py-1 mb-1 shadow-sm border-transparent ${getClassificationStyles(scheme.classification?.value)}`}>
              {scheme.classification?.value || "Unknown"}
            </Badge>
            <p className="text-sm font-bold text-gray-500 mt-2">Diagnostic Score: {score}/4</p>
          </div>
        </div>

        {scheme.classification?.reasoning && scheme.classification.reasoning.length > 0 && (
          <div className="bg-white border border-[#CFDCD5] rounded-xl p-6 mb-8 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-4">Classification Logic</h4>
            <ul className="list-disc pl-5 text-[15px] text-gray-700 space-y-2">
              {scheme.classification.reasoning.map((reason: string, idx: number) => (
                <li key={idx} className="break-words leading-relaxed">{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {scheme.objectiveText && (
          <div className="bg-white border-l-[6px] border-[#1B4332] p-6 rounded-xl shadow-sm mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1B4332] mb-3">Scheme Objective</h3>
            <p className="text-gray-800 leading-relaxed text-lg break-words">{scheme.objectiveText}</p>
          </div>
        )}

        {/* Replaced Yellow Alert with Thematic Soft Green/Slate Alert */}
        {scheme.governanceFlags && scheme.governanceFlags.length > 0 && (
          <Alert className="bg-[#E8EDE9] border-[#CFDCD5] text-[#1B4332] mb-8 shadow-sm rounded-xl">
            <AlertDescription>
              <h3 className="font-bold text-[#082A1C] mb-4">Governance Observations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scheme.governanceFlags.map((flag: string, idx: number) => {
                  const { label, severity } = getFlagLabel(flag)
                  return (
                    <div key={idx} className="flex items-start gap-3 bg-white/60 p-3 rounded-lg border border-[#CFDCD5]/50">
                      <div 
                        className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: getSeverityColor(severity) }}
                      />
                      <div className="text-sm min-w-0 break-words text-gray-800">
                        <span className="font-bold text-[#1B4332]">{flag}:</span> {label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Replaced Yellow Unverified Alert with Clean Slate/Gray Alert */}
        {allUnverified.length > 0 && (
          <Alert className="bg-gray-50 border-gray-200 mb-8 shadow-sm rounded-xl">
            <AlertDescription className="text-sm text-gray-700 flex items-start gap-3 break-words">
              <span className="text-lg shrink-0 mt-0.5 opacity-80">📋</span>
              <div className="flex flex-col gap-1.5">
                <strong className="text-gray-900">Pending Documentation</strong>
                <span className="leading-relaxed">The following data points require further verification before this audit is finalized: <span className="font-mono bg-white text-gray-800 px-2 py-1 rounded-md border border-gray-200 shadow-sm ml-1 break-all">{allUnverified.join(", ")}</span></span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Redesigned Questionnaire Architecture - Open, Segmented, Breathable */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Diagnostic Questionnaire</h2>
          
          {/* Changed from one giant dark box to an open layout using separated cards */}
          <div className="space-y-4">
            <Accordion type="multiple" className="w-full space-y-4">
              {sortedQIDs.map((qid) => {
                const data = allQuestions[qid as keyof typeof allQuestions] as any;
                const questionLabel = QUESTION_LABELS[qid] || "Diagnostic Finding";
                const isUnverified = allUnverified.includes(qid);
                const meta = QUESTION_METADATA[qid] || {};

                // Handle composite data safety
                let displayVal = data.v !== undefined && data.v !== null && data.v !== "" ? String(data.v) : null;
                if (!displayVal && qid === "Q22" && data["22a"]) displayVal = "Composite Check Performed";
                if (!displayVal && qid === "Q26" && data.governing) displayVal = data.governing;

                const isCurrency = ["Q9", "Q10", "Q11"].includes(qid);

                return (
                  <AccordionItem 
                    key={qid} 
                    value={qid} 
                    className="bg-white border border-[#CFDCD5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    
                    {/* The Trigger - Clean White with Green Text, No Heavy Blocks */}
                    <AccordionTrigger className="px-6 py-5 hover:bg-[#F0F5F2] group flex justify-between items-center transition-all duration-200 hover:no-underline">
                      <div className="flex items-start gap-4 text-left w-full pr-4">
                        <Badge variant="outline" className="bg-[#E8EDE9] text-[#1B4332] border-transparent font-mono text-[13px] font-bold mt-0.5 shrink-0 transition-colors group-hover:bg-[#CFDCD5]">
                          {qid}
                        </Badge>
                        <span className="text-[16px] font-semibold text-[#1B4332] break-words leading-relaxed flex-1">
                          {questionLabel}
                        </span>
                        {isUnverified && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-500 font-bold shrink-0 border-gray-200 mt-0.5 text-[10px] uppercase tracking-wider">
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    
                    {/* The Content Panel - Soft Off-White separation */}
                    <AccordionContent className="px-6 py-6 bg-[#FAFAF9] border-t border-[#CFDCD5]/50">
                      <div className="flex flex-col gap-6">
                        
                        {/* 1. The Value Block */}
                        <div className="relative">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h4 className="text-[11px] tracking-widest uppercase text-gray-500 font-bold">Recorded Finding</h4>
                            {meta.pass_threshold && (
                              <Badge variant="outline" className="bg-white text-[#40916C] border-[#A3B18A] px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider shadow-sm">
                                Target: {meta.pass_threshold}
                              </Badge>
                            )}
                          </div>
                          
                          {/* Value Render Logic */}
                          {isCurrency ? (
                            <span className="text-3xl font-extrabold text-[#1B4332] break-words tracking-tight drop-shadow-sm">
                              ₹ {displayVal || "—"} Cr
                            </span>
                          ) : (
                            <p className="text-xl font-bold text-[#1B4332] break-words leading-snug">
                              {displayVal || "No primary data recorded"}
                              {data.unit && <span className="text-sm font-medium text-gray-500 ml-2">{data.unit}</span>}
                            </p>
                          )}

                          {/* Valid Values Explainer Injection */}
                          {meta.valid_values && displayVal && meta.valid_values[displayVal] && (
                            <div className="mt-4 bg-white border border-[#E8EDE9] rounded-lg p-4 shadow-sm">
                              <div className="flex gap-3 items-start">
                                <div className="bg-[#E8EDE9] text-[#1B4332] p-1.5 rounded-md mt-0.5 shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                </div>
                                <p className="text-[14.5px] text-gray-700 leading-relaxed">
                                  <strong className="font-bold text-[#1B4332] block mb-1">Framework Definition:</strong> 
                                  {meta.valid_values[displayVal]}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Include/Exclude Injection (Themed Softly) */}
                          {meta.include && (
                            <div className="mt-4 p-4 bg-white border-l-4 border-l-[#40916C] rounded-r-lg shadow-sm">
                              <p className="text-[14px] text-gray-700 leading-relaxed"><strong className="text-[#1B4332] block mb-1 uppercase text-[11px] tracking-wider">Included in Scope</strong> {meta.include}</p>
                            </div>
                          )}
                          {meta.exclude && (
                            <div className="mt-3 p-4 bg-white border-l-4 border-l-gray-400 rounded-r-lg shadow-sm">
                              <p className="text-[14px] text-gray-600 leading-relaxed"><strong className="text-gray-800 block mb-1 uppercase text-[11px] tracking-wider">Strictly Excluded</strong> {meta.exclude}</p>
                            </div>
                          )}
                        </div>

                        {/* 2. LaTeX-Style Formula Block */}
                        {meta.formula && (
                          <div className="bg-white border border-[#CFDCD5] px-8 py-6 rounded-xl flex items-center justify-center gap-6 w-full md:w-fit shadow-sm">
                            <span className="font-serif italic text-3xl text-[#1B4332]">{meta.formula.lhs} =</span>
                            <div className="flex flex-col items-center">
                              <span className="border-b-[3px] border-[#2D6A4F] px-5 text-[16px] font-bold text-[#1B4332] pb-2 leading-none">{meta.formula.num}</span>
                              <span className="px-5 text-[16px] font-bold text-[#1B4332] pt-2 leading-none">{meta.formula.den}</span>
                            </div>
                          </div>
                        )}

                        {/* 3. The Rationale Block */}
                        {data.r && (
                          <div className="bg-white p-5 rounded-xl border border-[#E8EDE9] shadow-sm">
                            <h4 className="text-[11px] tracking-widest uppercase text-gray-500 font-bold mb-3 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                              Audit Rationale
                            </h4>
                            <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap break-words font-medium">
                              {data.r}
                            </p>
                          </div>
                        )}

                        {/* 4. The Source Block */}
                        {data.src && (
                          <div className="inline-flex items-start gap-3 bg-white px-5 py-4 rounded-xl border border-[#E8EDE9] shadow-sm mt-2 max-w-full">
                            <div className="bg-gray-100 p-1.5 rounded-md mt-0.5 shrink-0 text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] tracking-widest uppercase text-gray-500 font-bold mb-1">Verified Source Document</span>
                              <span className="break-words leading-relaxed font-medium italic text-[#2D6A4F] min-w-0 max-w-full">
                                {data.src}
                              </span>
                            </div>
                          </div>
                        )}

                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        </div>

        {scheme.upgradePathway && scheme.upgradePathway.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Upgrade Pathway</h2>
            <div className="grid gap-4">
              {scheme.upgradePathway.map((step: string, index: number) => (
                <Card 
                  key={index} 
                  className="border border-[#CFDCD5] shadow-sm hover:shadow-md transition-all duration-300 bg-white"
                >
                  <CardContent className="p-6 flex items-start gap-5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#E8EDE9] text-[#1B4332] flex items-center justify-center text-xl font-black shrink-0">
                      {index + 1}
                    </div>
                    <div className="text-gray-700 leading-relaxed font-medium min-w-0 break-words whitespace-normal pt-1">
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