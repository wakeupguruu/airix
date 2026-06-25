const fs = require('fs');
const path = require('path');

const dir = 'apps/web/components/workspace/editor';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  { rx: /var\(--bg-base\)/g, val: 'var(--color-light-bg)' },
  { rx: /var\(--bg-panel\)/g, val: 'var(--color-light-surface)' },
  { rx: /var\(--bg-panel-hover\)/g, val: 'var(--color-light-surface)' },
  { rx: /var\(--bg-surface\)/g, val: 'var(--color-light-surface)' },
  { rx: /var\(--bg-raised\)/g, val: '#ffffff' },
  { rx: /var\(--border\)/g, val: 'var(--color-light-border)' },
  { rx: /var\(--border-subtle\)/g, val: 'var(--color-light-border)' },
  { rx: /var\(--border-accent\)/g, val: 'var(--color-light-border)' },
  { rx: /var\(--text-primary\)/g, val: 'var(--color-light-text)' },
  { rx: /var\(--text-secondary\)/g, val: 'var(--color-light-muted)' },
  { rx: /var\(--text-muted\)/g, val: 'var(--color-light-muted)' },
  { rx: /var\(--text-accent\)/g, val: 'var(--color-light-primary)' },
  { rx: /var\(--accent-brand\)/g, val: 'var(--color-light-primary)' },
  { rx: /var\(--accent-coral\)/g, val: 'var(--color-light-primary)' },
  { rx: /var\(--accent-blue\)/g, val: 'var(--color-light-primary)' },
  { rx: /var\(--ui-font\)/g, val: 'var(--font-inter-regular)' },
  { rx: /var\(--mono-font\)/g, val: 'var(--font-inter-regular)' },
  { rx: /var\(--serif-font\)/g, val: 'var(--font-eb-garamond-light)' }
];

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  replacements.forEach(r => {
    content = content.replace(r.rx, r.val);
  });
  fs.writeFileSync(p, content);
});
console.log('Done replacing css vars');
