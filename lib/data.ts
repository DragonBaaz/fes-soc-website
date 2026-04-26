import canonicalSchemesRaw from "@/data/generated/canonical-schemes.json";
import departmentAggregatesRaw from "@/data/generated/department-aggregates.json";

// ============================================================================
// SOC Framework TypeScript Interfaces
// Extended fields are marked optional (?) for backward compatibility
// ============================================================================

export type Classification = 
  | 'SOC' 
  | 'SOC with Governance Gaps' 
  | 'Near-SOC (Operational)' 
  | 'Near-SOC (Structural)' 
  | 'Non-SOC'
  | 'Unknown';

type CanonicalStatus = 'PASS' | 'FAIL' | 'PASS-PROVISIONAL' | 'UNKNOWN';

interface CanonicalTest {
  status: CanonicalStatus;
  criteria?: Record<string, string>;
  enhancements?: Record<string, string>;
  questionValues?: Record<string, unknown>;
  unverifiedFields?: string[];
}

interface CanonicalScheme {
  schemeId: string;
  schemeName: string;
  departmentName: string;
  departmentSlug: string;
  classification?: {
    value: string;
    derived?: boolean;
    reasoning?: string[];
  };
  tests?: {
    t1?: CanonicalTest;
    t2?: CanonicalTest;
    t3?: CanonicalTest;
    t4?: CanonicalTest;
  };
  governanceFlags?: string[];
  objectiveText?: string | null;
  upgradePathway?: string[];
  narrative?: Record<string, string | null | undefined>;
  raw?: {
    programsMd?: string;
  };
}

interface DepartmentAggregate {
  departmentSlug: string;
  departmentName: string;
  dominantFindings?: {
    topFailurePattern?: string | null;
    topUpgradeLever?: string | null;
  };
}

export interface Reference {
  id: string;
  title: string;
  url: string;
  type: 'official_guidelines' | 'budget_document' | 'evaluation_report' | 'mis_portal' | 'cag_report' | 'legal_act' | 'news_official' | 'research_paper';
  verified: boolean;
  accessed: string;
  relevantTo: string[];
}

export interface SubParametersT1 {
  T1_1: { score: 'A1' | 'A2' | 'B' | 'C' | 'D' | 'E'; pass: boolean; note: string };
  T1_2: { score: 0 | 1 | 2; pass: boolean; note: string };
  T1_3: { score: number; pass: boolean; note: string };
  T1_4: { score: 0 | 1 | 2; pass: boolean; note: string };
  T1_5?: { score: 0 | 1; flag: string | null; note: string };
  T1_6?: { score: 0 | 1; pass: boolean; note: string };
}

export interface SubParametersT2 {
  T2_1: { score: number; pass: boolean; localDefinition?: 'settled' | 'pastoral'; note: string };
  T2_2: { score: number; pass: boolean; note: string };
  T2_3: { score: 0 | 1; pass: boolean; functional?: boolean; note: string };
  T2_4?: { score: 0 | 1; flag: string | null; note: string };
  T2_5?: { score: 0 | 1; flag: string | null; note: string };
}

export interface SubParametersT3 {
  T3_1: { score: 0 | 1; pass: boolean; note: string };
  T3_2: { score: number; dataType?: 'observed' | 'projected'; pass: boolean; provisional?: boolean; note: string };
  T3_3: { score: 0 | 1 | 2 | 3; pass: boolean; pathways?: string[]; note: string };
  T3_4: { score: 0 | 1; pass: boolean; offtakeMechanism?: string | null; note: string };
  T3_5?: { score: 0 | 1; flag: string | null; note: string };
}

export interface SubParametersT4 {
  T4_1: { score: 0 | 1; pass: boolean; rule?: string | null; note: string };
  T4_2: { track?: 'rho' | 'vi'; rho?: number | null; vi?: 0 | 1 | 2 | null; pass: boolean; estimated?: boolean; note: string };
  T4_3: { score: 0 | 1 | 2 | 3; climateStressed?: boolean; requiredThreshold?: 1 | 2; pass: boolean; metrics?: string[]; note: string };
  T4_4: { score: 0 | 1; note: string };
  T4_5: { score: 0 | 1; mechanismType?: 'physical_OM' | 'intangible_stewardship' | null; note: string };
  T4_6?: { score: 0 | 1; flag: string | null; note: string };
  T4_7?: { triggered: boolean; stressType?: 'groundwater' | 'forest' | 'dryland' | 'coastal' | 'outmigration' | null; note: string };
}

