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

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

async function listDirectories(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function isCompleteSchemeFolder(folderPath: string): Promise<boolean> {
  const requiredFiles = [
    "programs.md",
    "t1_output.json",
    "t2_output.json",
    "t3_output.json",
    "t4a_output.json",
    "t4b_output.json",
  ];

  const checks = await Promise.all(requiredFiles.map((fileName) => exists(path.join(folderPath, fileName))));
  return checks.every(Boolean);
}

async function copySchemeFolder(sourceFolder: string, targetFolder: string): Promise<void> {
  await ensureDir(path.dirname(targetFolder));
  await fs.cp(sourceFolder, targetFolder, { recursive: true, force: true });
}

async function main() {
  const args = process.argv.slice(2);
  const root = process.cwd();

  const sourceRoot = argValue(args, "source");
  if (!sourceRoot) {
    throw new Error("Missing --source argument. Example: pnpm inject:data --source C:/path/to/soc/departments");
  }

  const rawTargetRoot = argValue(args, "rawTarget") || path.join(root, "data", "raw-soc");
  const generatedTargetRoot = argValue(args, "generatedTarget") || path.join(root, "data", "generated");

  if (!(await exists(sourceRoot))) {
    throw new Error(`Source path does not exist: ${sourceRoot}`);
  }

  await ensureDir(rawTargetRoot);
  await ensureDir(generatedTargetRoot);

  const departmentDirs = await listDirectories(sourceRoot);
  let copiedSchemeCount = 0;
  let skippedSchemeCount = 0;

  for (const departmentDir of departmentDirs) {
    const sourceDepartmentPath = path.join(sourceRoot, departmentDir);
    const schemeDirs = await listDirectories(sourceDepartmentPath);

    for (const schemeDir of schemeDirs) {
      const sourceSchemePath = path.join(sourceDepartmentPath, schemeDir);
      const isComplete = await isCompleteSchemeFolder(sourceSchemePath);

      if (!isComplete) {
        skippedSchemeCount += 1;
        continue;
      }

      const targetSchemePath = path.join(rawTargetRoot, departmentDir, schemeDir);
      await copySchemeFolder(sourceSchemePath, targetSchemePath);
      copiedSchemeCount += 1;
    }
  }

  const dataset = await buildCanonicalDatasetFromRoot(rawTargetRoot);
  const generatedAt = new Date().toISOString();

  await fs.writeFile(
    path.join(generatedTargetRoot, "canonical-schemes.json"),
    JSON.stringify(
      {
        schemaVersion: "1.0.0",
        generatedAt,
        sourceRoot,
        copiedSchemeCount,
        skippedSchemeCount,
        schemes: dataset.schemes,
      },
      null,
      2
    )
  );

  await fs.writeFile(
    path.join(generatedTargetRoot, "department-aggregates.json"),
    JSON.stringify(
      {
        schemaVersion: "1.0.0",
        generatedAt,
        sourceRoot,
        copiedSchemeCount,
        skippedSchemeCount,
        departments: dataset.departments,
      },
      null,
      2
    )
  );

  console.log(`Injected ${copiedSchemeCount} complete scheme folders from source.`);
  console.log(`Skipped ${skippedSchemeCount} incomplete scheme folders.`);
  console.log(`Generated ${dataset.schemes.length} canonical schemes.`);
  console.log(`Generated ${dataset.departments.length} department aggregates.`);
}

main().catch((error) => {
  console.error("SOC data injection failed.");
  console.error(error);
  process.exit(1);
});
