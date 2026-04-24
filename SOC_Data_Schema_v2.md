# SOC Data Schema v2 — Canonical JSON Reference

> **Purpose**: This document is the authoritative schema reference for all department JSON data files in `data/`. Use it when adding new schemes, updating existing ones, or conducting Phase 1 web-research verification passes. Every field listed here has a corresponding TypeScript type in `lib/data.ts`.

---

## File Location & Naming

```
data/
  agriculture.json
  animal-husbandry.json
  fisheries.json
  forest.json
  panchayat-rural-engineering.json
  rural-development.json
  tribal-affairs.json
  water-resources.json
```

Each file represents one department and follows the `Department` interface exactly.

---

## Department Object (Top Level)

```jsonc
{
  "department": "string — full official department name",
  "slug": "string — kebab-case URL slug matching filename",
  "state": "Chhattisgarh",
  "totalSchemes": number,

  "summary": { /* see Summary Object */ },

  "dominantFinding": "string — pithy 1-2 sentence sectoral insight shown as a pull-quote on the department page. Focus on what the data REVEALS, not what it prescribes. Different from dominantFailure.",
  "dominantFailure": "string — diagnostic paragraph explaining the structural failure mode across the department. Longer and more analytical than dominantFinding.",

  "commonsProfile": { /* see CommonsProfile Object */ },

  "structuralFindings": { /* see StructuralFindings Object */ },

  "schemes": [ /* array of Scheme objects */ ]
}
```

### Summary Object

```jsonc
"summary": {
  "soc": number,               // schemes classified "SOC" — all 4 tests PASS, 0 governance flags
  "socWithGaps": number,       // schemes classified "SOC with Governance Gaps" — all 4 tests PASS but ≥2 governance flags absent
  "nearSocOperational": number, // schemes classified "Near-SOC (Operational)" — T4 passes, at least one of T1/T2/T3 fails
  "nearSocStructural": number,  // schemes classified "Near-SOC (Structural)" — T1+T2+T3 pass, T4 fails (extractive loop risk)
  "nonSoc": number              // schemes classified "Non-SOC" — T1 fails (resource is not commons)
}
```

> **Rule**: `soc + socWithGaps + nearSocOperational + nearSocStructural + nonSoc` must equal `totalSchemes`.

> **Legacy field removed**: The old `nearSoc` field (without subcategory) has been removed. All files now use the split `nearSocOperational` / `nearSocStructural` fields.

### CommonsProfile Object

```jsonc
"commonsProfile": {
  "primaryCommonsTypes": ["string", "..."],  // 2-4 commons types most relevant to this department
  "climateStressedZones": boolean,           // true if department's commons are in climate-stressed zones (groundwater, dryland, forest loss)
  "keyEcologicalContext": "string"           // 1-2 sentences on the ecological/institutional context shaping SOC potential
}
```

### StructuralFindings Object

```jsonc
"structuralFindings": {
  "dominantProblem": "string — short title/label for the cross-cutting structural problem",
  "socException": "string — name and brief rationale for the scheme(s) that beat the department trend",
  "crossCuttingPriorities": ["string", "..."],  // 3-5 actionable reform priorities with cost/timeline estimates
  "contextualFactors": ["string", "..."]         // 3-5 state-specific contextual factors enabling or blocking SOC
}
```

---

## Scheme Object

