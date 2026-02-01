// /lib/badge-variants.ts
// Dynamic badge color system for thesis keywords

// Hash function to generate consistent color from string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Color palette for dynamic badges (softer, professional colors)
const dynamicColors = [
  { bg: "bg-blue-100", text: "text-blue-800" },
  { bg: "bg-purple-100", text: "text-purple-800" },
  { bg: "bg-pink-100", text: "text-pink-800" },
  { bg: "bg-indigo-100", text: "text-indigo-800" },
  { bg: "bg-cyan-100", text: "text-cyan-800" },
  { bg: "bg-emerald-100", text: "text-emerald-800" },
  { bg: "bg-amber-100", text: "text-amber-800" },
  { bg: "bg-rose-100", text: "text-rose-800" },
  { bg: "bg-violet-100", text: "text-violet-800" },
  { bg: "bg-lime-100", text: "text-lime-800" },
  { bg: "bg-teal-100", text: "text-teal-800" },
  { bg: "bg-orange-100", text: "text-orange-800" },
  { bg: "bg-sky-100", text: "text-sky-800" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-800" },
];

/**
 * Get consistent badge classes for any keyword/tag
 * Uses a hash function to ensure the same keyword always gets the same color
 */
export function getDynamicBadgeClasses(tag: string): string {
  const hash = hashString(tag.toLowerCase());
  const colorIndex = hash % dynamicColors.length;
  const color = dynamicColors[colorIndex];
  return `${color.bg} ${color.text}`;
}

/**
 * Returns "dynamic" for all keywords since we use hash-based colors
 * Kept for backward compatibility with existing code
 */
export const getBadgeVariant = (label: string): "dynamic" => {
  return "dynamic";
};