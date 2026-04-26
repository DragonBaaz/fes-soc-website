import { promises as fs } from "node:fs";
import path from "node:path";

export type CanonicalStatus = "PASS" | "FAIL" | "PASS-PROVISIONAL" | "UNKNOWN";

export interface CanonicalScheme {
  schemeId: string;
  schemeName: string;
  departmentName: string;
  departmentSlug: string;
  auditDate: string | null;
  sources: {
    folderPath: string;
    files: {
      programs: string;
      t1: string;
      t2: string;
      t3: string;
      t4a: string;
      t4b: string;
    };
  };
  classification: {
    value:
      | "SOC"
      | "SOC with Governance Gaps"
      | "Near-SOC (Operational)"
      | "Near-SOC (Structural)"
      | "Adjacent / Non-SOC"
      | "Unknown";
    derived: boolean;
    reasoning: string[];
  };
  tests: {
    t1: CanonicalTest;
    t2: CanonicalTest;
    t3: CanonicalTest;
    t4: CanonicalTest;
  };
  governanceFlags: string[];
  objectiveText: string | null;
  narrative: Record<string, string | null>;
  raw: {
    programsMd: string;
    t1: unknown;
    t2: unknown;
    t3: unknown;
    t4a: unknown;
    t4b: unknown;
    allAnswersByQid: Record<string, unknown>;
  };
  extensions: Record<string, unknown>;
  upgradePathway: string[];
}

export interface CanonicalTest {
  status: CanonicalStatus;
  criteria: Record<string, string>;
  enhancements: Record<string, string>;
  questionValues: Record<string, unknown>;
  unverifiedFields: string[];
}

export interface DepartmentAggregate {
  departmentSlug: string;
  departmentName: string;
  totalSchemes: number;
  classificationCounts: {
    SOC: number;
    "SOC with Governance Gaps": number;
    "Near-SOC (Operational)": number;
    "Near-SOC (Structural)": number;
    "Adjacent / Non-SOC": number;
    Unknown: number;
  };
  testPassCounts: {
    t1Pass: number;
    t2Pass: number;
    t3Pass: number;
    t4Pass: number;
  };
  enhancementAbsenceCounts: {
    "T1.5": number;
    "T2.4": number;
    "T2.5": number;
    "T3.5": number;
    "T4.6": number;
  };
  unverifiedSchemeCount: number;
  dominantFindings: {
    topFailurePattern: string | null;
    topUpgradeLever: string | null;
  };
  schemeIds: string[];
}

export interface BuildDatasetResult {
  schemes: CanonicalScheme[];
  departments: DepartmentAggregate[];
}

const FILES = {
  programs: "programs.md",
  t1: "t1_output.json",
  t2: "t2_output.json",
  t3: "t3_output.json",
  t4a: "t4a_output.json",
  t4b: "t4b_output.json",
} as const;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractPreferredValue(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const obj = value as Record<string, unknown>;
  if ("v" in obj) {
    return obj.v;
  }
  if ("value" in obj) {
    return obj.value;
  }
  return value;
}

function toCleanString(value: unknown): string {
  const preferred = extractPreferredValue(value);
  if (preferred === null || preferred === undefined) {
    return "";
  }
  if (typeof preferred === "string") {
    return preferred.trim();
  }
  if (typeof preferred === "number" || typeof preferred === "boolean") {
    return String(preferred);
  }
  return "";
}

function normalizeDepartmentName(raw: string, fallback: string): string {
  const source = raw || fallback;
  const firstClause = source.split(/[;,]/)[0]?.trim() || source;
  const normalized = firstClause.replace(/^department of\s+/i, "").trim();
  return normalized.length > 0 ? normalized : fallback;
}

