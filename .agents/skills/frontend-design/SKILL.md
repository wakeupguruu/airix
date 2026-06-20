---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one within the Airix product. Anchors every decision on the Airix architectural manual — warm cream canvas, EB Garamond serif display, coral CTAs, and a 3D showroom staging aesthetic — so nothing reads as a templated default.
license: Complete terms in LICENSE.txt
---

Approach this as the design lead for Airix — a warm-canvas editorial interface with a premium 3D staging environment for aerospace engineering. The visual identity is already established and documented in `DESIGN.md` and the live `/design` reference page. Every new screen, component, or layout must inherit from that identity. Your job is not to invent a new look; it is to extend the existing one with the same intentionality that built it. Where the brief leaves a creative axis free, use it to deepen the Airix character, never to flatten it into something generic.

## Ground it in the subject

Airix serves aerospace engineers designing aircraft and maintaining fleets. The subject's world — hangars, flight decks, structural schematics, sensor telemetry, component lifecycles — is where distinctive choices come from. Build with real aerospace content and terminology throughout. If a brief doesn't specify content, reach for the vocabulary of the product: aircraft names, flight hours, drag coefficients, component health — not lorem ipsum or generic SaaS copy.

## Design principles

### The Airix palette is non-negotiable

The token system lives in `globals.css` under the Tailwind v4 `@theme` directive. Use these CSS variables exclusively — never reach for arbitrary hex values when a token exists.

