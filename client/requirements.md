## Packages
framer-motion | Essential for polished page transitions and interactive micro-animations (e.g., triage analysis loading states)
date-fns | Required for readable human-friendly timestamps on medical records and triage events
clsx | Utility for conditional class merging
tailwind-merge | Utility for merging tailwind classes safely

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}

The UI is designed as a "dark mode professional" clinical system. It uses custom CSS variables heavily tailored to a deep dark theme with glowing clinical cyan/teal accents.
