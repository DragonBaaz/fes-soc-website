# SOC Policy Diagnostic Framework
## Quantitative Sub-Parameters for Deterministic Classification

**Indian Institute of Management Raipur**  
**Foundation for Ecological Security (FES)**  
**April 2026**

---

## Preamble

This document provides the full analytical framework for classifying government schemes under the **Shared-Outcome Commons (SOC)** system. This framework can be applied to a full compendium of Central, State, and Local schemes.

---

## 1. Definition of Commons

The following definition governs all four tests in this framework. It supersedes any narrower, land-ownership-centric interpretation.

> **A 'commons' is any resource — natural, physical, social, cultural, or knowledge-based — that is (a) not exclusively privately owned or controlled, (b) accessible to a defined community by legal right, customary practice, or constitutional spirit, and (c) whose degradation, enclosure, or neglect imposes costs on that community's ecological, economic, or cultural wellbeing. Commons are defined primarily by their governance regime — collective stewardship and shared benefit and not only by legal ownership category alone.**

### 1.1 Categories of Commons Recognised

| Category | Examples |
|---|---|
| **Natural / Ecological** | Forests, pastures, water bodies, degraded land, watersheds, aquifers, fisheries, biodiversity |
| **Physical / Infrastructure** | Common irrigation systems, village ponds, check dams, common grazing reserves |
| **Social / Livelihood** | Cooperative labour systems, shared agricultural practices, common livestock rearing systems |
| **Knowledge / Cultural** | Traditional knowledge systems, seed custodianship, community seed banks, Village Ecological Registers, cultural practices, traditional governance norms |
| **Institutional** | Gram Sabha governance structures, customary community institutions, community forest management bodies |
| **Digital / Information** | Community data platforms, shared MIS, community monitoring dashboards |

### 1.2 Legal and Constitutional Spirit

The word "commons" does not appear as a defined legal term in Indian law. This framework interprets the following constitutional and legislative provisions as collectively reflecting the spirit of commons — community rights, collective stewardship, ecological responsibility, and protection of shared resources:

- **Article 48-A** — State duty to protect and improve the environment
- **Article 51-A(g)** — Fundamental duty of every citizen to protect the natural environment
- **Directive Principles (Part IV)** — Equitable distribution and control of material resources for the common good
- **Fifth Schedule / Sixth Schedule** — Special protections for tribal communities'; limited administrative autonomy rights to land and resources
- **Forest Rights Act, 2006 (FRA)** — Community forest rights and tenure
- **PESA, 1996** — Gram Sabha powers over village commons in scheduled areas
- **Biological Diversity Act, 2002** — Community knowledge rights and Biodiversity Management Committees (BMCs)
- **Panchayat Raj Acts** — GP jurisdiction over village common lands and natural resources

---

## 2. Purpose and Design Philosophy

The SOC classification is a policy-analytic tool to determine whether a government scheme **structurally functions as a commons-based economic opportunity** rather than a private-good subsidy or a pure public-infrastructure provision.

The four-point SOC test addresses the four necessary conditions for a scheme to qualify.

This framework operationalises each test into measurable, largely deterministic sub-parameters. The priority ordering of variable types is:

1. **Binary (0/1)** — most preferred; zero ambiguity
2. **Continuous (real-valued, bounded)** — used when the underlying phenomenon is genuinely scalar
3. **Ordinal / point-scale (integer-valued, 0–3 or 0–5)** — used only where a concept is ordinal but cannot be reduced to a single threshold binary
4. **Qualitative categorical** — used sparingly, only when the concept resists quantification and categorical options have low mutual ambiguity

---

## 3. Master Decision Rule

Each of the four tests produces a binary pass/fail result. The SOC classification gate is:

| Classification | Condition |
|---|---|
| **SOC** | All 4 tests PASS and no more than 1 enhancement flag absent |
| **SOC with Governance Gaps** | All 4 tests PASS but ≥ 2 enhancement variables absent (T1.5, T2.4, T2.5, T3.5, T4.6 = 0) |
| **Near-SOC (Operational)** | 3 tests PASS — failing test is T1, T2, or T3. Upgradeable via targeted scheme design change |
| **Near-SOC (Structural)** | 3 tests PASS — failing test is **T4**. More severe: indicates extractive feedback loop or structurally non-durable design. Requires redesign, not just operational improvement |
| **Adjacent / Non-SOC** | 2 or fewer tests PASS |

> **On Near-SOC (Structural)**: A T4 failure is treated as a design flaw — the scheme generates economic opportunity from the commons but contains no structural lock against depletion. This is categorically different from a T1–T3 failure, which is typically an implementation or targeting gap. Near-SOC (Structural) schemes must identify a T4 remediation pathway before reclassification.

---

## 4. Test 1 — Resource is a Commons