export interface Scheme {
  id: string;
  name: string;
  hindiName: string | null;
  tier?: 'Central' | 'State' | 'Local';
  nodalMinistry?: string;
  budgetOutlay?: string;
  reach?: string;
  objective: string;
  commonsType?: 'A1' | 'A2' | 'B' | 'C' | 'D' | 'E';
  commonsTrack?: 'natural' | 'intangible';
  tests: {
    t1: boolean;
    t2: boolean;
    t3: boolean;
    t4: boolean;
  };
  score: number;
  classification: string;
  governanceFlags?: string[];
  subParameters?: {
    t1: SubParametersT1;
    t2: SubParametersT2;
    t3: SubParametersT3;
    t4: SubParametersT4;
  };
  evidence: {
    t1: string;
    t2: string;
    t3: string;
    t4: string;
  };
  upgradePathway: string[];
  references?: Reference[];
  canonicalData?: CanonicalScheme; // Injecting the rich data bypass
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isPass(status?: CanonicalStatus): boolean {
  return status === "PASS" || status === "PASS-PROVISIONAL";
}

function normalizeClassification(value?: string): Classification {
  switch (value) {
    case "SOC":
    case "SOC with Governance Gaps":
    case "Near-SOC (Operational)":
    case "Near-SOC (Structural)":
    case "Non-SOC":
      return value;
    case "Adjacent / Non-SOC":
      return "Non-SOC";
    default:
      return "Unknown";
  }
}

function toEvidenceString(test?: CanonicalTest): string {
  if (!test) {
    return "No evidence available.";
  }

  const criteria = Object.entries(test.criteria || {})
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
  const enhancements = Object.entries(test.enhancements || {})
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
  const unverified = (test.unverifiedFields || []).join(", ");

  return [
    `Status: ${test.status}`,
    criteria ? `Criteria: ${criteria}` : "",
    enhancements ? `Enhancements: ${enhancements}` : "",
    unverified ? `Unverified: ${unverified}` : "",
  ]
    .filter(Boolean)
    .join(" | ");
}

function parseCanonicalSchemes(): CanonicalScheme[] {
  if (Array.isArray(canonicalSchemesRaw)) {
    return canonicalSchemesRaw as CanonicalScheme[];
  }

  const container = canonicalSchemesRaw as { schemes?: CanonicalScheme[] };
  return Array.isArray(container.schemes) ? container.schemes : [];
}

function parseDepartmentAggregates(): DepartmentAggregate[] {
  if (Array.isArray(departmentAggregatesRaw)) {
    return departmentAggregatesRaw as DepartmentAggregate[];
  }

  const container = departmentAggregatesRaw as { departments?: DepartmentAggregate[] };
  return Array.isArray(container.departments) ? container.departments : [];
}

const canonicalSchemes = parseCanonicalSchemes();
const departmentAggregates = parseDepartmentAggregates();
const aggregateBySlug = new Map(
  departmentAggregates.map((aggregate) => [aggregate.departmentSlug, aggregate])
);

function toLegacyScheme(canonical: CanonicalScheme): Scheme {
  const tests = {
    t1: isPass(canonical.tests?.t1?.status),
    t2: isPass(canonical.tests?.t2?.status),
    t3: isPass(canonical.tests?.t3?.status),
    t4: isPass(canonical.tests?.t4?.status),
  };

  const score = [tests.t1, tests.t2, tests.t3, tests.t4].filter(Boolean).length;
  const classification = normalizeClassification(canonical.classification?.value);

  return {
    id: canonical.schemeId,
    name: canonical.schemeName,
    hindiName: null,
    objective: canonical.objectiveText || canonical.narrative?.budget || "No objective available.",
    tests,
    score,
    classification,
    governanceFlags: canonical.governanceFlags || [],
    evidence: {
      t1: toEvidenceString(canonical.tests?.t1),
      t2: toEvidenceString(canonical.tests?.t2),
      t3: toEvidenceString(canonical.tests?.t3),
      t4: toEvidenceString(canonical.tests?.t4),
    },
    upgradePathway: canonical.upgradePathway || [],
    canonicalData: canonical, // Passing the rich data through
  };
}

function buildDepartments(schemes: CanonicalScheme[]): Department[] {
  const grouped = new Map<string, CanonicalScheme[]>();

  for (const scheme of schemes) {
    const slug = scheme.departmentSlug || slugify(scheme.departmentName || "unknown");
    const existing = grouped.get(slug);
    if (existing) {
      existing.push(scheme);
    } else {
      grouped.set(slug, [scheme]);
    }
  }

  return Array.from(grouped.entries())
    .map(([slug, deptSchemes]) => {
      const legacySchemes = deptSchemes.map(toLegacyScheme);
      const totalSchemes = legacySchemes.length;

      const soc = legacySchemes.filter((s) => s.classification === "SOC").length;
      const socWithGaps = legacySchemes.filter((s) => s.classification === "SOC with Governance Gaps").length;
      const nearSocOperational = legacySchemes.filter((s) => s.classification === "Near-SOC (Operational)").length;
      const nearSocStructural = legacySchemes.filter((s) => s.classification === "Near-SOC (Structural)").length;
      const nonSoc = legacySchemes.filter((s) => s.classification === "Non-SOC" || s.classification === "Unknown").length;

      const departmentName = deptSchemes[0]?.departmentName || slug;
      const aggregate = aggregateBySlug.get(slug);

      return {
        department: departmentName,
        slug,
        totalSchemes,
        summary: {
          soc,
          nearSoc: nearSocOperational + nearSocStructural,
          socWithGaps,
          nearSocOperational,
          nearSocStructural,
          nonSoc,
        },
        dominantFinding: aggregate?.dominantFindings?.topFailurePattern || undefined,
        structuralFindings: {
          dominantProblem: aggregate?.dominantFindings?.topFailurePattern || "Data generation in progress.",
          socException: aggregate?.dominantFindings?.topUpgradeLever || "No SOC exception identified yet.",
          crossCuttingPriorities: [
            "Strengthen evidence quality and source verification for all tests.",
            "Improve governance safeguards where enhancement flags are absent.",
          ],
          contextualFactors: [
            "Classification and priorities are derived from generated canonical data.",
          ],
        },
        schemes: legacySchemes,
      } satisfies Department;
    })
    .sort((a, b) => a.department.localeCompare(b.department));
}

export const allDepartments: Department[] = buildDepartments(canonicalSchemes);

export function getDepartmentBySlug(slug: string): Department | undefined {
  return allDepartments.find((dept) => dept.slug === slug);
}

export function getAllSchemes(): Array<
  Scheme & {
    departmentName: string;
    departmentSlug: string;
    t1: boolean;
    t2: boolean;
    t3: boolean;
    t4: boolean;
  }
> {
  return allDepartments.flatMap((dept) =>
    dept.schemes.map((scheme) => ({
      ...scheme,
      departmentName: dept.department,
      departmentSlug: dept.slug,
      t1: scheme.tests.t1,
      t2: scheme.tests.t2,
      t3: scheme.tests.t3,
      t4: scheme.tests.t4,
    }))
  );
}

export function getAllSchemesByClassification(classification: string): Array<Scheme & { departmentName: string; departmentSlug: string }> {
  return getAllSchemes().filter((s) => s.classification === classification);
}

export function getDepartmentsWithNearSocStructural(): Department[] {
  return allDepartments.filter((d) => {
    const nearSocStructural = d.summary.nearSocStructural || 0;
    return nearSocStructural > 0;
  });
}

export function getGovernanceFlagCount(scheme: Scheme): number {
  return scheme.governanceFlags?.length || 0;
}

export function getTotalByClassification(classification: string): number {
  return getAllSchemes().filter((s) => s.classification === classification).length;
}

export function getTotalSchemesWithFlags(): number {
  return getAllSchemes().filter((s) => getGovernanceFlagCount(s) > 0).length;
}