// Cross-platform build runner for the Go backend.
// Same GOCACHE fix as dev.js — go build needs it too.

const { spawn } = require("child_process");
const os = require("os");
const path = require("path");

function resolveGoCache() {
  switch (process.platform) {
    case "win32": {
      const localAppData =
        process.env.LOCALAPPDATA ||
        path.join(os.homedir(), "AppData", "Local");
      return path.join(localAppData, "go-build");
    }
    case "darwin": {
      return path.join(os.homedir(), "Library", "Caches", "go-build");
    }
    default: {
      const xdgCache =
        process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache");
      return path.join(xdgCache, "go", "build");
    }
  }
}

const binary =
  process.platform === "win32"
    ? path.join(".", "bin", "server.exe")
    : path.join(".", "bin", "server");

const goCache = resolveGoCache();

console.log(`[backend:build] GOCACHE → ${goCache}`);
console.log(`[backend:build] output  → ${binary}`);

const child = spawn(
  "go",
  ["build", "-o", binary, "./cmd/server"],
  {
    env: { ...process.env, GOCACHE: goCache },
    stdio: "inherit",
    shell: process.platform === "win32",
  }
);

child.on("exit", (code) => process.exit(code ?? 0));
