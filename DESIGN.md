---
version: 1.0
name: Airix Design System
description: A warm-canvas editorial interface with a premium 3D staging environment for the Airix product. The system anchors on a tinted cream canvas with EB Garamond serif display headlines, warm coral CTAs, and dark pitch-black product surfaces. Brand voltage comes from the cream/coral pairing — deliberately warm and humanist. Type voice runs a classic serif display (EB Garamond) for h1/h2 and a humanist sans (Inter) for body.

colors:
  light-bg: "#faf9f5"
  dark-bg: "#0C0C0E"
  light-surface: "#efe9de"
  dark-surface: "#161618"
  light-primary: "#cc785c"
  dark-primary: "#cc785c"
  light-primary-active: "#a85b42"
  dark-primary-active: "#a85b42"
  light-primary-disabled: "#e6dfd8"
  dark-primary-disabled: "#161618"
  light-secondary-border: "#f0ece7"
  dark-secondary-border: "#2a2a2b"
  button-dark-bg: "#252320"
  button-dark-hover: "#322f2b"
  light-text: "#141413"
  dark-text: "#faf9f5"
  light-muted: "#6c6a64"
  dark-muted: "#a09d96"
  light-border: "#e6dfd8"
  dark-border: "#2a2a2b"

typography:
  display-xl:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: 64px
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: -1.5px
  display-lg:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -1px
  display-md:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: -0.5px
  display-sm:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.3px
  title-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0
  title-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 1.5px
---

## Overview

Airix is the warmest, most editorial interface in its category. The base atmosphere is a **tinted cream canvas** (`var(--color-light-bg)` — #faf9f5) — distinctly warm, deliberately not a cool gray-white. Headlines run a **classic serif display** (EB Garamond) paired with **Inter** body sans. The combination feels like a high-end publication, anchored by a premium interactive 3D showroom staging environment.

Brand voltage comes from the **cream + coral pairing** — coral (`var(--color-light-primary)` — #cc785c) is the signature Airix accent, used on primary CTAs and callout cards. The coral is warm and slightly muted.

The system has three primary surface modes:
1. **Cream canvas** (`var(--color-light-bg)`) — default body floor
2. **Light cream cards** (`var(--color-light-surface)`) — feature card backgrounds
3. **Deep Pitch Black** (`var(--color-dark-bg)`) — Dark mode default and inverted product surfaces

**Key Characteristics:**
- Warm cream canvas with dark warm-ink text (`var(--color-light-text)`).
- Coral primary CTA. Used scarcely on individual buttons, generously on full-bleed coral callout cards.
- Serif display headlines via EB Garamond at weight 400 with negative letter-spacing. Pairs with humanist sans body.
- Integration of 3D staging components using R3F, creating a "showroom" effect (with glassmorphism and elliptical staging lines).
- Border radius is hierarchical: 8px for buttons + inputs, 12px for content cards, 16px for larger feature containers.

## Colors

### Brand & Accent
- **Coral / Primary** (`--color-light-primary` — #cc785c): The signature Airix warm coral. Used on primary CTAs and callout cards.
- **Coral Active** (`--color-light-primary-active` — #a85b42): The press / hover-darker variant.
- **Coral Disabled** (`--color-light-primary-disabled` — #e6dfd8): A desaturated cream-tinted disabled state.

### Surface
- **Canvas** (`--color-light-bg` — #faf9f5): The default page floor. Tinted cream.
- **Dark Canvas** (`--color-dark-bg` — #0C0C0E): The dark mode default page floor.
- **Surface Light** (`--color-light-surface` — #efe9de): Feature cards, content cards. Slightly darker than canvas.
- **Surface Dark** (`--color-dark-surface` — #161618): Dark mode elevated surfaces and inverted cards.
- **Hairline Border** (`--color-light-border` — #e6dfd8): The 1px border tone on cream surfaces.
- **Hairline Border Dark** (`--color-dark-border` — #2a2a2b): The 1px border tone on dark surfaces.

### Text
- **Ink** (`--color-light-text` — #141413): All headlines and primary text in light mode. Warm dark, slightly off-pure-black.
- **On Dark Text** (`--color-dark-text` — #faf9f5): Cream-tinted white used on dark surfaces and dark mode.
- **Muted** (`--color-light-muted` — #6c6a64): Sub-headings, breadcrumbs, secondary text.
- **Muted Dark** (`--color-dark-muted` — #a09d96): Secondary text in dark mode.

## Typography

### Font Family
The system runs **EB Garamond** as the serif display face for headlines, and **Inter** as the sans for body, navigation, and UI labels. 

The display/body split is editorial:
- EB Garamond serif (weight 400, negative tracking) → h1, h2, h3, hero display
- Inter sans (weight 400-500) → body, navigation, buttons, captions, labels

## Layout & Design Elements

### Spacing System
- **Section padding:** 96px — modern-SaaS rhythm.
- **Card internal padding:** 32px for feature cards, pricing tier cards. 24px for smaller tiles.

### Elevation & Depth
The elevation philosophy is **color-block and glassmorphism first, shadow rare**. 
- The 3D models and their staging floors (elliptical lines) create inherent physical depth.
- Glassmorphism (`backdrop-blur-md`, `bg-white/70`) is used specifically for floating HUD UI elements overlaid on the 3D canvas.

## Components (Referenced from /design)

### Buttons
- **`button-primary`**: Background `--color-light-primary`, white text. Rounded MD (8px). Active state darkens to `--color-light-primary-active`.
- **`button-secondary`**: Transparent background, hairline outline. Text uses `--color-light-text`.
- **`button-secondary-on-dark`**: Background `--color-button-dark-bg`, white text.
- **`button-text-link`**: Inline text button, no background. Hover reduces opacity to 70%.

### Cards & Containers
- **Product Mockup Cards**: Uses `--color-light-surface` or `--color-dark-surface`. Features a subtle icon top-left, a serif title, and Inter description.
- **Pricing Tiers**: 4-column layout. The "Team" tier is inherently elevated using a dark surface (`#161618`) with a subtle transform scale and shadow, making it pop out against the surrounding canvas.
- **Connector Tiles**: Compact cards used for integrations. Feature a small square icon, bold title, and muted description.

### Form Elements
- **Inputs**: Transparent background, hairline border.
- **Focused Inputs**: Adds an outline ring using the primary coral color with 20% alpha.

### Badges
- **`badge-pill`**: Light surface background, rounded full, regular text.
- **`badge-coral`**: Primary coral background, rounded full, uppercase tracking for emphasis (e.g. "NEW").

## Do's and Don'ts

### Do
- Anchor every page on the cream canvas. Pure white reads as generic; the warm tint is the Airix brand differentiator.
- Use EB Garamond serif for every display headline. Pair with Inter sans body. Negative letter-spacing on display sizes is essential.
- Reserve Coral for primary CTAs and full-bleed callout moments.
- Emphasize the 3D interactive showroom aesthetic for hero products. Use glassmorphic feature cards when overlaying 3D.

### Don't
- Don't use cool grays or pure white for canvas. Cream is the brand.
- Don't bold serif display weight. EB Garamond at 700 reads as bombastic; the system stays at 400.
- Don't use cool blue or saturated cyan as a brand accent. The coral is the brand voltage.
- Don't use Inter for display headlines. The serif character is the brand voice.
- Don't add heavy drop shadows to standard elements; rely on the contrast between cream and dark surfaces, and 3D depth.