**Surfaces:**
- Canvas: `--color-light-bg` (#faf9f5) — tinted cream, deliberately not cool gray or pure white. This warmth is the brand.
- Dark canvas: `--color-dark-bg` (#0C0C0E) — pitch-black, not charcoal.
- Surface light: `--color-light-surface` (#efe9de) — feature cards, content cards. Slightly darker than canvas.
- Surface dark: `--color-dark-surface` (#161618) — dark-mode elevated surfaces and inverted cards.

**Brand accent:**
- Coral: `--color-light-primary` / `--color-dark-primary` (#cc785c) — the signature Airix warm coral. Used on primary CTAs and full-bleed callout cards. Warm and slightly muted — never saturated orange or red.
- Coral active: `--color-light-primary-active` (#a85b42) — press/hover-darker variant.
- Coral disabled: `--color-light-primary-disabled` (#e6dfd8) — desaturated cream-tinted disabled state.

**Text:**
- Ink: `--color-light-text` (#141413) — warm dark, slightly off-pure-black.
- On-dark text: `--color-dark-text` (#faf9f5) — cream-tinted white.
- Muted: `--color-light-muted` (#6c6a64) / `--color-dark-muted` (#a09d96) — sub-headings, breadcrumbs, secondary text.

**Borders:**
- Hairline: `--color-light-border` (#e6dfd8) / `--color-dark-border` (#2a2a2b).
- Secondary border: `--color-light-secondary-border` (#f0ece7) / `--color-dark-secondary-border` (#2a2a2b).

**Dark buttons:**
- `--color-button-dark-bg` (#252320) / `--color-button-dark-hover` (#322f2b) — for secondary buttons on dark surfaces.

### Typography carries the brand voice

The display/body split is editorial. The serif character is what separates Airix from another SaaS tool — switching to sans display would erase that.

**Display face — EB Garamond (serif):**
Used for h1, h2, h3, hero display, pricing headers. Always weight 400 — never bold (700 reads as bombastic). Always negative letter-spacing on display sizes.

| Role | Size | Weight | Line-height | Tracking |
|------|------|--------|-------------|----------|
| display-xl | 64px | 400 | 1.05 | -1.5px |
| display-lg | 48px | 400 | 1.1 | -1px |
| display-md | 36px | 400 | 1.15 | -0.5px |
| display-sm | 28px | 400 | 1.2 | -0.3px |

**Body face — Inter (sans):**
Used for body copy, navigation, buttons, captions, labels, form elements.

| Role | Size | Weight | Line-height | Tracking |
|------|------|--------|-------------|----------|
| title-lg | 22px | 500 | 1.3 | 0 |
| title-md | 18px | 500 | 1.4 | 0 |
| title-sm | 16px | 500 | 1.4 | 0 |
| body-md | 16px | 400 | 1.55 | 0 |
| body-sm | 14px | 400 | 1.55 | 0 |
| caption | 13px | 500 | 1.4 | 0 |
| caption-uppercase | 12px | 500 | 1.4 | 1.5px |

The four font variants are loaded in `layout.tsx`:
- `font-garamond-dark` — EB Garamond 400–700 (use at 400 only)
- `font-garamond-light` — EB Garamond 300–400
- `font-inter-regular` — Inter 400
- `font-inter-bold` — Inter 600–700

### Structure and layout

Section padding is 96px — modern-SaaS rhythm. Card internal padding is 32px for feature cards, 24px for smaller tiles. Border radius is hierarchical and strict:
- 8px (`rounded-md`) — buttons, inputs
- 12px (`rounded-xl`) — content cards, connector tiles
- 16px (`rounded-2xl`) — feature containers, callout blocks

### Elevation and depth

The elevation philosophy is **color-block and glassmorphism first, shadow rare**. Heavy drop shadows are not part of the Airix vocabulary. Depth comes from:
- 3D models and their elliptical staging floors (R3F / Three.js)
- Glassmorphism (`backdrop-blur-md`, `bg-white/70 dark:bg-dark-bg/70`) for floating HUD elements overlaid on the 3D canvas
- Surface-color contrast between cream and dark blocks

The hero section uses an elliptical stage with connector-line annotation cards pointing at the 3D model — a "showroom" effect. This is the signature Airix interaction pattern.

### Dark mode

Dark mode is class-based (Tailwind v4 custom variant: `@custom-variant dark (&:is(.dark *))`). Every element must carry both light and dark variants. The `ThemeProvider` from `next-themes` handles toggling. Dark mode swaps cream → pitch-black, ink → cream-white, and surface-light → surface-dark. Coral remains the same in both modes.

## Component inventory

The `/design` page is the live reference. When building new components, match these established patterns:

**Buttons:**
- `button-primary` — `bg-light-primary text-white rounded-md`, hover reduces opacity.
- `button-primary-active` — `bg-light-primary-active text-white`.
- `button-primary-disabled` — `bg-light-primary-disabled text-light-muted cursor-not-allowed`.
- `button-secondary` — transparent, hairline outline, hover fills with surface color.
- `button-secondary-on-dark` — `bg-button-dark-bg`, dark border, hover to `button-dark-hover`.
- `button-text-link` — no background, hover reduces opacity to 70%.
- `text-link-coral` — `text-light-primary`, hover underline. The signature inline detail.
- `button-icon-circular` — 36×36, full radius, transparent with hairline border.

**Cards:**
- Product mockup cards: `bg-light-surface` / `bg-dark-surface`, icon top-left, serif title, Inter description.
- Connector tiles: Compact, icon square, bold sans title, muted description. Used for integrations.
- Full-bleed coral callout: `bg-light-primary`, white serif headline, white body text, cream-canvas CTA button — the "Enter the Workspace" pattern.
- Feature cards with outline: transparent background, hairline border, serif title, muted body, coral text-link arrow.

**Pricing tiers:**
- 4-column grid. The elevated "Fleet" tier uses `bg-[#161618]` with `scale-105` and `shadow-xl` to pop. All prices in serif display. Feature lists in body-sm with green checkmarks.

**Forms:**
- Transparent background, hairline border, `rounded-md`.
- Focus state: coral border with `outline-[3px] outline-light-primary/20` ring.

**Badges:**
- `badge-pill` — surface background, hairline border, full radius.
- `badge-coral` — coral background, white text, uppercase tracking, full radius.

## Process: plan within the system, then build

Work in two passes. First, plan the new screen or component by mapping every visual decision to the existing Airix token system — name the exact CSS variables you will use for each surface, text color, border, and accent. If you cannot map a decision to an existing token, check `DESIGN.md` and `globals.css` before inventing anything new.

Then review the plan: does every element look like it belongs on the same site as the `/design` reference page? Could this screen sit next to the hero section with the F-22 Raptor and feel native? If anything reads as foreign — wrong font family, wrong border radius, wrong surface color — revise before building.

When writing the code, be careful of CSS selector specificities. It's easy to generate Tailwind classes that fight each other, especially between section-level and element-level padding/margin. Test both light and dark modes.

Try to do planning and iteration in your thinking, and only show ideas to the user when you have higher confidence it'll delight them.

## Restraint and self-critique

Spend your boldness in one place. Let the signature element — the 3D showroom, the coral callout, the serif headline — be the one memorable thing; keep everything around it quiet and disciplined. Cut any decoration that does not serve the brief. Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected. Critique your own work as you build, taking screenshots if your environment supports it — a picture is worth 1000 tokens.

## Do's and don'ts

**Do:**
- Anchor every page on the cream canvas. Pure white reads as generic; the warm tint is the Airix differentiator.
- Use EB Garamond serif for every display headline. Pair with Inter sans body. Negative letter-spacing on display sizes is essential.
- Reserve coral for primary CTAs and full-bleed callout moments.
- Emphasize the 3D interactive showroom aesthetic for hero products. Use glassmorphic feature cards when overlaying 3D.
- Always implement both light and dark mode variants.

**Don't:**
- Don't use cool grays or pure white for canvas. Cream is the brand.
- Don't bold serif display weight. EB Garamond at 700 reads as bombastic; the system stays at 400.
- Don't use cool blue or saturated cyan as a brand accent. The coral is the brand voltage.
- Don't use Inter for display headlines. The serif character is the brand voice.
- Don't add heavy drop shadows to standard elements; rely on the contrast between cream and dark surfaces, and 3D depth.
- Don't invent new color tokens without checking `globals.css` and `DESIGN.md` first.

## Writing in design

Words are design material, not decoration. Bring the same intentionality to copy that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.

Write from the end user's side of the screen. Name things by what people control and recognize, never by how the system is built. A person manages notifications, not webhook config. Describe what something does in plain terms rather than selling it. Being specific is always better than being clever.

Use active voice as default. A control should say exactly what happens when it's used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.

Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.

Keep the register conversational and tuned: plain verbs, sentence case, no filler, with tone matched to the Airix brand — warm, precise, editorial. Let each element do exactly one job. A label labels, an example demonstrates, and nothing quietly does double duty.

## Developer Handoff & Base AI Prompt

When guiding external tools or providing a base context to other AI assistants working on Airix, enforce the following strict prompt block:

```markdown
# AIRIX UI / UX SYSTEM PROMPT
You are a senior frontend UI/UX engineer working on the Airix platform. Your goal is to build components that are strictly aligned with our established design system. The UI must be extremely premium, minimalistic, and user-friendly.

Before generating or modifying any code, you MUST follow these absolute rules:

## 1. Context Gathering (MANDATORY FIRST STEP)
Always read the following files to understand the exact design language, colors, and spatial harmony we use:
- `DESIGN.md` (The core design system documentation)
- `apps/web/app/design/page.tsx` (The live design system reference)
- `apps/web/app/page.tsx` and the components inside `apps/web/components/home/`

## 2. Typography & Fonts
- **Strict Adherence:** Only use the exact font families, weights, and tracking sizes defined in the design system.
- Headlines should use our serif font (`font-garamond-dark`).
- Body text, labels, and UI elements must use our sans-serif font (`font-sans` / Inter).
- Pay close attention to `text-[11px] uppercase tracking-widest` for small labels. Do not invent your own font sizing.

## 3. Strict Theme & Color Rules
- **No Inverted Theme Blocks:** In light mode, NEVER use massive blocks of dark background (e.g., a split screen where half is dark). In dark mode, NEVER use massive blocks of light background. 
- The background color must seamlessly flow with the current active theme. 
- Rely entirely on our CSS variables (e.g., `bg-light-bg`, `bg-dark-bg`, `text-light-text`, `text-light-muted`). Do not use raw Tailwind colors like `bg-gray-100` or `text-slate-800`.

## 4. Minimalist Container & Box Philosophy
- **Do not wrap everything in a box.** We use a borderless, open, and airy aesthetic. 
- For example: A login form should NOT be trapped inside an unnecessary gray bounding box with a shadow. Let elements breathe directly on the page canvas.
- When a box/card IS strictly necessary, you are limited to exactly **three patterns** found on the Home/Design pages:
  1. **Primary/Orange Card:** `bg-light-primary` / `bg-dark-primary` (e.g., the primary coral).
  2. **Subtle Surface Card:** `bg-light-surface` / `bg-dark-surface` (e.g., the light warm cream/orange tint).
  3. **Border-Only Card:** Same background as the canvas, but with a subtle border (`border border-light-border dark:border-dark-border`).
- NEVER use heavy drop shadows. Rely on surface contrast and borders.

## 5. Overall Standard
- The UI must look like a high-end, state-of-the-art SaaS platform (think Apple, Vercel, or Linear).
- Use proper padding and gaps (e.g., `gap-6`, `gap-8`, `p-8`). Don't make elements cramped.
- Do not use generic 3D wireframes or placeholder styling. Follow the exact aesthetic established in the Home page.

If you understand these rules, please analyze the task I give you and ensure your output perfectly respects the Airix Design System.
```
