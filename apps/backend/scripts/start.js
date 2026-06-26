// Cross-platform start runner.
// On Windows, go build produces bin/server.exe — not bin/server.
// This script picks the correct binary name per OS.

const { spawn } = require("child_process");
const path = require("path");

const binary =
  process.platform === "win32"
    ? path.join(".", "bin", "server.exe")
    : path.join(".", "bin", "server");

console.log(`[backend:start] running ${binary}`);

const child = spawn(binary, [], {
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code) => process.exit(code ?? 0));
