---
name: UI/UX Design System
description: Enforces the visual branding, color palettes, and Tailwind CSS patterns for BitGuard.
trigger: always_on
---

# BitGuard Design System (Tailwind CSS)

To maintain a Tier-1 Enterprise look and feel, all frontend components must strictly adhere to the following Tailwind CSS patterns.

## Global Theming
The platform operates exclusively in a highly polished **Dark Mode**. Light mode classes (un-prefixed) should default to dark colors.

## Color Palette
*   **App Background:** `bg-slate-950`
*   **Card / Module Background:** `bg-slate-900`
*   **Borders:** `border-slate-800` or `border-slate-800/50` for softer dividers.
*   **Primary Action (Buttons):** `bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20`
*   **Primary Text (Headings):** `text-white`
*   **Secondary Text (Subtitles/Paragraphs):** `text-slate-400`
*   **Muted Text:** `text-slate-500`

## Status & Semantic Colors
*   **Success / Installed:** `text-emerald-400 bg-emerald-500/10 border-emerald-500/20`
*   **Warning / Upgrade:** `text-amber-500 bg-amber-600/20 border-amber-500/30`
*   **Danger / Uninstall:** `text-red-400 hover:bg-red-500/20 border-red-500/30`

## Layout & Spacing
*   **Corners:** Use generous rounding (`rounded-xl` or `rounded-2xl`) for cards and modals. Use `rounded-lg` for buttons and inputs.
*   **Grid Systems:** Use CSS Grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for dashboards and app listings.
*   **Transitions:** Always add `transition-all duration-200` or `transition-colors` to interactive elements (buttons, links, hover states).

## Component Rules
*   **Icons:** Must be imported from `lucide-react`. Default size for inline text is `size={16}` or `size={18}`.
*   **Modals:** Should blur the background (`backdrop-blur-sm`) and use `bg-slate-900 border border-slate-800` for the modal container.
