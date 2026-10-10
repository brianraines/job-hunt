// Repository checks for the job-hunt skill: valid frontmatter, existing referenced files,
// no private data paths, and no maintainer personal data (deny-list supplied by CI secret).
import { readFile, readdir, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Minimal YAML subset used by skill frontmatter: top-level "key: value" pairs and one level of
// indented "key: value" pairs under a key with no value.
export function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text);
  if (!match) return null;
  const result = {};
  let parent = null;
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const nested = /^\s+([\w-]+):\s*(.*)$/.exec(line);
    const top = /^([\w-]+):\s*(.*)$/.exec(line);
    if (nested && parent) {
      result[parent][nested[1]] = unquote(nested[2]);
    } else if (top) {
      if (top[2] === '') {
        parent = top[1];
        result[parent] = {};
      } else {
        parent = null;
        result[top[1]] = unquote(top[2]);
      }
    }
  }
  return result;
}

function unquote(value) {
  const trimmed = value.trim();
  return /^(['"]).*\1$/.test(trimmed) ? trimmed.slice(1, -1) : trimmed;
}

export function checkFrontmatter(text, directoryName) {
  const fm = parseFrontmatter(text);
  if (!fm) return ['SKILL.md has no frontmatter block'];
  const problems = [];
  if (!fm.name) {
    problems.push('name is required');
  } else {
    if (!NAME_PATTERN.test(fm.name)) problems.push(`name "${fm.name}" must use lowercase letters, digits and hyphens`);
    if (fm.name !== directoryName) problems.push(`name "${fm.name}" must match its directory "${directoryName}"`);
  }
  if (!fm.description) {
    problems.push('description is required');
  } else if (fm.description.length > 1024) {
    problems.push(`description is ${fm.description.length} characters; the limit is 1024`);
  }
  return problems;
}

// Paths to bundled files, written as `references/x.md` or [text](templates/x.md).
export function findReferences(text) {
  const found = new Set();
  for (const match of text.matchAll(/(?:`|\]\()((?:references|templates)\/[\w./-]+)(?:`|\))/g)) {
    found.add(match[1]);
  }
  return [...found];
}

export function findForbiddenPaths(trackedPaths) {
  return trackedPaths.filter((path) => /(^|\/)docs\/job_hunt\//.test(path));
}

export function findDenylisted(files, values) {
  const terms = values.map((value) => value.trim().toLowerCase()).filter(Boolean);
  const problems = [];
  for (const { path, text } of files) {
    text.split(/\r?\n/).forEach((line, index) => {
      const lower = line.toLowerCase();
      terms.forEach((term, termIndex) => {
        if (lower.includes(term)) problems.push(`${path}:${index + 1} contains deny-listed value #${termIndex + 1}`);
      });
    });
  }
  return problems;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const problems = [];

  const skillsDir = join(root, 'skills');
  for (const entry of await readdir(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillDir = join(skillsDir, entry.name);
    const skillFile = join(skillDir, 'SKILL.md');
    if (!(await exists(skillFile))) {
      problems.push(`skills/${entry.name} has no SKILL.md`);
      continue;
    }
    const skillText = await readFile(skillFile, 'utf8');
    for (const problem of checkFrontmatter(skillText, basename(skillDir))) problems.push(`skills/${entry.name}/SKILL.md: ${problem}`);
    const markdown = [skillFile];
    for (const sub of ['references', 'templates']) {
      const subDir = join(skillDir, sub);
      if (await exists(subDir)) {
        for (const file of await readdir(subDir)) if (file.endsWith('.md')) markdown.push(join(subDir, file));
      }
    }
    for (const file of markdown) {
      for (const reference of findReferences(await readFile(file, 'utf8'))) {
        if (!(await exists(join(skillDir, reference)))) {
          problems.push(`${file.slice(root.length + 1)} references missing file ${reference}`);
        }
      }
    }
  }

  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  for (const path of findForbiddenPaths(tracked)) problems.push(`${path} is private job-hunt data and must not be committed`);

  const denylist = process.env.PERSONAL_DATA_DENYLIST;
  if (denylist === undefined || denylist.trim() === '') {
    if (process.env.CI) {
      problems.push('PERSONAL_DATA_DENYLIST is not set; add it as a repository secret (one value per line)');
    } else {
      console.warn('warning: PERSONAL_DATA_DENYLIST is not set; personal-data check skipped locally');
    }
  } else {
    const files = [];
    for (const path of tracked) {
      const text = await readFile(join(root, path), 'utf8').catch(() => null);
      if (text !== null && !text.includes('\0')) files.push({ path, text });
    }
    problems.push(...findDenylisted(files, denylist.split(/\r?\n/)));
  }

  if (problems.length) {
    console.error(problems.map((problem) => `✖ ${problem}`).join('\n'));
    process.exitCode = 1;
  } else {
    console.log('✔ skill checks passed');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
