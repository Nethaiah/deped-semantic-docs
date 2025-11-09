// /constants/badgeVariants.ts
import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

// Convert string to snake_case for variant matching
function toSnakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\/\s]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// Hash function to generate consistent color from string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Generate variant name from tag
function generateVariantName(tag: string): string {
  return toSnakeCase(tag);
}

// Predefined mappings for known categories and offices
export const badgeVariantMap: Record<string, BadgeVariant> = {
  // Categories
  "policy": "policy",
  "memo": "memo",
  "learning": "learning",
  "curriculum": "curriculum",
  "school calendar": "school_calendar",
  
  // Offices
  "curriculum implementation division": "curriculum_implementation_division",
  "school governance and operations division": "school_governance_and_operations_division",
  "school governance and operations": "school_governance_and_operations_division",
  "personnel/human resources": "personnel_hr",
  "personnel / hr": "personnel_hr",
  "personnel hr": "personnel_hr",
  "records management": "records_management",
  "asset management": "asset_management",
  "cash management": "cash_management",
  "ict": "ict",
  "legal / school titling": "legal_school_titling",
  "legal school titling": "legal_school_titling",
  "finance": "finance",
  "general services unit": "general_services_unit",
  "prime - hr": "prime_hr",
  "prime hr": "prime_hr",
  "quality management system": "quality_management_system",
};

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
];

// Get dynamic color classes for unknown tags
export function getDynamicBadgeClasses(tag: string): string {
  const hash = hashString(tag);
  const colorIndex = hash % dynamicColors.length;
  const color = dynamicColors[colorIndex];
  return `${color.bg} ${color.text}`;
}

// Main helper function with fallback to dynamic colors
export const getBadgeVariant = (label: string): BadgeVariant | "dynamic" => {
  const normalized = label.trim().toLowerCase();
  
  // Try direct lookup
  if (badgeVariantMap[normalized]) {
    return badgeVariantMap[normalized];
  }
  
  // Try snake_case conversion
  const snakeCase = toSnakeCase(normalized);
  if (badgeVariantMap[snakeCase]) {
    return badgeVariantMap[snakeCase];
  }
  
  // Return "dynamic" to signal custom styling should be used
  return "dynamic";
};