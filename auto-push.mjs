import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GIT_BIN = `C:\\Users\\garvs\\MinGit\\cmd\\git.exe`;
const DEBOUNCE_MS = 4000; // Wait 4s after last file edit before pushing

let pushTimeout = null;
let isPushing = false;

function runGitPush() {
  if (isPushing) return;
  isPushing = true;

  console.log('\n[Auto-Push] 🔄 File change detected! Preparing automatic push to GitHub...');

  const timestamp = new Date().toLocaleString();
  const commitMsg = `auto: website update (${timestamp})`;

  const cmd = `"${GIT_BIN}" add . && "${GIT_BIN}" commit -m "${commitMsg}" && "${GIT_BIN}" push origin main`;

  exec(cmd, { cwd: __dirname }, (error, stdout, stderr) => {
    isPushing = false;
    if (error) {
      if ((stdout && stdout.includes('nothing to commit')) || (stderr && stderr.includes('nothing to commit'))) {
        console.log('[Auto-Push] ℹ️ Working tree clean. No new changes to push.');
      } else {
        console.log('[Auto-Push] ℹ️ Git Status output:', stdout || stderr || error.message);
      }
      return;
    }
    console.log(`[Auto-Push] ✅ Successfully pushed code changes to GitHub repository at ${timestamp}!`);
  });
}

function handleFileChange(eventType, filename) {
  if (!filename) return;
  // Ignore node_modules, git, dist, logs, temp files
  if (
    filename.includes('node_modules') ||
    filename.includes('.git') ||
    filename.includes('dist') ||
    filename.includes('.system_generated') ||
    filename.endsWith('.log') ||
    filename.endsWith('.tmp')
  ) {
    return;
  }

  console.log(`[Auto-Push] 📝 File modified: ${filename}`);
  if (pushTimeout) clearTimeout(pushTimeout);
  pushTimeout = setTimeout(() => {
    runGitPush();
  }, DEBOUNCE_MS);
}

console.log('🚀 [Auto-Push Service] Active & watching src/ and public/ for edits...');

const watchDirs = ['src', 'public'];
watchDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    fs.watch(fullPath, { recursive: true }, handleFileChange);
  }
});

if (fs.existsSync(path.join(__dirname, 'index.html'))) {
  fs.watch(path.join(__dirname, 'index.html'), handleFileChange);
}
