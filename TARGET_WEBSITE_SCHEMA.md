# Target Data Schema for New Website

This schema is designed for the SOC audit folder pattern:

- `programs.md`
- `t1_output.json`
- `t2_output.json`
- `t3_output.json`
- `t4a_output.json`
- `t4b_output.json`

It is strict at top-level contract, but tolerant at field-level so inconsistent survey outputs are not dropped.

## 1) Canonical Scheme Object

```json
{
  "schemeId": "string (slug, stable)",
  "schemeName": "string",
  "departmentName": "string",
  "departmentSlug": "string",
  "auditDate": "YYYY-MM-DD | null",
  "sources": {
    "folderPath": "string",
    "files": {
      "programs": "programs.md",
      "t1": "t1_output.json",
      "t2": "t2_output.json",
      "t3": "t3_output.json",
      "t4a": "t4a_output.json",
      "t4b": "t4b_output.json"
    }
  },
  "classification": {
    "value": "SOC | SOC with Governance Gaps | Near-SOC (Operational) | Near-SOC (Structural) | Adjacent / Non-SOC | Unknown",
    "derived": true,
    "reasoning": ["string"]
  },
  "tests": {
    "t1": {
      "status": "PASS | FAIL | PASS-PROVISIONAL | UNKNOWN",
      "criteria": { "C1_T1.1": "PASS|FAIL|...", "C2_T1.2": "...", "C3_theta1": "...", "C4_T1.4": "...", "C5_T1.6": "..." },
      "enhancements": { "T1.5": "PRESENT|ABSENT|UNKNOWN" },
      "questionValues": {},
      "unverifiedFields": ["Qxx"]
    },
    "t2": {
      "status": "PASS | FAIL | PASS-PROVISIONAL | UNKNOWN",
      "criteria": { "C1_theta2": "...", "C2_theta3": "...", "C3_T2.3": "..." },
      "enhancements": { "T2.4": "PRESENT|ABSENT|UNKNOWN", "T2.5": "PRESENT|ABSENT|UNKNOWN" },
      "questionValues": {},
      "unverifiedFields": ["Qxx"]
    },
    "t3": {
      "status": "PASS | FAIL | PASS-PROVISIONAL | UNKNOWN",
      "criteria": { "C1_T3.1": "...", "C2_deltaY": "...", "C3_T3.3": "...", "C4_T3.4": "..." },
      "enhancements": { "T3.5": "PRESENT|ABSENT|UNKNOWN" },
      "deltaY": {
        "observed": { "value": "number|null", "interp": "string|null", "source": "string|null" },
        "projected": { "value": "number|null", "interp": "string|null", "source": "string|null" },
        "governing": "Observed | Projected-Provisional | Unknown"
      },
      "questionValues": {},
      "unverifiedFields": ["Qxx"]
    },
    "t4": {
      "status": "PASS | FAIL | PASS-PROVISIONAL | UNKNOWN",
      "criteria": {
        "C1_T4.1": "...",
        "C2_rho_or_VI": "...",
        "C3_T4.3": "...",
        "C4_T4.4_or_T4.5": "..."
      },
      "enhancements": { "T4.6": "PRESENT|ABSENT|UNKNOWN" },
      "climateConditional": { "triggered": "YES|NO|UNKNOWN", "requiredT43Threshold": "1|2|null" },
      "track": { "type": "RhoRatio | VitalityIndex | Unknown", "value": "number|null", "estimated": "boolean|null" },
      "questionValues": {},
      "unverifiedFields": ["Qxx"]
    }
  },
  "governanceFlags": ["string"],
  "objectiveText": "string|null",
  "narrative": {
    "budget": "string|null",
    "survey": "string|null",
    "outcome": "string|null",
    "announcement": "string|null",
    "cag": "string|null",
    "portal": "string|null"
  },
  "raw": {
    "programsMd": "string",
    "t1": {},
    "t2": {},
    "t3": {},
    "t4a": {},
    "t4b": {},
    "allAnswersByQid": {}
  },
  "extensions": {}
}
```

## 2) Canonical Department Aggregate

```json
{
  "departmentSlug": "string",
  "departmentName": "string",
  "totalSchemes": 0,
  "classificationCounts": {
    "SOC": 0,
    "SOC with Governance Gaps": 0,
    "Near-SOC (Operational)": 0,
    "Near-SOC (Structural)": 0,
    "Adjacent / Non-SOC": 0,
    "Unknown": 0
  },
  "testPassCounts": {
    "t1Pass": 0,
    "t2Pass": 0,
    "t3Pass": 0,
    "t4Pass": 0
  },
  "enhancementAbsenceCounts": {
    "T1.5": 0,
    "T2.4": 0,
    "T2.5": 0,
    "T3.5": 0,
    "T4.6": 0
  },
  "unverifiedSchemeCount": 0,
  "dominantFindings": {
    "topFailurePattern": "string|null",
    "topUpgradeLever": "string|null"
  },
  "schemeIds": ["string"]
}
```

## 3) Tolerant Parsing Rules (Do Not Lose Data)

