# Woghks Blog Design System

## Overview

Woghks Blog is a focused technical writing surface. The design blends Cal.com's calm SaaS editorial structure with MiniMax's category-color identity system. Existing page structure, labels, navigation items, and content copy should be preserved unless a separate product decision explicitly changes them.

The base language is monochrome and quiet: white canvas, near-black headings, soft gray cards, thin hairline borders, and restrained 8-12px radii. MiniMax influence appears only in category identity moments: active category accents, small badges, and subtle colored indicators. Brand color is not used for generic buttons or body text.

**Key Characteristics:**
- Cal-style white canvas with near-black typography and soft gray card surfaces.
- Pretendard remains the primary font because the content is Korean-heavy; JetBrains Mono is reserved for code.
- MiniMax-style category color encoding: each main category gets one vivid accent for small UI indicators.
- Reading-first post detail: centered prose, sticky right TOC on desktop, compact post metadata, related posts after the article.
- Buttons use Cal-style 8px radius; category chips, badges, and segmented controls may use pill radius.
- Shadows stay minimal. Borders and surface contrast carry hierarchy.

## Colors

### Core
- **Canvas** (`{colors.canvas}`): `#ffffff`. Primary page floor and article surface.
- **Ink** (`{colors.ink}`): `#111111`. Headings, primary labels, primary action background.
- **Body** (`{colors.body}`): `#374151`. Long-form body copy and descriptions.
- **Muted** (`{colors.muted}`): `#6b7280`. Secondary text, metadata, sidebar labels.
- **Muted Soft** (`{colors.muted-soft}`): `#8a8f98`. Captions and tertiary labels.
- **Surface Soft** (`{colors.surface-soft}`): `#f8f9fa`. Page bands and sidebar active backgrounds.
- **Surface Card** (`{colors.surface-card}`): `#f5f5f5`. Feature cards and quiet post-card surfaces.
- **Hairline** (`{colors.hairline}`): `#e5e7eb`. Borders, dividers, table lines.
- **Hairline Soft** (`{colors.hairline-soft}`): `#f1f2f4`. Very quiet section dividers.
- **Footer Dark** (`{colors.footer-dark}`): `#101010`. Footer only.
- **On Dark** (`{colors.on-dark}`): `#ffffff`. Text on dark footer or dark category surfaces.
- **On Dark Soft** (`{colors.on-dark-soft}`): `#a1a1aa`. Muted footer text.

### Category Accents
- **Problem Coral** (`{colors.problem-coral}`): `#ff5a3d`. Problem Solving and algorithm identity.
- **Machine Magenta** (`{colors.machine-magenta}`): `#d946ef`. Machine Learning identity.
- **Data Blue** (`{colors.data-blue}`): `#2563eb`. Data Analysis identity.
- **Web Purple** (`{colors.web-purple}`): `#7c3aed`. Web Programming identity.
- **CS Cyan** (`{colors.cs-cyan}`): `#0891b2`. CS and Database identity.
- **Cert Emerald** (`{colors.cert-emerald}`): `#10b981`. Certifications identity.

### Usage Rules
- Use `{colors.ink}` for generic CTAs and high-emphasis labels.
- Use category accents only for category cards, active indicators, badges, and small data-identity moments.
- Do not use gradients on generic buttons.
- Do not tint large article surfaces with category colors; keep reading surfaces neutral.

## Typography

### Font Family

**Pretendard** is the primary font for all UI and prose. It handles Korean body text better than DM Sans or Cal Sans while still supporting a modern editorial look. Display hierarchy borrows Cal-style weight discipline and spacing.

**JetBrains Mono** is used for code blocks and inline code.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---:|---:|---:|---:|---|
| `{typography.display-xl}` | 56px | 700 | 1.05 | -1.6px | Reserved for existing hero-sized content |
| `{typography.display-lg}` | 44px | 700 | 1.1 | -1.2px | Article title or existing page title |
| `{typography.heading-lg}` | 32px | 700 | 1.18 | -0.8px | Section headings |
| `{typography.heading-md}` | 24px | 700 | 1.25 | -0.4px | Card group headings |
| `{typography.title-md}` | 18px | 600 | 1.35 | 0 | Card titles |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Table titles and sidebar labels |
| `{typography.body-lg}` | 18px | 400 | 1.65 | 0 | Article lead text |
| `{typography.body-md}` | 16px | 400 | 1.65 | 0 | Article body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Descriptions and metadata |
| `{typography.caption}` | 12px | 600 | 1.4 | 0.2px | Badges, table headers, micro labels |
| `{typography.button}` | 14px | 600 | 1 | 0 | Button labels |