A 'commons' (per the definition in Section 1) must be the primary resource that the scheme operates on. This test verifies that the resource qualifies as a commons, that the community holds a recognised right to it, and that no active legal process is diverting it away from community access.

### Sub-Parameters

---

#### T1.1 — Governance / Ownership Type of Primary Resource
**Variable Type:** Categorical (5 classes)

Classify the primary resource by governance and ownership type:

| Code | Type | Commons-Qualifying? |
|---|---|---|
| **A1** | State/public land or resource **governed by or formally notified for community use** (GP-jurisdiction revenue wasteland, notified grazing reserve, state-owned water body under GP management) | **Yes** |
| **A2** | State/public land or resource **managed for state revenue** (plantation under forest department, active mining lease, PSU-operated land) | **Only if T1.2 ≥ 1 compensates** |
| **B** | Community land / Common Pool Resource governed by a traditional institution, village body, or registered community group | **Yes** |
| **C** | Private land / privately owned property | **No** |
| **D** | Mixed (e.g., aquifer underlying state and private land; watershed spanning multiple tenure types) | **Yes, if community access rights are legally established or customarily recognised** |
| **E** | Intangible / knowledge / cultural / institutional commons (traditional knowledge systems, community seed banks, seed custodianship practices, cultural governance norms, digital community commons) | **Yes — assessed through T1.2 and T1.4; T1.3 applies using intangible expenditure clause** |

**Scoring rule:**
- T1.1 ∈ {A1, B, D, E} → qualifies
- T1.1 = A2 → qualifies **only if** T1.2 ≥ 1
- T1.1 = C → does not qualify; Test 1 FAIL

---

#### T1.2 — Community Access or Practice Right
**Variable Type:** Ordinal 0–2

Is there a right of the local community to access, use, or practice the commons resource?

| Score | Meaning |
|---|---|
| **0** | Purely executive or administrative discretion — no legal, statutory, or recognised customary basis; community access can be revoked by administrative order |
| **1** | Customary or traditionally recognised right — practiced and acknowledged by community and local government, even if not formally codified. Includes pre-FRA tribal areas, pastoral corridors, unregistered village commons, seasonal grazing rights |
| **2** | Statutory, constitutional, or legally enforceable right — Panchayat Raj Act powers, FRA community forest rights, PESA Gram Sabha mandate, community biodiversity right under BMC, community land title |

**Pass threshold: T1.2 ≥ 1**

> *Ordinal variables prevents false negatives on genuine customary commons in tribal, forest-fringe, and pastoral communities where formal codification has not yet occurred.*

---

#### T1.3 — Fraction of Scheme Expenditure on Non-Private Resources (θ₁)
**Variable Type:** Continuous, θ₁ ∈ [0, 1]

θ₁ = (Expenditure on common/public/community resources) ÷ (Total scheme expenditure)

**Numerator includes:**
- Expenditure on physical commons: common land, water bodies, watersheds, community forests, common pastures
- Expenditure on intangible commons: knowledge documentation, community institution strengthening, seed bank establishment, cultural practice revival, community capacity building — even where no physical asset is created (applicable to T1.1 = E resources)

**Numerator excludes:**
- Expenditure physically located on common land but whose outputs flow **exclusively to private assets** (e.g., a pipeline on common land serving only private farms; a tube-well on revenue land benefiting a single household). This expenditure counts as private-benefit spend regardless of the land's tenure status.

**Data source:** Scheme guidelines, financial statements, evaluation reports, DPR cost breakdowns.

**Pass threshold: θ₁ ≥ 0.50**

---

#### T1.4 — Excludability of Resource Benefits
**Variable Type:** Ordinal 0–2

| Score | Meaning |
|---|---|
| **0** | Fully excludable — benefits accrue only to one private actor (e.g., drip irrigation exclusively on a private farm) |
| **1** | Partially excludable — benefits accrue to a defined group but exclusion of non-members is practiced (e.g., irrigation cooperative with membership fee; SHG with membership criterion) |
| **2** | Non-excludable — benefits accrue to the entire community without practical exclusion (e.g., groundwater recharge, watershed runoff, air quality from forest, traditional knowledge accessible to all community members) |

**Pass threshold: T1.4 ≥ 1**

> **Cross-flag rule:** If T1.4 = 1 **and** the exclusion mechanism is **fee-based**, the auditor must flag an equity tension and verify that T2.2 (marginalised beneficiary share θ₃) is not suppressed by the access fee. This is not a hard gate — it is a directed verification requirement carried into the Test 2 audit.

---

#### T1.5 — Resource Boundary Demarcation *(Enhancement Variable)*
**Variable Type:** Binary

Is the commons resource geographically or institutionally delimited in a public document?

- **1** = Demarcated: survey number, GPS coordinates, GP resolution, watershed boundary map, knowledge domain documentation (e.g., BMC biodiversity register with defined community boundary), or equivalent
- **0** = No demarcation exists