```jsonc
{
  "id": "string — kebab-case unique identifier within the department",
  "name": "string — official English scheme name",
  "hindiName": "string | null — official Hindi name if available",

  // Optional metadata (add during Phase 1 web research)
  "tier": "Central" | "State" | "Local",
  "nodalMinistry": "string — ministry/department responsible at central/state level",
  "budgetOutlay": "string — e.g. '₹500 Cr (2024-25)'",
  "reach": "string — e.g. '4,500 gram sabhas in Chhattisgarh'",

  "objective": "string — 1-3 sentence objective covering what the scheme does, for whom, and the primary output",

  // T1 classification
  "commonsType": "A1" | "A2" | "B" | "C" | "D" | "E",
  // A1 = State-as-custodian (state holds for community benefit)
  // A2 = State-as-revenue (state holds for fiscal extraction)
  // B  = Community commons (community owns/manages)
  // C  = Private (individual or corporate — T1 FAILS)
  // D  = Mixed (shared private, unclear tenure — often fails)
  // E  = Intangible commons (knowledge, cultural, institutional)

  "commonsTrack": "natural" | "intangible",
  // natural = land/water/forest/biodiversity commons → use ρ ratio for T4.2
  // intangible = knowledge/cultural/institutional commons → use Vitality Index for T4.2

  "tests": {
    "t1": boolean,  // Resource is Commons
    "t2": boolean,  // Dwellers Benefit
    "t3": boolean,  // Economic Opportunity
    "t4": boolean   // Sustainability Lock
  },

  "score": number,  // 0–4 integer (count of passing tests)

  "classification": "SOC" | "SOC with Governance Gaps" | "Near-SOC (Operational)" | "Near-SOC (Structural)" | "Non-SOC",

  // Classification logic:
  // SOC                    — all 4 tests pass AND <2 governance flags absent
  // SOC with Governance Gaps — all 4 tests pass AND ≥2 governance flags absent
  // Near-SOC (Structural)  — T1+T2+T3 pass, T4 FAILS → extractive loop risk, requires redesign
  // Near-SOC (Operational) — T4 passes, ≥1 of T1/T2/T3 fails → implementation gap, upgrade pathway available
  // Non-SOC                — T1 FAILS (resource is not commons) → fundamental redesign required

  "governanceFlags": ["string", "..."],
  // Array of flag names for absent governance enhancement variables.
  // Possible flags (from the 5 enhancement sub-parameters):
  //   "T1.5: No community boundary demarcation"
  //   "T2.4: No women's proportional benefit inclusion"
  //   "T2.5: No SC/ST non-exclusion assurance"
  //   "T3.5: No price/market risk safeguard"
  //   "T4.6: No climate adaptive mechanism"
  // Leave as [] if not yet assessed or if flags are absent/minimal.
  // ≥2 flags on a passing-4-tests scheme triggers "SOC with Governance Gaps" classification.

  "evidence": {
    "t1": "string — sub-parameter scores and key evidence for T1",
    "t2": "string — sub-parameter scores and key evidence for T2",
    "t3": "string — sub-parameter scores and key evidence for T3",
    "t4": "string — sub-parameter scores and key evidence for T4"
  },
  // Evidence format convention:
  // T1: "T1.1=X (tenure type); T1.2=N (access right); T1.3~N.NN (commons expenditure %); T1.4=N (excludability)"
  // T2: "T2.1~N.NN (locality fraction); T2.2~N.NN (SC/ST share); T2.3=N (governance body)"
  // T3: "T3.1=N (livelihood mandate); Delta-Y: Rs.X,XXX/HH/year; T3.3=N (pathway diversity); T3.4=N (offtake mechanism)"
  // T4: "T4.1=N (replenishment rule); T4.2: [ρ ratio or VI score]; T4.3=N (monitoring level); T4.4=N (penalty); T4.5=N (O&M fund)"

  "upgradePathway": ["string", "..."],
  // 3-5 specific, actionable upgrades with cost/timeline estimates where available.
  // For Non-SOC: focus on fundamental redesign toward commons architecture.
  // For Near-SOC (Structural): focus on T4 additions (O&M fund, monitoring, extraction limits, penalties).
  // For Near-SOC (Operational): focus on the failing test(s).
  // For SOC: focus on strengthening or scaling.

  // Optional — add during Phase 1 web-research verification
  "subParameters": { /* see SubParameters Object — detailed scoring */ },
  "references": [ /* see Reference Object */ ]
}
```

---

## Sub-Parameters Object (Optional — Phase 1)

Add this block when conducting detailed web-research verification. All sub-fields are optional individually.

