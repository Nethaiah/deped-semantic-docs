// /constants/badgeVariants.ts
import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

// 🔹 Define the allowed variant type
export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

// Convert string to snake_case for variant matching
function toSnakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\/\s]+/g, '_')  // Replace / and spaces with underscore
    .replace(/[^a-z0-9_]/g, '') // Remove special characters except underscore
    .replace(/_+/g, '_')        // Replace multiple underscores with single
    .replace(/^_|_$/g, '');     // Remove leading/trailing underscores
}

export const badgeVariantMap: Record<string, BadgeVariant> = {
  // === Categories ===
  "policy": "policy",
  "memo": "memo",
  "learning": "learning",
  "curriculum": "curriculum",
  "school calendar": "school_calendar",
  
  // === Office tags (normalized to snake_case) ===
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

// 🔹 Helper with correct return type
export const getBadgeVariant = (label: string): BadgeVariant => {
  const normalized = label.trim().toLowerCase();
  
  // First try direct lookup
  if (badgeVariantMap[normalized]) {
    return badgeVariantMap[normalized];
  }
  
  // If not found, try snake_case conversion
  const snakeCase = toSnakeCase(normalized);
  return (snakeCase as BadgeVariant) || "outline";
};