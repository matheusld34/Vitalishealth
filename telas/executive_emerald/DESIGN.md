---
name: Executive Emerald
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3e4a3f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6e7a6e'
  outline-variant: '#bdcabc'
  surface-tint: '#006d36'
  primary: '#006d36'
  on-primary: '#ffffff'
  primary-container: '#50c878'
  on-primary-container: '#005025'
  inverse-primary: '#66dd8b'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#5c5f61'
  on-tertiary: '#ffffff'
  tertiary-container: '#afb2b4'
  on-tertiary-container: '#414546'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#83fba5'
  primary-fixed-dim: '#66dd8b'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005227'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1280px
---

## Brand & Style

This design system embodies an **Executive Minimalist** aesthetic, blending high-end corporate reliability with a refreshing, organic vitality. The brand personality is professional, precise, and sophisticated, targeting a high-stakes audience that values clarity and efficiency without sacrificing visual elegance. 

The style utilizes a refined **Minimalism** approach with subtle **Tonal Layering**. It prioritizes heavy whitespace and a strictly governed hierarchy to ensure that the user feels a sense of calm and control. The emotional response is one of quiet confidence and focused productivity.

## Colors

The palette is anchored by **Emerald Green (#50C878)**, used intentionally for primary actions, success states, and subtle branding accents. This green represents growth and stability within a professional context.

- **Primary:** Emerald Green is reserved for high-impact interactive elements.
- **Secondary:** A deep Slate Blue-Grey provides a sophisticated anchor for text and iconography.
- **Surface/Container:** We use a tiered system of off-whites and cool greys (Slate 50 to 200) to create depth without relying on heavy shadows.
- **Functional:** Success, Warning, and Error states are derived from the Emerald primary, a warm Amber, and a muted Crimson respectively, all sharing the same luminosity profile.

## Typography

**Inter** is the sole typeface for this design system, chosen for its exceptional legibility and systematic, neutral character. 

- **Scale:** A tight typographic scale ensures that information density remains high but readable. 
- **Hierarchy:** Use font weight (SemiBold/Bold) rather than size increases to denote hierarchy where possible.
- **Labels:** Small labels use uppercase with increased letter spacing to provide a "technical" and organized feel.

## Layout & Spacing

The design system utilizes a **Fixed Grid** approach for desktop and a **Fluid Grid** for mobile devices. 

- **Desktop:** 12-column grid with a 1280px max-width, 24px gutters, and 64px side margins.
- **Mobile:** 4-column fluid grid with 16px gutters and 16px side margins.
- **Rhythm:** An 8px base unit governs all padding and margin tokens, ensuring consistent vertical and horizontal rhythm across all components.

## Elevation & Depth

To maintain the Executive Minimalist aesthetic, depth is communicated primarily through **Tonal Layers** and **Low-contrast Outlines** rather than heavy shadows.

- **Surface Tiers:** Backgrounds use `#F8FAFC`, while primary containers use `#FFFFFF`. Secondary containers (sidebars, footers) use `#F1F5F9`.
- **Outlines:** All containers feature a 1px solid border in `#E2E8F0` to define edges clearly.
- **Interactive Depth:** Only the highest-level modals or floating action buttons utilize a subtle, ambient shadow (0px 4px 20px rgba(0, 0, 0, 0.05)).

## Shapes

The shape language is defined as **Rounded (ROUND_EIGHT)**. This provides a soft, approachable feel that balances the "hard" professional nature of the Emerald and Slate color palette.

- **Standard Elements:** Buttons, Inputs, and Small Cards use an 8px (0.5rem) radius.
- **Large Containers:** Dashboard widgets and main content areas use a 16px (1rem) radius.
- **Interactive Indicators:** Small badges or status dots remain fully circular.

## Components

- **Buttons:** 
  - *Primary:* Solid Emerald Green (#50C878) with White text. No gradient.
  - *Secondary:* White background with an Emerald Green border and text.
- **Input Fields:** Use a 1px border (#E2E8F0) that transitions to a 2px Emerald Green border on focus. Labels sit 4px above the input field using the `label-md` style.
- **Cards:** White background, 1px Slate-200 border, 16px padding. No shadow by default; use a subtle lift on hover for interactive cards.
- **Chips/Badges:** Use a light tint of Emerald Green (#E6F6EB) with dark green text (#065F46) for a modern, accessible status indicator.
- **Lists:** Clean rows separated by a 1px horizontal rule (#F1F5F9). Use 16px vertical padding for high-density readability.
- **Checkboxes:** When checked, the fill is Emerald Green. Use the standard 8px roundedness for the container.