```jsonc
"subParameters": {
  "t1": {
    "T1_1": { "score": "A1"|"A2"|"B"|"C"|"D"|"E", "pass": boolean, "note": "string" },
    "T1_2": { "score": 0|1|2, "pass": boolean, "note": "string" },
    //        0=discretionary, 1=customary/traditional, 2=statutory/legal
    "T1_3": { "score": number, "pass": boolean, "note": "string" },
    //        fraction 0.0–1.0; pass if ≥0.50
    "T1_4": { "score": 0|1|2, "pass": boolean, "note": "string" },
    //        0=fully excludable, 1=partially non-excludable, 2=fully non-excludable
    "T1_5": { "score": 0|1, "flag": "string|null", "note": "string" },  // Enhancement flag
    "T1_6": { "score": 0|1, "pass": boolean, "note": "string" }         // Intangible commons validity
  },
  "t2": {
    "T2_1": { "score": number, "pass": boolean, "localDefinition": "settled"|"pastoral", "note": "string" },
    //        fraction; pass if ≥0.60 (settled) or ≥0.50 (pastoral)
    "T2_2": { "score": number, "pass": boolean, "note": "string" },
    //        SC/ST fraction; pass if ≥0.30
    "T2_3": { "score": 0|1, "pass": boolean, "functional": boolean, "note": "string" },
    //        0=no governance body, 1=governance body mandated
    "T2_4": { "score": 0|1, "flag": "string|null", "note": "string" },  // Enhancement flag
    "T2_5": { "score": 0|1, "flag": "string|null", "note": "string" }   // Enhancement flag
  },
  "t3": {
    "T3_1": { "score": 0|1, "pass": boolean, "note": "string" },
    //        1=livelihood output mandated, 0=not mandated
    "T3_2": { "score": number, "dataType": "observed"|"projected", "pass": boolean, "provisional": boolean, "note": "string" },
    //        Delta-Y in Rs/HH/year; pass if observed ≥₹3,000 or projected ≥₹5,000
    "T3_3": { "score": 0|1|2|3, "pass": boolean, "pathways": ["string"], "note": "string" },
    //        0=no pathway, 1=single, 2=dual, 3=three or more; pass if ≥1
    "T3_4": { "score": 0|1, "pass": boolean, "offtakeMechanism": "string|null", "note": "string" },
    //        1=institutional offtake mechanism exists
    "T3_5": { "score": 0|1, "flag": "string|null", "note": "string" }   // Enhancement flag
  },
  "t4": {
    "T4_1": { "score": 0|1, "pass": boolean, "rule": "string|null", "note": "string" },
    //        1=binding replenishment/sustainability rule codified
    "T4_2": {
      "track": "rho"|"vi",
      "rho": number|null,        // For natural commons: extraction/replenishment ratio; pass if ≤1.25
      "vi": 0|1|2|null,          // For intangible commons: Vitality Index; pass if ≥1
      "pass": boolean,
      "estimated": boolean,
      "note": "string"
    },
    "T4_3": { "score": 0|1|2|3, "climateStressed": boolean, "requiredThreshold": 1|2, "pass": boolean, "metrics": ["string"], "note": "string" },
    //        0=none, 1=annual, 2=bi-annual/quarterly, 3=real-time/continuous
    //        Pass threshold: ≥1 normally, ≥2 if climateStressed=true
    "T4_4": { "score": 0|1, "note": "string" },
    //        1=penalty/enforcement mechanism exists
    "T4_5": { "score": 0|1, "mechanismType": "physical_OM"|"intangible_stewardship"|null, "note": "string" },
    //        1=O&M fund or stewardship mechanism embedded
    "T4_6": { "score": 0|1, "flag": "string|null", "note": "string" },  // Enhancement flag
    "T4_7": { "triggered": boolean, "stressType": "groundwater"|"forest"|"dryland"|"coastal"|"outmigration"|null, "note": "string" }
    // Climate stress override: if triggered=true, T4.3 pass threshold raises to ≥2
  }
}
```

---

## Reference Object (Optional — Phase 1)

```jsonc
{
  "id": "string — unique reference ID within scheme, e.g. 'ref-001'",
  "title": "string — document title",
  "url": "string — URL to official source",
  "type": "official_guidelines" | "budget_document" | "evaluation_report" | "mis_portal" | "cag_report" | "legal_act" | "news_official" | "research_paper",
  "verified": boolean,   // true = URL confirmed live and content matches claim
  "accessed": "YYYY-MM-DD",
  "relevantTo": ["string"]  // list of claims this reference supports, e.g. ["T1.2", "T3.2"]
}
```

---

## Classification Decision Logic (Quick Reference)

```
T1 FAILS?
  └─ Yes → Non-SOC (score 0, 1, or 2)
  └─ No → T2 FAILS?
             └─ Yes → Non-SOC (score 1 if T1 only)
             └─ No → T3 FAILS?
                        └─ Yes → T4 passes? Near-SOC (Operational) : Non-SOC
                        └─ No → T4 FAILS?
                                  └─ Yes → Near-SOC (Structural)  ← extractive loop risk
                                  └─ No → Count absent governance flags (T1.5, T2.4, T2.5, T3.5, T4.6)
                                            └─ ≥2 absent → SOC with Governance Gaps
                                            └─ <2 absent → SOC ✓
```

---

## Governance Flag Assessment Guide

