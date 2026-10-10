import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter, checkFrontmatter, findReferences, findForbiddenPaths, findDenylisted } from '../scripts/check-skill.mjs';

test('frontmatter fields are parsed, including a nested metadata block', () => {
  const fm = parseFrontmatter('---\nname: job-hunt\ndescription: Find jobs.\nmetadata:\n  internal: true\n---\n# Body\n');
  assert.deepEqual(fm, { name: 'job-hunt', description: 'Find jobs.', metadata: { internal: 'true' } });
});

test('missing frontmatter is reported', () => {
  assert.deepEqual(checkFrontmatter('# No frontmatter\n', 'job-hunt'), ['SKILL.md has no frontmatter block']);
});

test('name must match the skill directory and use lowercase letters, digits and hyphens', () => {
  assert.deepEqual(checkFrontmatter('---\nname: Job_Hunt\ndescription: x\n---\n', 'job-hunt'), [
    'name "Job_Hunt" must use lowercase letters, digits and hyphens',
    'name "Job_Hunt" must match its directory "job-hunt"',
  ]);
});

test('description is required and limited to 1024 characters', () => {
  assert.deepEqual(checkFrontmatter('---\nname: job-hunt\n---\n', 'job-hunt'), ['description is required']);
  const long = 'a'.repeat(1025);
  assert.deepEqual(checkFrontmatter(`---\nname: job-hunt\ndescription: ${long}\n---\n`, 'job-hunt'), [
    'description is 1025 characters; the limit is 1024',
  ]);
});

test('valid frontmatter has no problems', () => {
  assert.deepEqual(checkFrontmatter('---\nname: job-hunt\ndescription: Find jobs.\n---\n', 'job-hunt'), []);
});

test('references to bundled files are found in backticks and links, without duplicates', () => {
  const text = 'Read `references/interview.md`, then [the template](templates/PROFILE.md) and `references/interview.md`.';
  assert.deepEqual(findReferences(text), ['references/interview.md', 'templates/PROFILE.md']);
});

test('private data paths are forbidden anywhere in the tracked file list', () => {
  assert.deepEqual(
    findForbiddenPaths(['README.md', 'docs/job_hunt/PROFILE.md', 'examples/docs/job_hunt/x.md', 'docs/SPEC.md']),
    ['docs/job_hunt/PROFILE.md', 'examples/docs/job_hunt/x.md'],
  );
});

test('deny-listed values are found case-insensitively and reported without the value', () => {
  const files = [
    { path: 'README.md', text: 'Line one\nCall 555-0100 today\n' },
    { path: 'docs/SPEC.md', text: 'Works at EXAMPLE CORP.\n' },
    { path: 'clean.md', text: 'nothing here\n' },
  ];
  assert.deepEqual(findDenylisted(files, ['555-0100', 'example corp', '  ']), [
    'README.md:2 contains deny-listed value #1',
    'docs/SPEC.md:1 contains deny-listed value #2',
  ]);
});