**This variable does not affect Test 1 pass/fail.**

> **If T1.5 = 0:** Flag as a T4.2 measurement risk. The ρ ratio (extraction-to-replenishment) and the Vitality Index in Test 4 cannot be reliably computed for an un-demarcated resource. The auditor must note whether T4.2 is estimated or measured, and record the uncertainty margin.

---

#### T1.6 — No Active Legal Encumbrance
**Variable Type:** Binary

Are there active legal or administrative processes that could override community access to the commons during the scheme period?

- **1** = No active diversion order, mining lease, change-of-land-use notification, SEZ notification, compulsory acquisition proceeding, or equivalent encumbrance on the resource during the scheme period
- **0** = Active encumbrance exists

**Score of 0 = automatic Test 1 FAIL, regardless of all other sub-parameter scores.**

> *Rationale: A commons subject to active diversion cannot be reliably classified as such for the purposes of scheme investment. Classification would be rendered void mid-scheme.*

---

### Test 1 Pass/Fail Logic

```
[T1.1 ∈ {A1, B, D, E}]
  OR [T1.1 = A2 AND T1.2 ≥ 1]
AND T1.2 ≥ 1
AND θ₁ ≥ 0.50 (using definitions above)
AND T1.4 ≥ 1
AND T1.6 = 1
→ TEST 1 PASS

Any of the following → TEST 1 FAIL:
  T1.1 = C
  T1.1 = A2 AND T1.2 = 0
  T1.2 = 0
  θ₁ < 0.50
  T1.4 = 0
  T1.6 = 0

T1.5 = 0 → FLAG: T4.2 measurement risk (not a fail)
T1.4 = 1 with fee-based exclusion → FLAG: verify T2.2 (equity cross-check)
```

---

## Test 2 — Dwellers Benefit

The local community that is geographically and economically proximate to the commons resource must be the **primary beneficiary**. This test screens out schemes that exploit the commons but channel benefits to distant actors (extractive industry royalties to state revenues, benefits captured by urban intermediaries, or concentrated elite capture within the community).

### Sub-Parameters

---

#### T2.1 — Fraction of Direct Beneficiaries Who Are Local Dwellers (θ₂)
**Variable Type:** Continuous, θ₂ ∈ [0, 1]