The five enhancement sub-parameters (T1.5, T2.4, T2.5, T3.5, T4.6) are **not hard gates** — a scheme can pass all 4 tests even if these are absent. However, if **two or more** are absent on a full-SOC scheme, the classification downgrades to **SOC with Governance Gaps**.

| Flag | Sub-parameter | Absent when… |
|------|--------------|--------------|
| T1.5 | Community boundary clarity | No formal demarcation of commons boundary; overlapping claims unresolved |
| T2.4 | Women's benefit inclusion | No explicit provision ensuring women's proportional access to scheme benefits |
| T2.5 | SC/ST non-exclusion | No provision protecting against exclusion of SC/ST communities from benefit |
| T3.5 | Price/market risk safeguard | No price floor, procurement guarantee, or insurance against market price collapse |
| T4.6 | Climate adaptive mechanism | No protocol for adjusting extraction limits under drought/stress conditions |

---

## Annotated Complete Example

Below is a fully-populated SOC scheme (Rainfed Area Development from Agriculture Department) showing every field in use.

```json
{
  "id": "rainfed-area-development",
  "name": "Rainfed Area Development",
  "hindiName": "वर्षा सिंचित क्षेत्र विकास",
  "tier": "Central",
  "nodalMinistry": "Ministry of Agriculture & Farmers Welfare",
  "budgetOutlay": "Converged under PMKSY (₹93,068 Cr nationally, 2021-26)",
  "reach": "≈60% of Chhattisgarh's cultivated area (rainfed)",
  "objective": "Promote sustainable rainfed agriculture through water harvesting commons (check-dams, johads, ponds), soil conservation, and crop diversification adapted to drought-prone regions with community-based natural resource management.",
  "commonsType": "B",
  "commonsTrack": "natural",
  "tests": { "t1": true, "t2": true, "t3": true, "t4": true },
  "score": 4,
  "classification": "SOC",
  "governanceFlags": [],
  "evidence": {
    "t1": "T1.1=B (community commons: check-dams/johads on village land); T1.2=1 (statutory community access right); T1.3~0.80 (≥80% expenditure on commons water harvesting); T1.4=2 (non-excludable benefit)",
    "t2": "T2.1~0.88 (locality fraction); T2.2~0.48 (SC/ST share); T2.3=1 (gram sabha governance mandated)",
    "t3": "T3.1=1 (livelihood output mandated); Delta-Y: Rs.7,000-9,000/HH/year; T3.3=3 (multiple pathways: groundwater/crops/horticulture); T3.4=1 (institutional offtake guaranteed)",
    "t4": "T4.1=1 (replenishment rule codified); T4.2~1.15 (E/R ≤1.2 maintained); T4.3=2 (bi-annual monitoring + annual audit); T4.4=1 (fund withholding penalty); T4.5=1 (O&M fund 10% of capital)"
  },
  "upgradePathway": [
    "Climate Finance Integration: Link water harvesting commons to carbon credit revenue (NTFP + watershed carbon sequestration)",
    "Biodiversity Commons: Integrate millet/pulse diversity conservation with livelihood benefit; seed sovereignty mandate",
    "Micro-Watershed Certification: Achieve international commons certification for gram watershed commons"
  ],
  "subParameters": {
    "t1": {
      "T1_1": { "score": "B", "pass": true, "note": "Check-dams and johads on village commons land; gram panchayat holds title" },
      "T1_2": { "score": 2, "pass": true, "note": "Statutory community access right under PMKSY guidelines + gram sabha resolution" },
      "T1_3": { "score": 0.80, "pass": true, "note": "≥80% of scheme expenditure on commons water harvesting infrastructure" },
      "T1_4": { "score": 2, "pass": true, "note": "All households in command area benefit equally from groundwater recharge; non-excludable" },
      "T1_5": { "score": 1, "flag": null, "note": "Watershed boundary demarcated in DPR; gram sabha approves boundary" }
    },
    "t2": {
      "T2_1": { "score": 0.88, "pass": true, "localDefinition": "settled", "note": "88% of beneficiaries are residents of the watershed village" },
      "T2_2": { "score": 0.48, "pass": true, "note": "48% SC/ST share among beneficiary households; above 30% threshold" },
      "T2_3": { "score": 1, "pass": true, "functional": true, "note": "Gram Sabha is mandatory governance body; documented resolution required before fund release" },
      "T2_4": { "score": 1, "flag": null, "note": "Women's Self-Help Groups mandated as co-managers of water harvesting committee" },
      "T2_5": { "score": 1, "flag": null, "note": "SC/ST priority access to irrigation benefit explicitly in PMKSY guidelines" }
    },
    "t3": {
      "T3_1": { "score": 1, "pass": true, "note": "Livelihood improvement (crop yield, groundwater access) is explicit mandated outcome" },
      "T3_2": { "score": 8000, "dataType": "observed", "pass": true, "provisional": false, "note": "Observed Delta-Y Rs.7,000–9,000/HH/year from rainfed→irrigated transition plus horticulture diversification" },
      "T3_3": { "score": 3, "pass": true, "pathways": ["Groundwater irrigation", "Crop diversification", "Horticulture"], "note": "Three independent income pathways confirmed" },
      "T3_4": { "score": 1, "pass": true, "offtakeMechanism": "Government-sponsored FPOs + mandi procurement", "note": "Institutional offtake via gram cooperative marketing + government mandi system" },
      "T3_5": { "score": 1, "flag": null, "note": "PMKSY includes price support for diversified crops; MSP coverage for pulses and oilseeds" }
    },
    "t4": {
      "T4_1": { "score": 1, "pass": true, "rule": "E/R ≤1.2 codified in water committee management plan", "note": "Replenishment rule embedded in watershed management plan as condition for fund release" },
      "T4_2": { "track": "rho", "rho": 1.15, "vi": null, "pass": true, "estimated": false, "note": "Extraction/replenishment ratio maintained at ~1.15 based on water table monitoring" },
      "T4_3": { "score": 2, "climateStressed": true, "requiredThreshold": 2, "pass": true, "metrics": ["water table depth", "tank silt level", "crop yield"], "note": "Bi-annual water table monitoring + annual watershed assessment by independent agency" },
      "T4_4": { "score": 1, "note": "Fund withholding penalty: 25% of scheme tranche withheld if E/R >1.2 for two consecutive quarters" },
      "T4_5": { "score": 1, "mechanismType": "physical_OM", "note": "10% of scheme capital deposited to dedicated O&M fund at project handover; gram committee controls disbursement" },
      "T4_6": { "score": 1, "flag": null, "note": "Drought contingency protocol: E/R limit tightens to ≤1.0 if block declared drought-affected" },
      "T4_7": { "triggered": true, "stressType": "groundwater", "note": "70% of CG blocks groundwater-stressed; T4.3 threshold raised to ≥2 accordingly — already met" }
    }
  },
  "references": [
    {
      "id": "ref-001",
      "title": "PMKSY Operational Guidelines 2021-26",
      "url": "https://pmksy.gov.in/mis/Archive/OperationalGuidelines.pdf",
      "type": "official_guidelines",
      "verified": true,
      "accessed": "2026-04-10",
      "relevantTo": ["T1.2", "T2.3", "T4.1"]
    }
  ]
}
```