1. Keep all unknown keys in `extensions` and `raw`.
2. Ingest answers by QID key, never array position.
3. Accept variant field presence (`v`, `r`, `src`, `calc`, `interp`, `docs`, nested `observed/projected`).
4. If numeric values are embedded in strings, parse best-effort and store original in `raw`.
5. If pass verification text is verbose (not only PASS/FAIL), normalize status and preserve full text.
6. If one test file is missing, mark that test `UNKNOWN`, do not drop scheme.
7. If `department` text differs across files, choose majority or folder-derived value and store all variants in `extensions.departmentVariants`.
8. If `unverified_fields` exists, propagate to `tests.*.unverifiedFields` and `unverifiedSchemeCount`.
9. If T4a has no pass block (observed in samples), combine T4 from T4a + T4b by rule.
10. If classification cannot be derived safely, set `classification.value = "Unknown"` and keep reasoning.

## 4) Classification Derivation Logic

1. Resolve `t1..t4` statuses from pass blocks.
2. Count passed tests.
3. Enhancement absence set = `{T1.5, T2.4, T2.5, T3.5, T4.6}` where value is absent/no/0/flagged.
4. Apply framework:
   - 4 pass + <=1 absence -> `SOC`
   - 4 pass + >=2 absence -> `SOC with Governance Gaps`
   - 3 pass + T4 fail -> `Near-SOC (Structural)`
   - 3 pass + (T1 or T2 or T3 fail) -> `Near-SOC (Operational)`
   - <=2 pass -> `Adjacent / Non-SOC`

## 5) Q1..Q38 Mapping Table

This mapping is ingest-focused and tolerant. Fields are mapped even when values are unverified or inferred.

| QID | Test File | Canonical Path | Expected Pattern |
|---|---|---|---|
| Q1 | t1 | schemeName | string |
| Q2 | t1 | departmentName (variant source) | string |
| Q3 | t1 | sources.summary.t1 | string |
| Q4 | t1 | tests.t1.questionValues.Q4 (T1.1 category) | A1/A2/B/C/D/E |
| Q5 | t1 | objectiveText or narrative.resourceDescription | string |
| Q6 | t1 | tests.t1.questionValues.Q6 | yes/no |
| Q7 | t1 | tests.t1.questionValues.Q7 (T1.2) | 0/1/2 |
| Q8 | t1 | tests.t1.questionValues.Q8 | yes/no |
| Q9 | t1 | tests.t1.questionValues.Q9 | number+unit+period |
| Q10 | t1 | tests.t1.questionValues.Q10 | number |
| Q11 | t1 | tests.t1.questionValues.Q11 | number |
| Q12 | t1 | tests.t1.questionValues.Q12 (theta1 calc/interp) | value+calc+interp |
| Q13 | t1 | tests.t1.questionValues.Q13 | docs[] |
| Q14 | t1 | tests.t1.questionValues.Q14 (T1.4 score) | 0/1/2 |
| Q15 | t2 | tests.t2.questionValues.Q15 | number |
| Q16 | t2 | tests.t2.questionValues.Q16 | number |
| Q17 | t2 | tests.t2.questionValues.Q17 (local definition) | settled/pastoral/mobile |
| Q18 | t2 | tests.t2.questionValues.Q18 (theta2 calc/interp) | value+calc+interp |
| Q19 | t2 | tests.t2.questionValues.Q19 (marginalized details) | value/rationale/unverified text |
| Q20 | t2 | tests.t2.questionValues.Q20 (theta3 calc/interp) | value+calc+interp |
| Q21 | t2 | tests.t2.questionValues.Q21 | value or SKIP |
| Q22 | t2 | tests.t2.questionValues.Q22 | subfields docs/source |
| Q23 | t2 | tests.t2.questionValues.Q23 (T2.4) | yes/no |
| Q24 | t2 | tests.t2.questionValues.Q24 (T2.5) | yes/no |
| Q25 | t3 | tests.t3.questionValues.Q25 (T3.1) | yes/no |
| Q26 | t3 | tests.t3.deltaY + questionValues.Q26 | observed/projected/governing |
| Q27 | t3 | tests.t3.questionValues.Q27 (T3.3) | 0..3 |
| Q28 | t3 | tests.t3.questionValues.Q28 (T3.4) | yes/no |
| Q29 | t3 | tests.t3.questionValues.Q29 (T3.5 enhancement) | yes/no |
| Q30 | t4a | tests.t4.questionValues.Q30 (T4.1) | yes/no |
| Q31 | t4a | tests.t4.track.type | RhoRatio/VitalityIndex |
| Q32 | t4a | tests.t4.track.value + notes | rho/VI value + interp |
| Q33 | t4a | tests.t4.questionValues.Q33 | VI components or SKIP |
| Q34 | t4b | tests.t4.questionValues.Q34 (T4.3 score) | 0..3 |
| Q35 | t4b | tests.t4.climateConditional.triggered | yes/no |
| Q36 | t4b | tests.t4.questionValues.Q36 (T4.4) | yes/no |
| Q37 | t4b | tests.t4.questionValues.Q37 (T4.5) | yes/no |
| Q38 | t4b | tests.t4.questionValues.Q38 (T4.6 enhancement) | yes/no |

Note: Q34/Q35 ordering may vary in source JSON. Parser must read by key name.

## 6) Required vs Optional for Ingest

Required to create a scheme row:

- scheme name (from Q1 or folder)
- department (from folder or Q2)
- at least one test file present

Optional but preserved:

- any missing QIDs
- all rationale/source text
- inferred/unverified values
- additional custom keys from future survey variants

## 7) Storage Recommendation

Use two persisted artifacts:

1. `canonical-schemes.json` (array of canonical scheme objects)
2. `department-aggregates.json` (array of department aggregates)

Both should be generated, not manually edited.