function toNumber(value: unknown): number | null {
  const preferred = extractPreferredValue(value);

  if (typeof preferred === "number" && Number.isFinite(preferred)) {
    return preferred;
  }

  if (typeof preferred === "string") {
    const cleaned = preferred.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    if (cleaned) {
      const parsed = Number(cleaned[0]);
      return Number.isFinite(parsed) ? parsed : null;
    }
  }

  return null;
}

function normalizeYesNo(value: unknown): "YES" | "NO" | "UNKNOWN" {
  const preferred = extractPreferredValue(value);

  if (typeof preferred === "boolean") {
    return preferred ? "YES" : "NO";
  }

  const text = String(preferred ?? "").trim().toLowerCase();
  if (["yes", "y", "true", "1", "pass", "present"].includes(text)) {
    return "YES";
  }
  if (["no", "n", "false", "0", "fail", "absent"].includes(text)) {
    return "NO";
  }
  return "UNKNOWN";
}

function normalizePassFail(value: unknown): CanonicalStatus {
  const preferred = extractPreferredValue(value);
  const text = String(preferred ?? "").trim().toLowerCase();
  if (!text) {
    return "UNKNOWN";
  }
  if (text.includes("provisional")) {
    return "PASS-PROVISIONAL";
  }
  if (text.includes("pass") || text === "true" || text === "1") {
    return "PASS";
  }
  if (text.includes("fail") || text === "false" || text === "0") {
    return "FAIL";
  }
  return "UNKNOWN";
}

function collectQuestionValues(payload: unknown, target: Record<string, unknown> = {}): Record<string, unknown> {
  if (Array.isArray(payload)) {
    for (const item of payload) {
      collectQuestionValues(item, target);
    }
    return target;
  }

  if (!payload || typeof payload !== "object") {
    return target;
  }

  const objectPayload = payload as Record<string, unknown>;

  if (objectPayload.answers && typeof objectPayload.answers === "object" && !Array.isArray(objectPayload.answers)) {
    for (const [key, value] of Object.entries(objectPayload.answers as Record<string, unknown>)) {
      if (/^Q\d+$/i.test(key)) {
        target[key.toUpperCase()] = value;
      }
    }
  }

  for (const [key, value] of Object.entries(objectPayload)) {
    if (/^Q\d+$/i.test(key)) {
      target[key.toUpperCase()] = value;
    }
    if (value && typeof value === "object") {
      collectQuestionValues(value, target);
    }
  }

  return target;
}

function findPassToken(payload: unknown): CanonicalStatus {
  const primitiveCandidate = normalizePassFail(payload);
  if (primitiveCandidate !== "UNKNOWN") {
    return primitiveCandidate;
  }

  if (!payload || typeof payload !== "object") {
    return "UNKNOWN";
  }

  const objectPayload = payload as Record<string, unknown>;
  const candidateKeys = [
    "pass_verification",
    "passVerification",
    "pass",
    "status",
    "result",
    "verification",
  ];

  for (const key of candidateKeys) {
    if (key in objectPayload) {
      const normalized = normalizePassFail(objectPayload[key]);
      if (normalized !== "UNKNOWN") {
        return normalized;
      }

      if (objectPayload[key] && typeof objectPayload[key] === "object") {
        const nested = findPassToken(objectPayload[key]);
        if (nested !== "UNKNOWN") {
          return nested;
        }
      }
    }
  }

  for (const value of Object.values(objectPayload)) {
    const nested = findPassToken(value);
    if (nested !== "UNKNOWN") {
      return nested;
    }
  }

  return "UNKNOWN";
}

function getOverallStatus(payload: unknown): CanonicalStatus {
  if (!payload || typeof payload !== "object") {
    return "UNKNOWN";
  }

  const objectPayload = payload as Record<string, unknown>;
  const candidates = ["pass_verification", "passVerification"];

  for (const candidate of candidates) {
    const value = objectPayload[candidate];
    if (!value || typeof value !== "object") {
      continue;
    }
    const nested = value as Record<string, unknown>;
    const overall = normalizePassFail(nested.overall);
    if (overall !== "UNKNOWN") {
      return overall;
    }
  }

  return findPassToken(payload);
}