---

## Phase 1 Research Protocol (Per-Scheme Checklist)

When conducting web-based verification for a scheme, follow this order:

1. **Confirm scheme existence** — verify the scheme is currently operational in Chhattisgarh (not discontinued); check CGSTATE portal, scheme MIS, or budget documents
2. **Verify T1 classification** — confirm T1.1 ownership type from official guidelines; check T1.2 legal basis (statutory vs. customary vs. discretionary)
3. **Verify T3.2 income data** — find observed Delta-Y if available (evaluation reports, CAG findings, MIS data); flag as "projected" if only estimates exist
4. **Verify T4.2** — check if extraction/replenishment ratio is monitored; find actual monitoring data if available
5. **Add `tier` and `nodalMinistry`** — confirm from official source
6. **Add `budgetOutlay` and `reach`** — find current year's budget allocation and Chhattisgarh-specific coverage
7. **Add references** — minimum 1 reference per scheme; prefer official_guidelines or budget_document types
8. **Assess governance flags** — check T1.5, T2.4, T2.5, T3.5, T4.6 against scheme guidelines
9. **Update `subParameters`** — fill in detailed sub-parameter scoring based on verified evidence
10. **Reclassify if warranted** — if research changes test results, update `tests`, `score`, `classification`, and department `summary` counts accordingly

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| v2.0 | 2026-04-22 | Full migration: `nearSoc` split into `nearSocOperational`/`nearSocStructural`; `socWithGaps` added to summary; `dominantFinding`, `commonsProfile`, `state` added to all departments; all 27 Near-SOC schemes reclassified to Operational or Structural subcategory |
| v1.0 | 2026-01 | Initial schema with 4 classifications, legacy `nearSoc` field |
