/**
 * Backwards-compatible re-exports of the colleges/departments taxonomy.
 *
 * The previous constants (``COLLEGE_DEPARTMENTS`` / ``COLLEGE_FULL_NAMES``)
 * have been replaced by the ``colleges`` and ``departments`` tables in
 * Supabase.  Use the helpers in ``./taxonomy`` for new code.
 *
 * The async helpers below are kept so existing imports keep compiling
 * while the call sites are migrated.
 */

export {
  getDepartmentsForCollege,
  getCollegeFullNames,
  getCollegeDepartments,
  getTaxonomy,
  TAXONOMY_CACHE_TAG,
  type CollegeRow,
  type DepartmentRow,
} from "./taxonomy";
