import { prisma } from "../../lib/prisma";
import { PostingService } from "../posting/posting.service";

export interface HomeStatItem {
  label: string;
  value: string;
  suffix?: string;
}

export interface HomeSlideStatItem {
  label: string;
  value: string;
}

export interface HomeSlideItem {
  eyebrow: string;
  title: string;
  description: string;
  stats: HomeSlideStatItem[];
}

export interface HomeFeatureItem {
  iconKey: "multi-role" | "approvals" | "operations";
  title: string;
  description: string;
}

export interface HomeStepItem {
  title: string;
  description: string;
}

export interface HomeQuoteItem {
  quote: string;
  name: string;
  role: string;
}

export interface HomeFaqItem {
  question: string;
  answer: string;
}

export interface HomeAboutItem {
  title: string;
  description: string;
  values: string[];
  highlights: string[];
}

export interface HomeBlogCardItem {
  title: string;
  excerpt: string;
  href: string;
  tag: string;
}

export interface HomeContentResponse {
  slides: HomeSlideItem[];
  stats: HomeStatItem[];
  features: HomeFeatureItem[];
  steps: HomeStepItem[];
  about: HomeAboutItem;
  testimonials: HomeQuoteItem[];
  faqs: HomeFaqItem[];
  blogPosts: HomeBlogCardItem[];
}

const formatCount = (value: number) => new Intl.NumberFormat("en").format(value);

const buildSummaryCard = (label: string, value: number, suffix = "") => ({
  label,
  value: formatCount(value),
  suffix,
});

const homeSlides: HomeSlideItem[] = [
  {
    eyebrow: "SaaS campus portal platform",
    title: "Run every institution in one unified portal.",
    description:
      "Sell a branded portal to institutions, then manage programs, departments, faculty, teachers, and students in one calm workspace.",
    stats: [],
  },
  {
    eyebrow: "Admission + hiring",
    title: "Publish openings and review applications faster.",
    description:
      "Create teacher and student postings, track approvals, and keep every review step visible for the right stakeholders.",
    stats: [],
  },
  {
    eyebrow: "Role-based workflow",
    title: "Give every role the right control panel.",
    description:
      "From institution admin to student, each workspace is purpose-built with scoped actions, notices, and academic operations.",
    stats: [],
  },
];

const features: HomeFeatureItem[] = [
  {
    iconKey: "multi-role",
    title: "Multi-role workspaces",
    description: "Owners, admins, faculty, teachers, and students each get a tailored view.",
  },
  {
    iconKey: "approvals",
    title: "Admissions and approvals",
    description: "Teachers and students apply to institutions and track approvals in real time.",
  },
  {
    iconKey: "operations",
    title: "Academic operations",
    description: "Manage attendance, assignments, quizzes, and results from one dashboard.",
  },
];

const steps: HomeStepItem[] = [
  {
    title: "Launch an institution portal",
    description: "Set up your institution, branding, and access rules in minutes.",
  },
  {
    title: "Configure programs and roles",
    description: "Add departments, faculty, teachers, students, and academic programs.",
  },
  {
    title: "Run daily operations",
    description: "Manage admissions, attendance, assignments, quizzes, and results.",
  },
];

const about: HomeAboutItem = {
  title: "One portal to serve every institution you manage.",
  description:
    "We blend admissions, academics, and communication so leadership teams stay in control while teachers focus on learning.",
  values: ["Role-based permissions", "Institution-ready workflows", "Scalable SaaS operations"],
  highlights: [
    "We launched a full portal for three campuses in one week.",
    "Admissions and approvals finally live in one place.",
    "Teachers and students love the clarity of the portal.",
  ],
};

const testimonials: HomeQuoteItem[] = [
  {
    quote: "We sell portals to institutions and everything is managed from one dashboard.",
    name: "Mira A.",
    role: "Platform Owner",
  },
  {
    quote: "Applications from teachers and students flow straight into approvals.",
    name: "Rahim S.",
    role: "Admissions Lead",
  },
  {
    quote: "Attendance, quizzes, and assignments are finally in sync across departments.",
    name: "Nadia T.",
    role: "Academic Operations",
  },
];

const faqs: HomeFaqItem[] = [
  {
    question: "How quickly can an institution start using Biddyaloy?",
    answer:
      "Most institutions complete onboarding in 1-3 days, including role setup, profile verification, and first workflow configuration.",
  },
  {
    question: "Does the platform support multiple departments and academic structures?",
    answer:
      "Yes. Biddyaloy supports institution, faculty, department, and program-level workflows with role-based access control.",
  },
  {
    question: "Can we manage teacher and student applications from one dashboard?",
    answer:
      "Yes. Application publishing, screening, review, and approval actions are centralized across admin workspaces.",
  },
  {
    question: "How are payments and renewals managed?",
    answer:
      "Subscription pricing, payment initiation, and renewal status are integrated directly into the institution administration workflow.",
  },
];

const buildBlogCard = (item: { id: string; postingType?: "teacher" | "student"; title: string; summary: string; createdAt: string }): HomeBlogCardItem => ({
  title: item.title,
  excerpt: item.summary,
  href: `/explore/${item.postingType ?? "teacher"}/${item.id}`,
  tag: item.postingType === "student" ? "Admission" : "Hiring",
});

const getContent = async (): Promise<HomeContentResponse> => {
  const [institutionCount, teacherExplore, studentExplore] = await Promise.all([
    prisma.institution.count(),
    PostingService.listPublicExplorePostings({ type: "teacher", page: 1, pageSize: 3, sort: "newest" }),
    PostingService.listPublicExplorePostings({ type: "student", page: 1, pageSize: 3, sort: "newest" }),
  ]);

  const teacherTotal = teacherExplore.pagination.total;
  const studentTotal = studentExplore.pagination.total;

  const topTeacherPost = teacherExplore.items[0];
  const topStudentPost = studentExplore.items[0];

  const slides: HomeSlideItem[] = [
    {
      ...homeSlides[0],
      stats: [
        buildSummaryCard("Institutions onboarded", institutionCount),
        buildSummaryCard("Open teacher jobs", teacherTotal),
        buildSummaryCard("Admission posts", studentTotal),
      ],
    },
    {
      ...homeSlides[1],
      stats: [
        buildSummaryCard("Teacher openings", teacherTotal),
        buildSummaryCard("Student admissions", studentTotal),
        buildSummaryCard("Live listings", teacherTotal + studentTotal),
      ],
    },
    {
      ...homeSlides[2],
      stats: [
        buildSummaryCard("Role dashboards", 6),
        buildSummaryCard("Public postings", teacherTotal + studentTotal),
        buildSummaryCard("Active institutions", institutionCount),
      ],
    },
  ];

  const blogPosts = [...teacherExplore.items, ...studentExplore.items]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 3)
    .map(buildBlogCard);

  return {
    slides,
    stats: [
      buildSummaryCard("Institutions onboarded", institutionCount, "+"),
      buildSummaryCard("Teacher openings", teacherTotal, "+"),
      buildSummaryCard("Admission posts", studentTotal, "+"),
      buildSummaryCard("Public workflows", teacherTotal + studentTotal, "+"),
    ],
    features,
    steps,
    about,
    testimonials,
    faqs,
    blogPosts: blogPosts.length > 0 ? blogPosts : [
      ...(topTeacherPost ? [buildBlogCard(topTeacherPost)] : []),
      ...(topStudentPost ? [buildBlogCard(topStudentPost)] : []),
    ],
  };
};

export const HomeService = {
  getContent,
};
