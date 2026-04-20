# Project: FES SOC Diagnostic Website

## What this project is
A Next.js 16 + Tailwind CSS v4 website displaying SOC (Shared-Outcome Commons) 
Policy Diagnostic analysis for Chhattisgarh government schemes.
Built for Foundation for Ecological Security (FES) | IIM Raipur Internship by Vaibhav Kumar Singh.

## Project uses pnpm, not npm. Always use pnpm commands.

## Color palette (use these exact hex values)
- Primary dark green: #1B4332
- Medium green: #2D6A4F
- Accent amber/saffron: #D97706
- Deep navy: #1E3A5F
- Page background: #F7F5F0
- SOC badge green: #16A34A
- Near-SOC badge amber: #B45309
- Non-SOC badge red: #B91C1C
- Tricolor saffron: #FF9933
- Tricolor green: #138808

## Pages to build (Next.js App Router, all inside /app folder)
- / → Home: hero, stats bar, T1-T4 cards, key finding callout
- /dashboard → Cross-dept stacked bar chart + filterable scheme table
- /departments → Grid of 35 department cards
- /departments/[slug] → Dept detail with scheme list rows
- /schemes/[slug] → Scheme detail with SOC evidence table + upgrade pathway
- /framework → SOC methodology with 4-test definition table
- /about → Author, FES, IIM Raipur

## Existing components (already built by v0.app, do not recreate)
- components/navbar.tsx — fully working, has tricolor stripe

## Components still to build (add to components/ folder)
- Hero.tsx — hero section + stats bar
- FrameworkCards.tsx — 4-card T1-T4 explanation grid
- DepartmentCard.tsx — card for department grid (SOC bar, counts, finding)
- SchemeRow.tsx — row for scheme list (T1-T4 dot badges + classification)
- EvidenceTable.tsx — 4-row SOC evidence table (T1-T4 with sub-params)
- UpgradePathway.tsx — amber-accented numbered intervention list

## Data model (Supabase PostgreSQL, to be connected later)
- departments: id, name, slug, scheme_count, soc_count, near_soc_count, non_soc_count, dominant_finding
- schemes: id, department_id, name, slug, objective, t1, t2, t3, t4 (booleans), score, classification
- soc_evidence: id, scheme_id, test_label, result (boolean), sub_params (JSONB), delta_y_low, delta_y_high
- upgrade_pathways: id, scheme_id, step_number, intervention_text

## Coding rules
- TypeScript always
- Tailwind for all styling — no separate CSS files
- Use the existing components/ui/* library (shadcn/radix already installed)
- Keep components small, typed props with TypeScript interfaces
- App Router conventions: server components by default, add "use client" only when needed