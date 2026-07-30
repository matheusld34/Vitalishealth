---
name: Vitalis Health
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3f4943'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6f7a73'
  outline-variant: '#bec9c1'
  surface-tint: '#006c4e'
  primary: '#006c4e'
  on-primary: '#ffffff'
  primary-container: '#50a684'
  on-primary-container: '#003726'
  inverse-primary: '#81d7b2'
  secondary: '#56615e'
  on-secondary: '#ffffff'
  secondary-container: '#dae5e1'
  on-secondary-container: '#5c6764'
  tertiary: '#436558'
  on-tertiary: '#ffffff'
  tertiary-container: '#7a9e8f'
  on-tertiary-container: '#12352a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9df4ce'
  primary-fixed-dim: '#81d7b2'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#00513a'
  secondary-fixed: '#dae5e1'
  secondary-fixed-dim: '#bec9c5'
  on-secondary-fixed: '#141d1b'
  on-secondary-fixed-variant: '#3f4946'
  tertiary-fixed: '#c5ebda'
  tertiary-fixed-dim: '#a9cfbf'
  on-tertiary-fixed: '#002117'
  on-tertiary-fixed-variant: '#2b4d41'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-base:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Hanken Grotesk
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
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is engineered for the modern healthcare sector, specifically tailored for wellness centers and clinics. The brand personality is rooted in empathy, clarity, and professional reliability. It avoids the clinical coldness of traditional medical software by utilizing a "Human-Centric Professionalism" style—a blend of high-end Corporate Modernity and soft, organic Minimalism.

The UI aims to reduce cognitive load and patient anxiety through expansive whitespace, intentional breathing room, and a soft-focus aesthetic. The emotional response should be one of "Assured Calm," signaling to users that they are in expert, yet caring, hands.

## Colors
The palette is centered around a "Softer Emerald," a desaturated green that provides professional authority without the aggression of high-contrast jewel tones.

- **Primary (#50A684):** A breathable emerald used for calls to action, active states, and brand-critical markers.
- **Secondary (#E8F3EF):** A soft mint-wash used for large background surfaces and container fills to soften the visual impact.
- **Tertiary (#2D4F43):** A deep forest-slate reserved for high-contrast typography and iconography to ensure WCAG AA accessibility.
- **Neutral (#F9FAFB):** A cool, clean grey-white that serves as the canvas for the entire system.

Use functional semantic colors (Success: #43966D, Warning: #E6A23C, Error: #D9534F) sparingly and with reduced saturation to match the soft-touch aesthetic.

## Typography
The system utilizes **Manrope** for its exceptional legibility and balanced geometric construction, providing a modern yet trustworthy feel. The tight tracking in display sizes adds a sense of precision, while generous line heights in body copy ensure accessibility for patients of all ages.

**Hanken Grotesk** is introduced for labels and data-heavy interfaces. Its sharp, contemporary architecture provides a technical contrast to the warmth of Manrope, making it ideal for medical readings, timestamps, and metadata.

## Layout & Spacing
The layout follows a **Fluid-Fixed hybrid model**. Content resides within a maximum width of 1280px to prevent excessive line lengths on ultra-wide monitors, while the inner grid remains fluid.

- **Grid:** A 12-column system is used for desktop, 8-column for tablet, and 4-column for mobile.
- **Rhythm:** An 8px base unit governs all dimensions. Use "Comfortable" spacing (typically 24px–32px) between unrelated sections to maintain the airy, wellness-focused feel.
- **Reflow:** On mobile devices, side-by-side card layouts must stack vertically, and horizontal margins shrink to 16px to maximize readable area.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** and **Ambient Shadows** rather than stark borders. The design system uses three levels of depth:

1.  **Floor:** The neutral background (#F9FAFB).
2.  **Surface:** White containers (#FFFFFF) with a very soft, diffused shadow (0px 4px 20px rgba(80, 166, 132, 0.05)). Note the slight primary color tint in the shadow to maintain color harmony.
3.  **Overlay:** Modals and menus with a slightly more pronounced shadow and a subtle backdrop blur (4px) to keep the user focused on the immediate task.

Avoid black shadows; always use a desaturated version of the primary or neutral-dark colors for shadows to maintain the soft aesthetic.

## Shapes
The shape language is "Rounded" to evoke friendliness and safety. 

- **Standard Elements:** Buttons and input fields use a 0.5rem (8px) radius.
- **Large Elements:** Cards and featured containers use 1rem (16px) or 1.5rem (24px) for a modern, approachable look.
- **Interactive Indicators:** Selection indicators and chips may use pill-shaped (full-round) corners to distinguish them from structural elements.

## Components
- **Buttons:** Primary buttons use the soft emerald fill with white text. Secondary buttons use a primary-tinted ghost style (transparent fill, primary border). Hover states should involve a subtle shift to a deeper green rather than a drastic color change.
- **Input Fields:** Use a subtle grey border that transitions to the primary emerald on focus. Ensure labels are always visible (top-aligned) to accommodate users with cognitive difficulties.
- **Cards:** White backgrounds, soft shadows, and 16px corner radius. Group related health data within cards to create "islands of information" against the neutral background.
- **Chips/Badges:** Used for appointment status or health categories. Use the Secondary color (#E8F3EF) as the background with Primary text for a low-contrast, legible appearance.
- **Lists:** High-density lists (e.g., patient records) should use subtle dividers in a light grey. Ensure a minimum touch target of 44px for all list items.
- **Progress Indicators:** Use soft, rounded bars for health goals or registration steps to maintain the non-intimidating design narrative.