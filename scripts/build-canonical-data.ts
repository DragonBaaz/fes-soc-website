import { promises as fs } from "node:fs";
import path from "node:path";
import { buildCanonicalDatasetFromRoot } from "../lib/soc-parser";

function argValue(args: string[], key: string): string | null {
  const flag = `--${key}`;
  const index = args.findIndex((arg) => arg === flag);
  if (index === -1 || index + 1 >= args.length) {
    return null;
  }
  return args[index + 1] || null;
}

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

async function main() {
  const args = process.argv.slice(2);
  const root = process.cwd();

  const inputRoot = argValue(args, "input") || path.join(root, "data", "raw-soc");
  const outputRoot = argValue(args, "output") || path.join(root, "data", "generated");

  const dataset = await buildCanonicalDatasetFromRoot(inputRoot);
  await ensureDir(outputRoot);

  const now = new Date().toISOString();

  const schemesOutputPath = path.join(outputRoot, "canonical-schemes.json");
  const departmentsOutputPath = path.join(outputRoot, "department-aggregates.json");

  await fs.writeFile(
    schemesOutputPath,
    JSON.stringify(
      {
        schemaVersion: "1.0.0",
        generatedAt: now,
        sourceRoot: inputRoot,
        schemes: dataset.schemes,
      },
      null,
      2
    )
  );

  await fs.writeFile(
    departmentsOutputPath,
    JSON.stringify(
      {
        schemaVersion: "1.0.0",
        generatedAt: now,
        sourceRoot: inputRoot,
        departments: dataset.departments,
      },
      null,
      2
    )
  );

  console.log(`Generated ${dataset.schemes.length} canonical schemes.`);
  console.log(`Generated ${dataset.departments.length} department aggregates.`);
  console.log(`Wrote: ${schemesOutputPath}`);
  console.log(`Wrote: ${departmentsOutputPath}`);
}

main().catch((error) => {
  console.error("Failed to build canonical dataset.");
  console.error(error);
  process.exit(1);
});
