// College to departments mapping
export const COLLEGE_DEPARTMENTS: Record<string, string[]> = {
  CAS: ["Communication", "Psychology"],
  CCS: ["Computer Science", "Information Technology"],
  CBAA: [
    "Accountancy",
    "Accounting Information Systems",
    "Entrepreneurship",
    "Tourism Management",
  ],
  COED: [
    "Secondary Education Major in Science",
    "Secondary Education Major in Mathematics",
    "Secondary Education Major in English",
    "Secondary Education Major in PE",
    "Elementary Education",
  ],
  COEng: ["Mechanical Engineering"],
};

// College full names
export const COLLEGE_FULL_NAMES: Record<string, string> = {
  CAS: "College of Arts and Sciences",
  CCS: "College of Computer Studies",
  CBAA: "College of Business Administration and Accountancy",
  COED: "College of Education",
  COEng: "College of Engineering",
};

/**
 * Get departments for a specific college
 */
export function getDepartmentsForCollege(collegeCode: string): string[] {
  return COLLEGE_DEPARTMENTS[collegeCode] || [];
}
