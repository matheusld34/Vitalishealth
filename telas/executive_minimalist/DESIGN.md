---
name: Executive Minimalist
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#434654'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#535f73'
  on-secondary: '#ffffff'
  secondary-container: '#d4e0f8'
  on-secondary-container: '#576377'
  tertiary: '#7b2600'
  on-tertiary: '#ffffff'
  tertiary-container: '#a33500'
  on-tertiary-container: '#ffc6b2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#d7e3fb'
  secondary-fixed-dim: '#bbc7de'
  on-secondary-fixed: '#101c2d'
  on-secondary-fixed-variant: '#3b475b'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  helper-text:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 2rem
  stack-gap-sm: 0.5rem
  stack-gap-md: 1.5rem
  stack-gap-lg: 2rem
  max-width-login: 400px
---

## Brand & Style
The design system focuses on a high-trust, professional aesthetic tailored for enterprise SaaS and modern financial platforms. The brand personality is reliable, efficient, and unobtrusive, ensuring that the user's primary task—authentication—is friction-less.

The visual style is **Minimalist** with a focus on functional clarity. It leverages generous white space to reduce cognitive load and employs subtle depth to guide the user's eye toward primary actions. The interface avoids decorative flourishes in favor of precision and structural integrity.

## Colors
The palette is rooted in a "Clean White" foundation to maximize perceived space and cleanliness. 
- **Primary Blue:** A professional, high-contrast blue used exclusively for primary actions and active states.
- **Secondary Gray:** A muted slate used for secondary information, icons, and supporting text.
- **Neutral Grays:** A range of soft grays used for borders, input backgrounds, and subtle surface divisions to maintain a soft but structured hierarchy.

## Typography
This design system utilizes **Inter** for its exceptional legibility and systematic feel. 
- **Headlines:** Set with tighter letter-spacing and bold weights to establish a strong focal point.
- **Body:** Optimized for readability with a standard 1.5x line height.
- **Labels:** Use a medium-to-semibold weight to ensure they are easily scannable above input fields.
- **Scale:** On mobile devices, headline sizes are reduced to ensure the login card remains compact and prevents excessive scrolling.

## Layout & Spacing
The layout follows a **Fixed Grid** approach for the central authentication card, pinned to the center of the viewport. 
- **Vertical Rhythm:** Elements are stacked using a 4px base unit. Inputs are separated from their labels by 8px, and form groups are separated by 24px.
- **Responsive Behavior:** On desktop, the login card is a fixed 400px width with a soft shadow. On mobile (below 640px), the card expands to fill the screen width with horizontal margins of 16px, removing the outer elevation for a flat, integrated look.

## Elevation & Depth
Hierarchy is established through **Ambient Shadows**. 
- **Surface:** The main background is pure white.
- **The Login Card:** Features a multi-layered, low-opacity shadow (e.g., `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`) to create a gentle "lift" from the background.
- **Inputs:** Use a subtle inset shadow or a light gray 1px border to define the interactable area without creating visual noise.

## Shapes
The shape language is **Rounded**, using an 8px (0.5rem) radius as the standard for containers and inputs. 
- **Standard:** 8px for input fields and primary buttons.
- **Large:** 16px for the main login card.
- **Circular:** Used only for decorative profile avatars or specific toggle icons.

## Components
- **Primary Button:** Solid Professional Blue background with white text. High-contrast, 8px corner radius, and a subtle scale-down effect (0.98) on click.
- **Secondary Button:** Ghost style with a 1px soft gray border and slate text. Used for "Create Account" or "Forgot Password" actions.
- **Input Fields:** Soft gray background (#F4F5F7) that transitions to pure white with a 2px blue border on focus. Placeholders are set in a light slate.
- **Social Login Buttons:** White background with a standard 1px border. Brand logos (Google, Apple, Microsoft) are centered with accompanying text. These maintain the same 8px radius as the primary form elements.
- **Checkboxes:** Small 4px radius with a blue fill when active.
- **Error States:** Use a specific "System Red" (#DE350B) for border-color and helper text to ensure accessibility and immediate recognition.