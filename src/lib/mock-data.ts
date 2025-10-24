export type DocumentItem = {
  id: number;
  code: string;
  title: string;
  slug: string;
  status?: "NEW" | "URGENT" | "UPDATED";
  category: string;
  issuedDate: string;
  time?: string;
  tags: string[];
  office?: string;
  description?: string;
  contentText?: string;
};

export type ReviewDocMock = {
  id: string;
  title: string;
  url: string;
  parsedText: string;
  updated_at?: string | null;
};

export const reviewDocs: ReviewDocMock[] = [
  {
    id: "doc-1",
    title: "Project Proposal Q4.pdf",
    url:
      "https://drutlxqnjmypjxwwxukv.supabase.co/storage/v1/object/public/documents/division_memo_pdf/Division_MemorandumNo_348_s_2025_CONDUCT_OF_THE_AGORA_CROSSROADS_OF_CREATIVITY_CULTURE_AND_IDEAS.pdf",
    parsedText: [
      "Project Proposal Q4",
      "",
      "This proposal outlines initiatives planned for Q4...",
    ].join("\n"),
    updated_at: null,
  },
  {
    id: "doc-2",
    title: "Financial_Report_2024.pdf",
    url:
      "https://drutlxqnjmypjxwwxukv.supabase.co/storage/v1/object/public/documents/division_memo_pdf/Division_MemorandumNo_360_s_2025_POTENTIAL_DATA_BREACH_INVOLVING_OUR_LOCALIZED_SYSTEM_TRACKIT_DOCUMENT_SYSTEM_DCP_ACCESS_ONLINE_MONIT.pdf",
    parsedText: [
      "Annual Financial Report - 2024 Executive Summary",
      "",
      "Revenue increased by 12% YoY...",
    ].join("\n"),
    updated_at: null,
  },
  {
    id: "doc-3",
    title: "Employee Handbook_Rev3.pdf",
    url:
      "https://drutlxqnjmypjxwwxukv.supabase.co/storage/v1/object/public/documents/division_memo_pdf/Division_MemorandumNo_367_s_2025_PARTICIPATION_IN_THE_SEMINAR_AND_GENERAL_ASSEMBLY_OF_PUBLIC_LIBRARIANS_AND_INFORMATION_PROFESSIONALS.pdf",
    parsedText: [
      "Employee Handbook (Revision 3)",
      "",
      "Welcome to the team!",
      "",
      "This handbook provides essential information about our",
      "company culture, policies, and procedures. Please read it",
      "carefully.",
      "",
      "Work Hours",
      "Standard work hours are from 9:00 AM to 5:00 PM, Monday to",
      "Friday, with a one-hour lunch break.",
      "",
      "Dress Code",
      "Our dress code is business casual. Please ensure you present",
      "a professional appearance at all times.",
      "",
      "Confidentiality",
      "All employees must sign a Non-Disclosure Agreement (NDA)",
      "and adhere to strict confidentiality protocols regarding",
      "company and client information.",
    ].join("\n"),
    updated_at: null,
  },
];

export type SearchResult = {
  id: number;
  code: string;
  title: string;
  slug: string;
  issuedDate: string;
  description: string;
  tags: string[];
  matchPercentage: number;
};

// Core document catalog
export const documents: DocumentItem[] = [
  {
    id: 1,
    code: "DO 022, s. 2023",
    title:
      "Implementing Guidelines on the School Calendar and Activities for SY 2023-2024",
    slug: "do-022-2023",
    status: "NEW",
    category: "Policy",
    issuedDate: "July 15, 2023",
    time: "2 hours ago",
    tags: ["Policy", "School Calendar"],
    office: "OSEC",
    description:
      "This Department Order establishes the official school calendar and activities for the 2023-2024 school year...",
    contentText:
      "I. Rationale\nThe Department of Education (DepEd) is committed to providing a learning environment that is safe... DepEd issues these implementing guidelines on the school calendar and activities for School Year 2023-2024...",
  },
  {
    id: 2,
    code: "DM-CI-2023-001",
    title: "National Learning Camp Guidelines",
    slug: "dm-ci-2023-001",
    status: "URGENT",
    category: "Curriculum",
    issuedDate: "August 01, 2023",
    time: "5 hours ago",
    tags: ["Memo", "Learning"],
    office: "Curriculum and Instruction",
    description:
      "Guidelines on the conduct of the National Learning Camp to address learning gaps...",
    contentText:
      "The National Learning Camp provides structured support and enrichment to learners...",
  },
  {
    id: 3,
    code: "DO 034, s. 2022",
    title: "School Calendar for SY 2022-2023",
    slug: "do-034-2022",
    status: "UPDATED",
    category: "Policy",
    issuedDate: "June 20, 2022",
    time: "1 day ago",
    tags: ["Policy", "School Calendar", "Sample tag", "waaa", "213232"],
    office: "OSEC",
    description:
      "Provides the school calendar for SY 2022-2023, including key schedules and activities...",
    contentText:
      "This order provides the official schedule for the school year 2022-2023...",
  },
  {
    id: 4,
    code: "DO 029, s. 2021",
    title: "Guidelines on the School Calendar for SY 2021-2022",
    slug: "do-029-2021",
    status: "UPDATED",
    category: "Policy",
    issuedDate: "July 1, 2021",
    time: "2 days ago",
    tags: ["Policy", "School Calendar"],
    office: "OSEC",
    description:
      "Guidelines on the School Calendar for school year 2021-2022...",
    contentText:
      "The guidelines outline the activities and timelines for the school year 2021-2022...",
  },
];

// Convenience collections for UI sections
export const latestIssuances: DocumentItem[] = [
  documents[0],
  documents[1],
  documents[2],
  documents[0], // reuse for mock density
];

export const recentlyViewed: DocumentItem[] = [
  documents[1],
  documents[1],
  documents[1],
  documents[1],
];

export const bookmarks: DocumentItem[] = [
  {
    ...documents[0],
    title:
      "DO 022, s. 2023 – Implementing Guidelines on the School Calendar and Activities for SY 2023-2024",
  },
];

// Search results with match percentages
export const mockSearchResults: SearchResult[] = [
  {
    id: 1,
    code: "DO 022, s. 2023",
    title:
      "Implementing Guidelines on the School Calendar and Activities for SY 2023-2024",
    slug: "do-022-2023",
    issuedDate: "July 15, 2023",
    description:
      "This Order provides the implementing guidelines on the school calendar and activities for School Year 2023-2024, ensuring that all schools adhere to the standard number of school days...",
    tags: ["Policy", "School Calendar"],
    matchPercentage: 95,
  },
  {
    id: 3,
    code: "DO 034, s. 2022",
    title: "School Calendar and Activities for the School Year 2022-2023",
    slug: "do-034-2022",
    issuedDate: "August 18, 2022",
    description:
      "To ensure that all learners have access to quality education, this Order provides the school calendar for SY 2022-2023, which includes the learning recovery program...",
    tags: ["Policy", "School Calendar", "Learning Recovery"],
    matchPercentage: 78,
  },
  {
    id: 2,
    code: "DM-CI-2023-001",
    title: "National Learning Camp Guidelines",
    slug: "dm-ci-2023-001",
    issuedDate: "January 05, 2023",
    description:
      "This memorandum outlines the guidelines for the National Learning Camp, a voluntary three to five-week program aimed to address learning gaps, scheduled during the end-of-school-year break...",
    tags: ["Program", "Learning Recovery"],
    matchPercentage: 55,
  },
];
