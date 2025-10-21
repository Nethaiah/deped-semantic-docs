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
