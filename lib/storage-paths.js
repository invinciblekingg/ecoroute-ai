import os from "os";
import path from "path";

const bundledDataDir = path.join(process.cwd(), "data");
const configuredDataDir = process.env.ECOROUTE_DATA_DIR?.trim();
const runtimeDataDir =
  configuredDataDir || (process.env.VERCEL ? path.join(os.tmpdir(), "ecoroute-ai") : bundledDataDir);

export function getBundledDataDir() {
  return bundledDataDir;
}

export function getRuntimeDataDir() {
  return runtimeDataDir;
}

export function getStateFilePaths() {
  return {
    runtime: path.join(runtimeDataDir, "ecoroute-state.json"),
    bundled: path.join(bundledDataDir, "ecoroute-state.json"),
  };
}

export function getUploadsDir() {
  return path.join(runtimeDataDir, "uploads");
}

export function getBundledUploadsDir() {
  return path.join(bundledDataDir, "uploads");
}