θ₂ = (Beneficiaries residing within the scheme's operational commons area) ÷ (Total scheme beneficiaries)

**Definition of "local":**
- **Settled communities:** Within the GP/block/watershed or 10 km radius of the commons resource
- **Pastoral, mobile, or seasonal communities:** Within the customary use area of the commons resource, as documented in a GP resolution, traditional grazing map, forest rights claim, or equivalent. The auditor must state which definition is applied and provide the basis.

**Data source:** MIS beneficiary registers, field survey, beneficiary database with address/GP fields.

**Pass threshold: θ₂ ≥ 0.70**

---

#### T2.2 — Marginalised Beneficiary Share (θ₃)
**Variable Type:** Continuous, θ₃ ∈ [0, 1]

θ₃ = (Beneficiaries from marginalised households) ÷ (Total beneficiaries)

**Marginalised households (expanded definition):** SC / ST / de-notified tribes / landless / women-headed / differently-abled-headed / elderly-headed households.

**Data source:** SECC, PM-JANMAN, scheme beneficiary categorisation data, field survey.

> **For intangible commons (T1.1 = E):** θ₃ should additionally capture whether traditional knowledge holders — who may be a small specialist group (healers, seed custodians, artisans, oral historians) — are recognised and included as primary beneficiaries, even if their absolute household count is small relative to the community. The auditor may supplement the θ₃ calculation with a qualitative note on specialist custodian inclusion.

**Pass threshold: θ₃ ≥ 0.40**

---

#### T2.3 — Functional Community Representative Body Mandated in Governance
**Variable Type:** Binary

Is there a formally constituted body that includes local dwellers and has a mandated role in decision-making for the scheme?

Score **1** only when all three conditions are met:
1. A formally constituted body exists (Gram Sabha, User Group, JFM Committee, Village Water Committee, SHG federation, BMC, or equivalent)
2. Its role in scheme decision-making is **mandated** by scheme guidelines — not merely optional or consultative
3. The body is **functional:** evidenced by ≥ 2 documented meetings in the prior 12 months, with recorded resolutions or minutes available for verification

Score **0** if:
- No body exists
- Body exists on paper only with no meeting record
- Body's role is purely advisory with no decision-making mandate

> *The functional qualifier addresses the most common governance fiction in scheme implementation: committees created to satisfy guidelines but never convened.*

**Pass threshold: T2.3 = 1**

---

#### T2.4 — Grievance / Voice Mechanism for Non-Beneficiaries
**Variable Type:** Binary *(upgraded from enhancement to soft gate)*

Is there a formal mechanism through which local dwellers excluded from benefits can raise objections?

- **1** = Formal mechanism exists (Gram Sabha complaint process, Social Audit, MIS grievance portal, Ombudsman) and is institutionally mandated at scheme level — not merely permitted
- **0** = No mechanism exists or mechanism is purely discretionary

**T2.4 = 0 does not fail Test 2.**

> **Governance gap trigger:** T2.4 = 0 must be recorded as a governance gap in the audit report. If T2.4 = 0 alongside any other enhancement flag being absent (T1.5, T2.5, T3.5, or T4.6 = 0), the scheme is classified as **SOC with Governance Gaps** rather than a clean SOC, even if all 4 tests pass.

---

#### T2.5 — Women's Representation in Governance Body *(Enhancement Variable)*
**Variable Type:** Binary

Do women constitute ≥ 33% of the community representative body's membership or office-bearing positions?

- **1** = Women ≥ 33% of body (consistent with 73rd Constitutional Amendment provisions for local self-government)
- **0** = Women's representation below 33% or not documented

**This variable does not affect Test 2 pass/fail.**

> **Upgrade pathway flag:** When T2.5 = 0 and T2.2 shows women-headed households as a significant beneficiary group, flag the gap between benefit capture and governance representation. This is the most common and correctable structural inequity in commons governance.

---

### Test 2 Pass/Fail Logic

```
θ₂ ≥ 0.70 (using applicable "local" definition)
AND θ₃ ≥ 0.40 (using expanded marginalised definition)
AND T2.3 = 1 (functional, not paper-only)
→ TEST 2 PASS

Any of the following → TEST 2 FAIL:
  θ₂ < 0.70
  θ₃ < 0.40
  T2.3 = 0

T2.4 = 0 → GOVERNANCE GAP FLAG (feeds Master Decision Rule)
T2.5 = 0 with high women beneficiary share → UPGRADE PATHWAY FLAG
```

---

## Test 3 — Clear Economic Opportunity

The scheme must translate commons access into a **measurable income or livelihood stream** for dwellers. This rules out purely protective or infrastructure schemes (e.g., a scheme that builds a fence around a protected forest but creates no livelihood pathway). It also rules out schemes where the economic benefit is theoretical — present in scheme design but absent in practice.

### Sub-Parameters

---

#### T3.1 — Livelihood / Income Output Indicator or Pathway Mandated
**Variable Type:** Binary

Score **1** if either condition is met:
- The scheme's official guidelines / DPR / log-frame contain a mandatory output indicator measuring income or livelihood creation (employment days generated, income per household, enterprise formation rate, price received for produce); **OR**
- The scheme explicitly enables a livelihood pathway through commons access, with the economic mechanism from commons to income **articulated in scheme design documents** — even if the output indicator is expressed in physical terms (e.g., area under traditional crop varieties, number of seed custodian households supported, number of practitioners trained in a knowledge commons)

Score **0** only if the scheme's sole outputs are physical infrastructure assets with no livelihood sub-indicator and no articulated economic pathway to beneficiary income.

**Pass threshold: T3.1 = 1**

---

#### T3.2 — Incremental Income Per Beneficiary Household / Year
**Variable Type:** Continuous (₹/HH/year) — split by data type

**ΔY** = Average annual income gain per beneficiary household attributable to the scheme.

| Data Type | Threshold | Treatment |
|---|---|---|
| **Observed ΔY** — from evaluation studies, independent assessments, or MIS-verified data | **≥ ₹3,000 / HH / year** | Governs when available. Flag as *"Observed."* |
| **Projected ΔY** — from scheme guidelines, DPR estimates, projected income models | **≥ ₹5,000 / HH / year** | Used only when no evaluation data exists. Flag as *"Projected — re-verify at scheme mid-term."* |

> When both observed and projected data exist, **observed ΔY governs.** A projected-only pass is provisional and must be re-verified at the scheme's mid-term evaluation. The lower threshold for observed data is justified: real, conservative income data is more reliable than optimistic DPR projections even if the absolute number is smaller.

**Data source:** Scheme impact evaluations, independent studies, MIS income tracking, household surveys.

---

#### T3.3 — Income Pathway Diversity
**Variable Type:** Ordinal 0–3

Count the number of **distinct livelihood pathways** explicitly enabled by the scheme design. Each pathway must be articulated in scheme documents — not merely coincidental.

| Score | Meaning |
|---|---|
| **0** | No livelihood pathway — fails Test 3 regardless of other scores |
| **1** | Single pathway — minimum pass |
| **2** | Two distinct pathways — strengthens SOC classification |
| **3** | Three or more pathways — strong SOC signal |

**Examples of qualifying pathways:**

*Natural/physical commons:* fisheries, irrigation, wage employment, NTFP collection, biogas enterprise, watershed-driven crop productivity, fodder/pasture income, ecotourism

*Intangible/knowledge commons:* traditional variety seed sales, GI-tagged produce premium, ecotourism rooted in cultural practices, community-certified organic premium, bioprospecting revenue through BMC benefit-sharing, artisan cooperative income from traditional craft commons, traditional medicine practice, knowledge documentation fee

---

#### T3.4 — Market or Institutional Offtake Mechanism Exists
**Variable Type:** Binary

Is there a guaranteed buyer, government procurement mechanism, or institutional demand channel for produce/services derived from the commons?

Score **1** if any of the following exist and are operational:
- MSP procurement of produce (millets, minor forest produce, etc.)
- Government agency offtake agreement (TDCCOL, OMC, NAFED, etc.)
- MGNREGS / NRM wage payment as institutional demand
- GI tag or community certification with a **documented buyer network**
- Biodiversity Management Committee (BMC) access and benefit-sharing agreement under the Biological Diversity Act
- Community seed variety registration with documented distribution or exchange network
- Fair trade or organic certification with an institutional buyer
- State government procurement scheme for tribal/community produce

Score **0** if output marketing is purely market-dependent with no institutional backstop, certification pathway, or procurement guarantee.

**Pass threshold: T3.4 = 1**

---

#### T3.5 — Non-Monetary Livelihood Indicator Tracked *(Enhancement Variable)*
**Variable Type:** Binary

Does the scheme track at least one **non-monetary benefit metric** for beneficiary households?

- **1** = Scheme MIS or evaluation framework tracks: food security (months of food sufficiency), nutritional diversity (number of food species accessed from commons), fodder availability (livestock feeding days secured from commons), or access to medicinal plants / traditional medicine
- **0** = Only monetary / income metrics are tracked

**This variable does not affect Test 3 pass/fail.**

> **Near-threshold flag:** A scheme with ΔY near the pass threshold (₹3,000–5,000) and T3.5 = 0 should be flagged as **potentially under-measuring true economic benefit**. Non-monetary outputs from commons (food, fodder, medicine) have real economic value that does not appear in income surveys. The audit report must note this limitation.

---

### Test 3 Pass/Fail Logic

```
T3.1 = 1
AND ΔY ≥ ₹3,000 (if observed) OR ΔY ≥ ₹5,000 (if projected only)
AND T3.3 ≥ 1
AND T3.4 = 1
→ TEST 3 PASS

Any of the following → TEST 3 FAIL:
  T3.1 = 0
  ΔY below applicable threshold
  T3.3 = 0
  T3.4 = 0

T3.5 = 0 with ΔY near threshold → FLAG: Potentially under measuring true economic benefit.
Projected-only ΔY pass → FLAG: provisional, re-verify at mid-term evaluation
```

---

## Test 4 — Mandatory Sustainability / Replenishment Lock

This is the most diagnostic test. A scheme can score well on Tests 1–3 and still fail as a SOC if it creates an **extractive feedback loop** — where the economic opportunity accelerates depletion of the commons without a structurally mandated replenishment or continuity obligation. Test 4 checks for the presence and enforceability of that lock-in.

> **Why Test 4 failure is more severe:** A T4 failure means the scheme is generating income *from* the commons but has no structural guarantee that the commons will survive the scheme's economic pressure. This is a design flaw, not an implementation gap. Near-SOC with T4 failure = **Near-SOC (Structural)** — requiring redesign, not adjustment.

### Sub-Parameters

---

#### T4.1 — Existence of a Mandatory Replenishment or Continuity Rule
**Variable Type:** Binary

Is there a legally-binding or scheme-guideline-mandated obligation to replenish, restore, maintain, or sustain the commons resource?

Score **1** if a written obligation exists in the scheme's operational guidelines **and** non-compliance has a defined consequence (fund withholding, disqualification, reduced allocation). Aspirational language without an enforcement trigger = 0.

**By commons type:**

| Commons Type | Qualifying Replenishment/Continuity Rule |
|---|---|
| Water commons | Annual Water Security Plan; recharge structure construction mandate; desilting obligation |
| Forest / land commons | Afforestation obligation; NRM spend mandate (e.g., MGNREGS ≥ 60% on NRM); regeneration norm |
| Pasture / dryland | Rest period mandate; rotational grazing protocol; re-seeding obligation |
| Fisheries | Closed-season enforcement; stocking obligation; gear restriction |
| **Knowledge / cultural commons** | **Knowledge documentation mandate (Village Ecological Register update); seed bank replenishment obligation; youth knowledge-transfer component mandated in scheme design; cultural institution strengthening as a measurable scheme output** |

**Pass threshold: T4.1 = 1**

---

#### T4.2 — Extraction-to-Replenishment Ratio (ρ) / Vitality Index (VI)
**Variable Type:** Conditional — track determined by commons type

**Auditor declaration required:** At the start of T4 assessment, the auditor must declare which track applies based on T1.1 category.

---

**Track A — ρ Ratio (for subtractable / extractable natural commons)**

Applies to: water, forest biomass, soil, fisheries, pasture, biodiversity resources (T1.1 = A1, A2, B, D)

ρ = (Annual extraction rate from commons enabled by scheme) ÷ (Annual replenishment rate mandated / created by scheme)

| ρ Value | Interpretation |
|---|---|
| ρ ≤ 1.0 | Sustainable: replenishment ≥ extraction |
| 1.0 < ρ ≤ 1.2 | Acceptable: within measurement tolerance |
| ρ > 1.2 | Net depletion: Test 4 FAIL |

> If T1.5 = 0 (resource un-demarcated), ρ must be flagged as **estimated**. The auditor must document the proxy method used (irrigation area × average water use ÷ recharge capacity) and note the uncertainty range.

**Pass threshold: ρ ≤ 1.2**

---

**Track B — Vitality Index (VI) (for intangible / non-subtractable commons)**

Applies to: traditional knowledge systems, seed custodianship, cultural practices, governance norms, community institutional commons (T1.1 = E)

*Rationale: Knowledge is not depleted by use or sharing — it is depleted by neglect, out-migration, and loss of practitioners. The ρ ratio is inapplicable. The Vitality Index assesses the trajectory of the commons.*

| Score | Meaning |
|---|---|
| **0** | Commons in active decline: practitioner / custodian count reducing, no documentation active, youth disengagement documented, knowledge erosion observed |
| **1** | Commons stable: practitioner count stable, some documentation exists, no active decline observed |
| **2** | Commons growing: new practitioners being trained, documentation active and current, scheme is expanding commons reach and transmission |

**Pass threshold: VI ≥ 1**

---

#### T4.3 — Monitoring and Public Disclosure Frequency
**Variable Type:** Ordinal 0–3

How frequently is **resource health** measured and publicly disclosed at the GP / community level?

| Score | Meaning |
|---|---|
| **0** | No measurement of any kind |
| **1** | Annual reporting by government agency only |
| **2** | Quarterly report accessible to community (GP noticeboard, scheme portal) |
| **3** | Real-time or continuous monitoring with community-accessible dashboard |

**Resource health metrics — by commons type:**

| Commons Type | Health Metrics |
|---|---|
| Groundwater | DWLR piezometer readings, water table depth, block-level CGWB status |
| Surface water | Pond / reservoir water level, storage volume |
| Forest / land | Forest cover change (ISFR), soil organic carbon, vegetation index |
| Pasture | Pasture condition index, fodder availability per livestock unit |
| Fisheries | Fish stock assessment, catch per unit effort |
| **Knowledge / cultural** | **Number of seed varieties conserved in community seed bank; number of trained practitioners / custodians; number of knowledge documentation records active and updated; cultural practice participation rates** |

**Base pass threshold: T4.3 ≥ 1**

> **Climate vulnerability override (T4.7):** If the commons resource is in a climate-stressed zone (see T4.7), the pass threshold upgrades to **T4.3 ≥ 2**.

---

#### T4.4 — Financial Penalty or Grant Withholding for Non-Compliance
**Variable Type:** Binary

Does the scheme design include a consequence mechanism if the replenishment or continuity obligation (T4.1) is not met?

- **1** = Scheme explicitly states a consequence: withholding of next-tranche funds, reduction of incentive grant, disqualification from scheme benefits, reduction of state allocation, or equivalent
- **0** = No consequence mechanism stated; replenishment obligation exists on paper only

**Pass threshold: T4.4 = 1 OR T4.5 = 1** (either is sufficient)

---

#### T4.5 — Post-Scheme Continuity Mechanism *(Renamed from "O&M Fund")*
**Variable Type:** Binary

Is there a designated fund or institutional mechanism for continuing stewardship of the commons **after** the scheme's active intervention phase is complete?

Score **1** if a continuity mechanism is **designed into the scheme** — not assumed from GP general funds without earmarking.

**By commons type:**

| Commons Type | Qualifying Continuity Mechanism |
|---|---|
| Physical / natural commons | O&M fund (e.g., WDC-PMKSY 10% project cost); user group fisheries revenue earmarked for maintenance; GP resolution with budget line |
| **Intangible / knowledge commons** | **Biodiversity Management Committee (BMC) with ongoing mandate under BD Act; registered seed custodian group with GP resolution and succession plan; cultural institution formally constituted with documented continuity protocol; community knowledge archive with designated custodian institution** |

Score **0** if continuity is expected from GP general funds without earmarking, or if no institutional vehicle exists beyond the scheme's project period.

**Pass threshold: T4.5 = 1 OR T4.4 = 1** (either is sufficient)

---

#### T4.6 — Community-Led Monitoring Participation *(Enhancement Variable)*
**Variable Type:** Binary

Does the community itself — not only a government agency — participate in monitoring resource health?

- **1** = Community participates through: social audits, community monitoring committees, participatory resource assessments, Village Ecological Registers updated by community members, community-managed DWLR / sensor reading, or equivalent
- **0** = Monitoring is conducted exclusively by government agencies with no community participation in measurement or disclosure

**This variable does not affect Test 4 pass/fail.**

> **Critical upgrade lever:** T4.6 = 0 is the single most important upgrade pathway for Near-SOC (Structural) schemes. Government-only monitoring has a documented pattern of delayed or suppressed disclosure in stressed commons — particularly groundwater over-exploitation and forest degradation. When T4.6 = 0, the auditor must flag it as the primary structural gap in the sustainability lock. A community that monitors its own commons is more likely to enforce replenishment obligations than one that depends on government reporting.

---

#### T4.7 — Climate Vulnerability Conditional *(Conditional Tightening)*
**Variable Type:** Binary trigger

Assess whether the commons resource is in a **climate-stressed zone** using the following indicators:

| Resource Type | Climate Stress Indicator |
|---|---|
| Groundwater | CGWB over-exploited or critical block classification |
| Forest | ISFR high fire-risk zone or high deforestation-pressure district |
| Dryland / pasture | NDMA drought-prone block |
| Coastal / fisheries | IMD cyclone-prone zone or documented coral bleaching / mangrove loss |
| **Knowledge / cultural** | **Community in high out-migration zone (>10% annual working-age out-migration rate per Census / PLFS) — primary driver of practitioner attrition** |

**If climate-stressed = YES:** T4.3 pass threshold **upgrades from ≥ 1 to ≥ 2** (quarterly community-accessible disclosure required; annual government reporting is insufficient for a resource under accelerating external stress)

**If climate-stressed = NO:** T4.3 ≥ 1 applies as standard.

> This is a **conditional tightening**, not a new hard gate. It does not add a new pass/fail dimension — it adjusts the T4.3 threshold based on context.

---

### Test 4 Pass/Fail Logic

```
T4.1 = 1
AND [ρ ≤ 1.2 (natural commons) OR VI ≥ 1 (intangible commons)]
AND T4.3 ≥ 1 [upgrades to ≥ 2 if T4.7 triggers climate-stressed classification]
AND (T4.4 = 1 OR T4.5 = 1)
→ TEST 4 PASS

Any of the following → TEST 4 FAIL:
  T4.1 = 0
  ρ > 1.2 (natural commons)
  VI = 0 (intangible commons)
  T4.3 = 0 [or T4.3 = 1 when T4.7 requires ≥ 2]
  T4.4 = 0 AND T4.5 = 0

T4.6 = 0 → FLAG: primary upgrade lever; most critical structural gap
T4.7 triggered AND T4.3 = 1 → FLAG: monitoring insufficient for climate-stressed zone
T1.5 = 0 → FLAG: ρ / VI based on estimates, not measurement; record uncertainty
```

---

## 5. Consolidated Scoring Sheet

The table below consolidates all sub-parameters into a single reference for field application.

| Test | ID | Sub-Parameter | Variable Type | Pass Threshold | Gate Type | Data Source |
|---|---|---|---|---|---|---|
| T1 | T1.1 | Governance/ownership type of resource | Categorical (5 classes) | A1/B/D/E; A2 only if T1.2 ≥ 1 | Hard gate | Land records, scheme guidelines |
| T1 | T1.2 | Community access or practice right | Ordinal 0–2 | ≥ 1 | Hard gate | Statute, Act, GP resolution, FRA title |
| T1 | T1.3 | Fraction of spend on non-private resources (θ₁) | Continuous | ≥ 0.50 | Hard gate | Financial statements, DPR, guidelines |
| T1 | T1.4 | Excludability of resource benefits | Ordinal 0–2 | ≥ 1 | Hard gate | Scheme design, asset type, field verification |
| T1 | T1.5 | Resource boundary demarcation | Binary | Enhancement | Flag if 0 | Survey map, GP resolution, BMC register |
| T1 | T1.6 | No active legal encumbrance | Binary | = 1 | Hard gate (auto-fail if 0) | Revenue records, forest diversion orders, mining registry |
| T2 | T2.1 | Fraction of local dwellers as beneficiaries (θ₂) | Continuous | ≥ 0.70 | Hard gate | Beneficiary MIS, field survey |
| T2 | T2.2 | Marginalised beneficiary share (θ₃) | Continuous | ≥ 0.40 | Hard gate | SECC, PM-JANMAN, scheme MIS |
| T2 | T2.3 | Functional community representative body | Binary | = 1 (functional) | Hard gate | Meeting minutes, GP records, scheme guidelines |
| T2 | T2.4 | Grievance/voice mechanism | Binary | Soft gate | Flag if 0 | Social Audit provisions, scheme portal |
| T2 | T2.5 | Women's representation ≥ 33% in governance body | Binary | Enhancement | Flag if 0 | Committee records, GP register |
| T3 | T3.1 | Livelihood/income output indicator or pathway mandated | Binary | = 1 | Hard gate | Scheme guidelines, log-frame, DPR |
| T3 | T3.2 | Incremental income ΔY/HH/year | Continuous (₹) | ≥ ₹3,000 (observed) / ≥ ₹5,000 (projected) | Hard gate | Evaluation studies, MIS, household surveys |
| T3 | T3.3 | Income pathway diversity | Ordinal 0–3 | ≥ 1 | Hard gate | Scheme guidelines, field reports |
| T3 | T3.4 | Market/institutional offtake mechanism | Binary | = 1 | Hard gate | MOU, government orders, BMC agreement, certification |
| T3 | T3.5 | Non-monetary livelihood indicator tracked | Binary | Enhancement | Flag if 0 near ΔY threshold | Scheme MIS, evaluation framework |
| T4 | T4.1 | Mandatory replenishment or continuity rule | Binary | = 1 | Hard gate | Scheme operational guidelines |
| T4 | T4.2 | ρ ratio (natural) / Vitality Index VI (intangible) | Continuous / Ordinal | ρ ≤ 1.2 / VI ≥ 1 | Hard gate | Impact evaluations, sensor data, field assessment |
| T4 | T4.3 | Monitoring and public disclosure frequency | Ordinal 0–3 | ≥ 1 (or ≥ 2 if T4.7 triggered) | Hard gate | Scheme portal, MIS, GP noticeboard |
| T4 | T4.4 | Financial penalty for non-compliance | Binary | = 1 OR T4.5 = 1 | Hard gate | Scheme guidelines, grant conditions |
| T4 | T4.5 | Post-scheme continuity mechanism | Binary | = 1 OR T4.4 = 1 | Hard gate | Scheme guidelines, state GO, BMC constitution |
| T4 | T4.6 | Community-led monitoring participation | Binary | Enhancement | Flag — primary upgrade lever | Social Audit records, VER, community committee records |
| T4 | T4.7 | Climate vulnerability conditional | Binary trigger | Raises T4.3 threshold if triggered | Conditional | CGWB, ISFR, NDMA, Census out-migration data |

---

## 6. Audit Guidance Notes

### 6.1 Order of Assessment

Conduct tests in sequence: T1 → T2 → T3 → T4. A Test 1 failure does not require completing Tests 2–4; however, completing all four tests for Near-SOC schemes is recommended to identify the upgrade pathway.

### 6.2 Declaration Requirements

At the start of each scheme audit, the auditor must declare:
1. **Commons type** (T1.1 category: A1/A2/B/C/D/E) — this determines which track applies for T1.3, T4.2, T4.3, and T4.5
2. **Community type** (settled / pastoral / mobile) — determines T2.1 "local" definition
3. **ρ or VI track** for T4.2
4. **Climate stress status** (T4.7) — determines T4.3 threshold

### 6.3 Enhancement Variables — Aggregation Rule

Enhancement variables (T1.5, T2.4, T2.5, T3.5, T4.6) do not fail individual tests. They aggregate at the Master Decision Rule level:

- 0 or 1 enhancement flags absent → clean SOC or Near-SOC classification
- ≥ 2 enhancement flags absent (with all 4 tests passing) → **SOC with Governance Gaps**

The audit report must list all absent enhancement variables and recommend the lowest-cost corrective action for each.

### 6.4 Provisional Passes

Two conditions generate provisional passes that require re-verification:
- **T3.2 projected-only pass:** Re-verify at scheme mid-term evaluation
- **T4.2 ρ ratio estimated (T1.5 = 0):** Re-verify when boundary demarcation is completed

Provisional passes count as passes for classification purposes but are noted in the scheme's audit record.

### 6.5 Upgrade Pathway Reporting

For every Near-SOC scheme (Operational or Structural), the audit report must:
1. Identify the **single failing test** precisely
2. Identify the **specific sub-parameter(s)** that caused the failure
3. Propose a **minimum corrective action** — the lowest-cost scheme design or guideline change that would convert the failure to a pass
4. Estimate the **timeline** for that corrective action to be verifiable

For Near-SOC (Structural) — T4 failures — the upgrade pathway must include a T4.6 (community-led monitoring) activation plan, regardless of which specific T4 sub-parameter failed.

---

*End of Part I — SOC Diagnostic Framework*