function questionSubset(allQ: Record<string, unknown>, qids: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const qid of qids) {
    if (qid in allQ) {
      out[qid] = allQ[qid];
    }
  }
  return out;
}

function enhancementState(value: unknown): string {
  const yn = normalizeYesNo(value);
  if (yn === "YES") {
    return "PRESENT";
  }
  if (yn === "NO") {
    return "ABSENT";
  }
  return "UNKNOWN";
}

function isPass(status: CanonicalStatus): boolean {
  return status === "PASS" || status === "PASS-PROVISIONAL";
}

function classifyScheme(
  t1: CanonicalStatus,
  t2: CanonicalStatus,
  t3: CanonicalStatus,
  t4: CanonicalStatus,
  enhancementStates: Record<string, string>
): { value: CanonicalScheme["classification"]["value"]; reasoning: string[] } {
  const reasoning: string[] = [];
  const tests = [t1, t2, t3, t4];
  const passed = tests.filter(isPass).length;
  const absentEnhancements = Object.values(enhancementStates).filter((value) => value === "ABSENT").length;

  reasoning.push(`Passed tests: ${passed}/4`);
  reasoning.push(`Absent enhancements: ${absentEnhancements}`);

  if (passed === 4 && absentEnhancements <= 1) {
    reasoning.push("All tests pass with at most one enhancement gap.");
    return { value: "SOC", reasoning };
  }

  if (passed === 4 && absentEnhancements >= 2) {
    reasoning.push("All tests pass but governance enhancements show multiple gaps.");
    return { value: "SOC with Governance Gaps", reasoning };
  }

  if (passed === 3 && !isPass(t4)) {
    reasoning.push("Exactly three tests pass and T4 fails.");
    return { value: "Near-SOC (Structural)", reasoning };
  }

  if (passed === 3 && (!isPass(t1) || !isPass(t2) || !isPass(t3))) {
    reasoning.push("Exactly three tests pass and one of T1/T2/T3 fails.");
    return { value: "Near-SOC (Operational)", reasoning };
  }

  if (passed <= 2) {
    reasoning.push("Two or fewer tests pass.");
    return { value: "Adjacent / Non-SOC", reasoning };
  }

  reasoning.push("Insufficiently reliable status information.");
  return { value: "Unknown", reasoning };
}

