// 1. Import all 8 JSON files from the data/ folder
import agriculture from "../data/agriculture.json";
import animalHusbandry from "../data/animal-husbandry.json";
import fisheries from "../data/fisheries.json";
import forest from "../data/forest.json";
import panchayatRuralEngineering from "../data/panchayat-rural-engineering.json";
import ruralDevelopment from "../data/rural-development.json";
import tribalAffairs from "../data/tribal-affairs.json";
import waterResources from "../data/water-resources.json";

// ============================================================================
// SOC Framework TypeScript Interfaces
// Extended fields are marked optional (?) for backward compatibility
// ============================================================================

// 2a. Classification type
export type Classification = 
  | 'SOC' 
  | 'SOC with Governance Gaps' 
  | 'Near-SOC (Operational)' 
  | 'Near-SOC (Structural)' 
  | 'Non-SOC';

// 2b. Reference interface
export interface Reference {
  id: string;
  title: string;
  url: string;
  type: 'official_guidelines' | 'budget_document' | 'evaluation_report' | 'mis_portal' | 'cag_report' | 'legal_act' | 'news_official' | 'research_paper';
  verified: boolean;
  accessed: string;
  relevantTo: string[];
}

// 2c. Sub-parameter interfaces
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

// 2d. Department interface
export interface Department {
  department: string;
  slug: string;
  state?: string;
  totalSchemes: number;
  summary: {
    soc: number;
    nearSoc?: number;
    socWithGaps?: number;
    nearSocOperational?: number;
    nearSocStructural?: number;
    nonSoc: number;
  };
  dominantFinding?: string;
  dominantFailure?: string;
  commonsProfile?: {
    primaryCommonsTypes?: string[];
    climateStressedZones?: boolean;
    keyEcologicalContext?: string;
  };
  structuralFindings: {
    dominantProblem: string;
    socException: string;
    crossCuttingPriorities: string[];
    contextualFactors: string[];
  };
  schemes: Scheme[];
}

// 2e. Scheme interface
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
}

// 4. Export a constant "allDepartments" array containing all 8 imported JSON objects
export const allDepartments: Department[] = [
  agriculture as Department,
  animalHusbandry as Department,
  fisheries as Department,
  forest as Department,
  panchayatRuralEngineering as Department,
  ruralDevelopment as Department,
  tribalAffairs as Department,
  waterResources as Department,
];

// 5. Export a helper function "getDepartmentBySlug(slug: string): Department | undefined"
export function getDepartmentBySlug(slug: string): Department | undefined {
  return allDepartments.find((dept) => dept.slug === slug);
}

// 6. Export a helper function "getAllSchemes()"
export function getAllSchemes(): Array<Scheme & { departmentName: string; departmentSlug: string }> {
  return allDepartments.flatMap((dept) =>
    dept.schemes.map((scheme) => ({
      ...scheme,
      departmentName: dept.department,
      departmentSlug: dept.slug,
    }))
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

// 7. Get all schemes by classification
export function getAllSchemesByClassification(classification: string): Array<Scheme & { departmentName: string; departmentSlug: string }> {
  return getAllSchemes().filter((s) => s.classification === classification);
}

// 8. Get departments with Near-SOC (Structural) schemes
export function getDepartmentsWithNearSocStructural(): Department[] {
  return allDepartments.filter((d) => {
    const nearSocStructural = d.summary.nearSocStructural || 0;
    return nearSocStructural > 0;
  });
}

// 9. Get governance flag count for a scheme
export function getGovernanceFlagCount(scheme: Scheme): number {
  return scheme.governanceFlags?.length || 0;
}

// 10. Get total count by classification
export function getTotalByClassification(classification: Classification): number {
  return getAllSchemes().filter((s) => s.classification === classification).length;
}

// 11. Get total schemes with any governance flags
export function getTotalSchemesWithFlags(): number {
  return getAllSchemes().filter((s) => getGovernanceFlagCount(s) > 0).length;
}
