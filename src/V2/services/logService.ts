import path from "path";
import fs from "fs";

const LOG_DIR = path.join(process.cwd(), "logs");
const ACTION_LOG = path.join(LOG_DIR, "actions.log");
const ERR_LOG = path.join(LOG_DIR, "error.log");
const WARN_LOG = path.join(LOG_DIR, "warnings.log");

function readLastLine(filePath: string): string | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");
    return lines.pop() || null;
  } catch (error) {
    console.error("Probleme de lecture :", error);
    return null;
  }
}

export function getLastLog() {
  return {
    action: readLastLine(ACTION_LOG),
    error: readLastLine(ERR_LOG),
    warning: readLastLine(WARN_LOG),
  };
}