async function safeReadJson(filePath: string): Promise<unknown> {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function safeReadText(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function deriveUpgradePathway(failMap: { t1: boolean; t2: boolean; t3: boolean; t4: boolean }): string[] {
  const steps: string[] = [];

  if (failMap.t1) {
    steps.push("Define commons boundary and legal access rights before implementation cycles.");
  }
  if (failMap.t2) {
    steps.push("Raise local and marginalized beneficiary share with explicit inclusion rules.");
  }
  if (failMap.t3) {
    steps.push("Set measurable livelihood outcomes and guaranteed offtake pathways.");
  }
  if (failMap.t4) {
    steps.push("Add enforceable replenishment and monitoring mechanisms to lock sustainability.");
  }

  if (steps.length === 0) {
    steps.push("Preserve existing safeguards and close remaining governance enhancement gaps.");
  }

  return steps;
}

async function parseSingleSchemeFolder(schemeFolderPath: string): Promise<CanonicalScheme | null> {
  const folderName = path.basename(schemeFolderPath);
  const departmentFolderName = path.basename(path.dirname(schemeFolderPath));

  const programsPath = path.join(schemeFolderPath, FILES.programs);
  const t1Path = path.join(schemeFolderPath, FILES.t1);
  const t2Path = path.join(schemeFolderPath, FILES.t2);
  const t3Path = path.join(schemeFolderPath, FILES.t3);
  const t4aPath = path.join(schemeFolderPath, FILES.t4a);
  const t4bPath = path.join(schemeFolderPath, FILES.t4b);

  const [programsMd, t1Raw, t2Raw, t3Raw, t4aRaw, t4bRaw] = await Promise.all([
    safeReadText(programsPath),
    safeReadJson(t1Path),
    safeReadJson(t2Path),
    safeReadJson(t3Path),
    safeReadJson(t4aPath),
    safeReadJson(t4bPath),
  ]);

  const t1Q = collectQuestionValues(t1Raw);
  const t2Q = collectQuestionValues(t2Raw);
  const t3Q = collectQuestionValues(t3Raw);
  const t4aQ = collectQuestionValues(t4aRaw);
  const t4bQ = collectQuestionValues(t4bRaw);

  const allAnswersByQid = {
    ...t1Q,
    ...t2Q,
    ...t3Q,
    ...t4aQ,
    ...t4bQ,
  };

  const schemeName = toCleanString(allAnswersByQid.Q1) || folderName;
  const departmentName = normalizeDepartmentName(toCleanString(allAnswersByQid.Q2), departmentFolderName);
  const departmentSlug = slugify(departmentName);

  const t1Status = getOverallStatus(t1Raw);
  const t2Status = getOverallStatus(t2Raw);
  const t3Status = getOverallStatus(t3Raw);
  const t4aStatus = getOverallStatus(t4aRaw);
  const t4bStatus = getOverallStatus(t4bRaw);

  const t4Status =
    t4aStatus === "UNKNOWN" && t4bStatus === "UNKNOWN"
      ? "UNKNOWN"
      : [t4aStatus, t4bStatus].includes("FAIL")
      ? "FAIL"
      : [t4aStatus, t4bStatus].includes("PASS") || [t4aStatus, t4bStatus].includes("PASS-PROVISIONAL")
      ? "PASS"
      : "UNKNOWN";

  const enhancementStates = {
    "T1.5": enhancementState(allAnswersByQid.Q14),
    "T2.4": enhancementState(allAnswersByQid.Q23),
    "T2.5": enhancementState(allAnswersByQid.Q24),
    "T3.5": enhancementState(allAnswersByQid.Q29),
    "T4.6": enhancementState(allAnswersByQid.Q38),
  };

  const classification = classifyScheme(t1Status, t2Status, t3Status, t4Status, enhancementStates);

  const t1Unverified = Array.isArray((t1Raw as Record<string, unknown> | null)?.unverified_fields)
    ? ((t1Raw as Record<string, unknown>).unverified_fields as string[])
    : [];
  const t2Unverified = Array.isArray((t2Raw as Record<string, unknown> | null)?.unverified_fields)
    ? ((t2Raw as Record<string, unknown>).unverified_fields as string[])
    : [];
  const t3Unverified = Array.isArray((t3Raw as Record<string, unknown> | null)?.unverified_fields)
    ? ((t3Raw as Record<string, unknown>).unverified_fields as string[])
    : [];
  const t4Unverified = [
    ...(
      Array.isArray((t4aRaw as Record<string, unknown> | null)?.unverified_fields)
        ? ((t4aRaw as Record<string, unknown>).unverified_fields as string[])
        : []
    ),
    ...(
      Array.isArray((t4bRaw as Record<string, unknown> | null)?.unverified_fields)
        ? ((t4bRaw as Record<string, unknown>).unverified_fields as string[])
        : []
    ),
  ];

  const failMap = {
    t1: !isPass(t1Status),
    t2: !isPass(t2Status),
    t3: !isPass(t3Status),
    t4: !isPass(t4Status),
  };

  const governanceFlags = Object.entries(enhancementStates)
    .filter(([, state]) => state === "ABSENT")
    .map(([key]) => key);

  const objectiveText = toCleanString(allAnswersByQid.Q5) || null;
  const q26 = (allAnswersByQid.Q26 ?? null) as unknown;
  const q26Number = toNumber(q26);

  return {
    schemeId: slugify(`${departmentSlug}-${schemeName}`),
    schemeName,
    departmentName,
    departmentSlug,
    auditDate: null,
    sources: {
      folderPath: schemeFolderPath,
      files: FILES,
    },
    classification: {
      value: classification.value,
      derived: true,
      reasoning: classification.reasoning,
    },
    tests: {
      t1: {
        status: t1Status,
        criteria: { C1_T1: String(t1Status) },
        enhancements: { "T1.5": enhancementStates["T1.5"] },
        questionValues: questionSubset(t1Q, [
          "Q1",
          "Q2",
          "Q3",
          "Q4",
          "Q5",
          "Q6",
          "Q7",
          "Q8",
          "Q9",
          "Q10",
          "Q11",
          "Q12",
          "Q13",
          "Q14",
        ]),
        unverifiedFields: t1Unverified,
      },
      t2: {
        status: t2Status,
        criteria: { C1_T2: String(t2Status) },
        enhancements: {
          "T2.4": enhancementStates["T2.4"],
          "T2.5": enhancementStates["T2.5"],
        },
        questionValues: questionSubset(t2Q, [
          "Q15",
          "Q16",
          "Q17",
          "Q18",
          "Q19",
          "Q20",
          "Q21",
          "Q22",
          "Q23",
          "Q24",
        ]),
        unverifiedFields: t2Unverified,
      },
      t3: {
        status: t3Status,
        criteria: { C1_T3: String(t3Status) },
        enhancements: { "T3.5": enhancementStates["T3.5"] },
        questionValues: questionSubset(t3Q, ["Q25", "Q26", "Q27", "Q28", "Q29"]),
        unverifiedFields: t3Unverified,
      },
      t4: {
        status: t4Status,
        criteria: {
          C1_T4a: String(t4aStatus),
          C2_T4b: String(t4bStatus),
        },
        enhancements: { "T4.6": enhancementStates["T4.6"] },
        questionValues: questionSubset({ ...t4aQ, ...t4bQ }, ["Q30", "Q31", "Q32", "Q33", "Q34", "Q35", "Q36", "Q37", "Q38"]),
        unverifiedFields: Array.from(new Set(t4Unverified)),
      },
    },
    governanceFlags,
    objectiveText,
    narrative: {
      budget: typeof allAnswersByQid.Q3 === "string" ? allAnswersByQid.Q3 : null,
      survey: q26Number === null ? null : `Delta Y candidate: ${q26Number}`,
      outcome: null,
      announcement: null,
      cag: null,
      portal: null,
    },
    raw: {
      programsMd,
      t1: t1Raw,
      t2: t2Raw,
      t3: t3Raw,
      t4a: t4aRaw,
      t4b: t4bRaw,
      allAnswersByQid,
    },
    extensions: {},
    upgradePathway: deriveUpgradePathway(failMap),
  };
}

async function looksLikeSchemeFolder(folderPath: string): Promise<boolean> {
  try {
    const names = new Set(await fs.readdir(folderPath));
    const hasPrograms = names.has(FILES.programs);
    const hasAnyTest = [FILES.t1, FILES.t2, FILES.t3, FILES.t4a, FILES.t4b].some((name) => names.has(name));
    return hasPrograms || hasAnyTest;
  } catch {
    return false;
  }
}

async function findSchemeFolders(rootDir: string): Promise<string[]> {
  const stack = [rootDir];
  const found: string[] = [];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }

    if (await looksLikeSchemeFolder(current)) {
      found.push(current);
      continue;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        stack.push(path.join(current, entry.name));
      }
    }
  }

  return found;
}

