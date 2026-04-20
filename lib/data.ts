// 1. Import all 8 JSON files from the data/ folder
import agriculture from "../data/agriculture.json";
import animalHusbandry from "../data/animal-husbandry.json";
import fisheries from "../data/fisheries.json";
import forest from "../data/forest.json";
import panchayatRuralEngineering from "../data/panchayat-rural-engineering.json";
import ruralDevelopment from "../data/rural-development.json";
import tribalAffairs from "../data/tribal-affairs.json";
import waterResources from "../data/water-resources.json";

// 2. Export a TypeScript type called "Department" that matches the JSON structure
export interface Department {
  department: string;
  slug: string;
  totalSchemes: number;
  summary: {
    soc: number;
    nearSoc: number;
    nonSoc: number;
  };
  dominantFailure?: string; // Some might have this
  structuralFindings: {
    dominantProblem: string;
    socException: string;
    crossCuttingPriorities: string[];
    contextualFactors: string[];
  };
  schemes: Scheme[];
}

// 3. Export a "Scheme" type for individual schemes
export interface Scheme {
  id: string;
  name: string;
  hindiName: string | null;
  objective: string;
  tests: {
    t1: boolean;
    t2: boolean;
    t3: boolean;
    t4: boolean;
  };
  score: number;
  classification: string;
  evidence: {
    t1: string;
    t2: string;
    t3: string;
    t4: string;
  };
  upgradePathway: string[];
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