### Principles
- Use larger size before heavier weight. Do not use 800/900 for normal UI surfaces.
- Article prose should stay comfortable: 16-17px with generous line height.
- Metadata and table headers may use uppercase captions, but keep tracking modest.

## Layout

### Spacing
- **Base unit**: 4px.
- **Primary increments**: 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px.
- **Page gutters**: 24px mobile, 32px desktop.
- **List pages**: 32-48px vertical rhythm.
- **Article width**: 720px max for prose.
- **Post detail desktop**: article column plus right TOC; left navigation lives in the app sidebar.

### Structure
- Preserve current route structure and copy by default.
- List pages should keep the table/card view controls and pagination flow.
- Category pages should preserve breadcrumb, title, table/card controls, and post list.
- Post detail should prioritize reading: back link, post metadata, article body, related posts, footer.

## Shapes

| Token | Value | Use |
|---|---:|---|
| `{rounded.sm}` | 6px | Small menu items, compact chips |
| `{rounded.md}` | 8px | Buttons, inputs, segmented controls |
| `{rounded.lg}` | 12px | Post cards, table wrappers, sidebar panels |
| `{rounded.xl}` | 16px | Category cards and feature panels |
| `{rounded.hero}` | 28px | Reserved; do not introduce new hero surfaces without explicit request |
| `{rounded.full}` | 9999px | Badges, category pills, icon buttons |

## Components

### `app-shell`
- Sidebar-first documentation shell.
- Header is sticky, white, 64px high, with hairline bottom border and minimal controls.
- Main content uses a centered max-width container; article pages narrow internally.

### `sidebar-nav`
- Main navigation preserves the existing item set.
- Category icons may use their assigned accent through subtle active indicators.
- Avoid profile-heavy treatment in the sidebar.

### `post-table`
- Cal-style dense content table.
- White background, 1px hairline border, 12px radius.
- Header row uses `{colors.surface-soft}` and caption typography.
- Rows use compact metadata and no heavy shadows.

### `post-card`
- Quiet card for scan mode.
- Background `{colors.canvas}` or `{colors.surface-card}`, 12px radius, hairline border.
- Category chip appears above title.
- Tech badges and hashtags stay secondary.

### `post-header`
- MiniMax docs-inspired metadata block.
- Large title, short description, then a compact two-column metadata grid.
- Category accent may appear as a small vertical bar or badge.

### `post-toc`
- Right-rail table of contents on desktop.
- Active item uses `{colors.ink}` and a thin category-neutral black indicator.
- TOC should not compete with prose.

### `footer`
- Dark footer closes the page.
- Keep it compact and preserve existing copy unless separately requested.

## Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `< 640px` | Single-column lists, card view preferred, article title drops to 32px, TOC hidden |
| `640-1023px` | Post cards 2-up, sidebar drawer behavior |
| `>= 1024px` | Sidebar persistent, table view available, post TOC visible |
| `>= 1280px` | Main content breathes but article prose remains 720px |

## Do's and Don'ts

### Do
- Keep the blog content-first.
- Use category color encoding consistently and sparingly.
- Use neutral surfaces for reading and dense lists.
- Preserve existing copy, route structure, and navigation unless asked to change them.
- Preserve code readability over brand styling.

### Don't
- Don't turn the home page into a portfolio hero.
- Don't add new hero copy, taglines, summaries, or navigation changes as part of styling-only work.
- Don't mix pill buttons and 8px buttons randomly; use 8px for buttons, pill for chips/badges.
- Don't use large gradients behind article prose.
- Don't introduce another web font unless it improves Korean readability.

## Implementation Notes

1. Start with `layout.css` tokens and shared shell styling.
2. Restyle existing components without adding copy or changing route IA.
3. Restyle `post-table.svelte`, `post-card.svelte`, and category pages to match list/card rhythm.
4. Refine `post-header.svelte`, `post-toc.svelte`, and `related-posts.svelte` for a documentation reading experience.