export async function buildCanonicalDatasetFromRoot(rootDir: string): Promise<BuildDatasetResult> {
  const schemeFolders = await findSchemeFolders(rootDir);

  const parsedSchemes = await Promise.all(schemeFolders.map(parseSingleSchemeFolder));
  const schemes = parsedSchemes.filter((scheme): scheme is CanonicalScheme => Boolean(scheme));

  const grouped = new Map<string, CanonicalScheme[]>();
  for (const scheme of schemes) {
    const existing = grouped.get(scheme.departmentSlug);
    if (existing) {
      existing.push(scheme);
    } else {
      grouped.set(scheme.departmentSlug, [scheme]);
    }
  }

  const departments: DepartmentAggregate[] = Array.from(grouped.entries()).map(([departmentSlug, deptSchemes]) => {
    const counts: DepartmentAggregate["classificationCounts"] = {
      SOC: 0,
      "SOC with Governance Gaps": 0,
      "Near-SOC (Operational)": 0,
      "Near-SOC (Structural)": 0,
      "Adjacent / Non-SOC": 0,
      Unknown: 0,
    };

    const testPassCounts: DepartmentAggregate["testPassCounts"] = {
      t1Pass: 0,
      t2Pass: 0,
      t3Pass: 0,
      t4Pass: 0,
    };

    const enhancementAbsenceCounts: DepartmentAggregate["enhancementAbsenceCounts"] = {
      "T1.5": 0,
      "T2.4": 0,
      "T2.5": 0,
      "T3.5": 0,
      "T4.6": 0,
    };

    let unverifiedSchemeCount = 0;
    const failureFrequency = new Map<string, number>();

    for (const scheme of deptSchemes) {
      counts[scheme.classification.value] += 1;

      if (isPass(scheme.tests.t1.status)) testPassCounts.t1Pass += 1;
      if (isPass(scheme.tests.t2.status)) testPassCounts.t2Pass += 1;
      if (isPass(scheme.tests.t3.status)) testPassCounts.t3Pass += 1;
      if (isPass(scheme.tests.t4.status)) testPassCounts.t4Pass += 1;

      for (const key of Object.keys(enhancementAbsenceCounts) as Array<keyof DepartmentAggregate["enhancementAbsenceCounts"]>) {
        if (
          scheme.tests.t1.enhancements[key] === "ABSENT" ||
          scheme.tests.t2.enhancements[key] === "ABSENT" ||
          scheme.tests.t3.enhancements[key] === "ABSENT" ||
          scheme.tests.t4.enhancements[key] === "ABSENT"
        ) {
          enhancementAbsenceCounts[key] += 1;
        }
      }

      const hasUnverified =
        scheme.tests.t1.unverifiedFields.length > 0 ||
        scheme.tests.t2.unverifiedFields.length > 0 ||
        scheme.tests.t3.unverifiedFields.length > 0 ||
        scheme.tests.t4.unverifiedFields.length > 0;

      if (hasUnverified) {
        unverifiedSchemeCount += 1;
      }

      for (const flag of scheme.governanceFlags) {
        failureFrequency.set(flag, (failureFrequency.get(flag) || 0) + 1);
      }
    }

    const sortedFailures = Array.from(failureFrequency.entries()).sort((a, b) => b[1] - a[1]);

    return {
      departmentSlug,
      departmentName: deptSchemes[0]?.departmentName || departmentSlug,
      totalSchemes: deptSchemes.length,
      classificationCounts: counts,
      testPassCounts,
      enhancementAbsenceCounts,
      unverifiedSchemeCount,
      dominantFindings: {
        topFailurePattern: sortedFailures[0]?.[0] || null,
        topUpgradeLever: sortedFailures[1]?.[0] || sortedFailures[0]?.[0] || null,
      },
      schemeIds: deptSchemes.map((scheme) => scheme.schemeId),
    };
  });

  return {
    schemes: schemes.sort((a, b) => a.schemeName.localeCompare(b.schemeName)),
    departments: departments.sort((a, b) => a.departmentName.localeCompare(b.departmentName)),
  };
}
