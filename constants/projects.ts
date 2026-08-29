export type ProjectCategory = "web" | "mobile";

export interface Project {
  src: string;
  title: string;
  subtitle: string;
  tech: string;
  highlights: string[];
  category: ProjectCategory;
  archived?: boolean;
  award?: string;
  linkAUrl?: string;
  linkAText?: string;
  linkBUrl?: string;
  linkBText?: string;
}

// Order is a single impact ranking across both categories (most technically
// complex / business-credible first), not grouped by category. Filtering by
// category preserves this relative order, so Web and Mobile tabs inherit it.
// Projects with no live/verifiable link (no linkAUrl) are demoted to the end
// regardless of complexity, since ranking a linkless project highly looks bad.
export const PROJECTS: Project[] = [
  {
    src: "/startupKaroCoverPic.png",
    title: "StartupKaro",
    subtitle: "Startup Ecosystem Platform: Admin, Customer & Employee Panels",
    tech: "Next.js, TypeScript, Tailwind CSS, Node.js, PostgreSQL",
    category: "web",
    highlights: [
      "5,000+ clients onboarded across registration, compliance, and franchising at a 4.9/5 rating",
      "Three coordinated panels (customer, employee, admin) with Razorpay and PostHog",
      "Sanity-powered blog on a Next.js, Node.js, PostgreSQL stack",
    ],
    linkAUrl: "https://startupkaro.in/",
    linkAText: "Visit Site",
  },
  {
    src: "/makoroCoverPic.png",
    title: "Makoro",
    subtitle: "Manufacturing ERP for Small Businesses",
    tech: "Next.js, TypeScript, Tailwind CSS, Node.js, PostgreSQL",
    category: "web",
    highlights: [
      "Real-time inventory, cost, and yield recompute the instant a work order closes",
      "AI copilot turns voice or text, in English or Hinglish, into confirmed database entries",
      "Razorpay payments, WhatsApp alerts, and multi-unit, role-based access",
    ],
    linkAUrl: "https://www.makoro.co/",
    linkAText: "Visit Site",
  },
  {
    src: "/sundaeCoverPic.png",
    title: "Sundae Capital",
    subtitle: "Finance & ESOP Management App",
    tech: "Flutter, Firebase, Postman, Spring Boot, Apache Tomcat",
    category: "mobile",
    highlights: [
      "Built the entire 60+ screen Flutter app end to end from the client's Figma prototype",
      "Lets employees log in to view vested shares, contracts, and sell their ESOPs",
      "Managed releases on both the Play Store and App Store",
    ],
    linkAText: "Android",
    linkAUrl: "https://play.google.com/store/apps/details?id=com.sundaemf.sundaemf&hl=en_IN",
    linkBText: "iOS",
    linkBUrl: "https://apps.apple.com/in/app/sundae-mf/id6761365549",
  },
  {
    src: "/workzoCoverPic.png",
    title: "Workzo",
    subtitle: "Job Platform for Developers",
    tech: "Next.js, TypeScript, Tailwind CSS, Node.js, PostgreSQL",
    category: "web",
    highlights: [
      "16K+ users; GitHub, LeetCode, and resume signal in one score cut shortlist review by 42%",
      "Three panels (seeker, recruiter, admin) with Razorpay, SES, and S3 for resumes",
      "Backend on Railway, on a Next.js, Node.js, PostgreSQL stack",
    ],
    linkAUrl: "https://workzo.io/",
    linkAText: "Visit Site",
  },
  {
    src: "/casaCoverPic.png",
    title: "CASA - Swipe to shop",
    subtitle: "Quick Commerce Platform",
    tech: "Flutter, GraphQL, Firebase, Node.js, Google Cloud Platform",
    category: "mobile",
    highlights: [
      "Swipe-based product discovery, like a dating app for shopping",
      "Worked directly with founders across the stack, managing FE/BE teams and the admin panel",
      "Owned Flutter development and releases for an app later featured on Shark Tank India",
    ],
    linkAUrl: "https://play.google.com/store/apps/details?id=com.casashop.casaflutterapp",
    linkAText: "Android",
  },
  {
    src: "/workeazyCoverPic.png",
    title: "Workeazy",
    subtitle: "Project Management App",
    tech: "Flutter, Firebase, Node.js, AWS",
    category: "mobile",
    highlights: [
      "Multi-tenant, multi-role SaaS for Indian SMEs digitizing offline task tracking",
      "Task assignment, progress tracking, comments, and attachments across organizations",
      "Shipped to both the Play Store and App Store on a Flutter, Firebase, AWS stack",
    ],
    linkAText: "Android",
    linkAUrl: "https://play.google.com/store/apps/details?id=com.workeazy.workeazy",
    linkBText: "iOS",
    linkBUrl: "https://apps.apple.com/in/app/workeazy/id6550906973?platform=mac",
  },
  {
    src: "/interneCoverPic.png",
    title: "Interne",
    subtitle: "HR Management App",
    tech: "Flutter, Firebase, .NET, AWS",
    category: "mobile",
    highlights: [
      "HR app for attendance, leave, and work-from-home tracking",
      "Implemented Microsoft OAuth login built pixel-for-pixel from Figma designs",
      "Firebase notifications and REST API integration on a Flutter, .NET, AWS stack",
    ],
    linkAText: "Android",
    linkAUrl: "https://play.google.com/store/apps/details?id=com.minditsystems.interne",
    linkBText: "iOS",
    linkBUrl: "https://apps.apple.com/us/app/interne/id6747033560",
  },
  {
    src: "/pdsCoverPic.png",
    title: "PDS Partner",
    subtitle: "Prescription Delivery: Partner App",
    tech: "Flutter, Firebase, Node.js, AWS",
    category: "mobile",
    highlights: [
      "Partner app for UK prescription logistics and route planning",
      "Barcode scanning with customer signature and photo capture at delivery",
      "Firebase and REST API integration on a Flutter, Node.js, AWS stack",
    ],
    linkAText: "Android",
    linkAUrl: "https://play.google.com/store/apps/details?id=com.pds.partner",
    linkBText: "iOS",
    linkBUrl: "https://apps.apple.com/us/app/pds-partner/id6740516189",
  },
  {
    src: "/pdsCoverPic.png",
    title: "PDS Delivery",
    subtitle: "Prescription Delivery: Customer App",
    tech: "Flutter, Firebase, Node.js, AWS",
    category: "mobile",
    highlights: [
      "Customer app for real-time UK prescription delivery tracking",
      "Delivery feedback and instructions synced through REST APIs",
      "Firebase-backed push notifications on a Flutter, Node.js, AWS stack",
    ],
    linkAText: "Android",
    linkAUrl: "https://play.google.com/store/apps/details?id=com.pds.delivery",
    linkBText: "iOS",
    linkBUrl: "https://apps.apple.com/us/app/pds-delivery/id6740554446",
  },
  {
    src: "/shaadCoverPic.png",
    title: "Shaad Customer",
    subtitle: "Mobile Recharge App: Customer",
    tech: "Flutter, Firebase, Node.js, AWS",
    category: "mobile",
    highlights: [
      "Mobile recharge app for customers across Afghanistan, Turkey, and Nepal",
      "Biometric login with PayPal and Stripe payment integration",
      "Firebase push notifications on a Flutter, Node.js, AWS stack",
    ],
    linkAText: "Android",
    linkAUrl: "https://play.google.com/store/apps/details?id=com.shaad.customer",
    linkBText: "iOS",
    linkBUrl: "https://apps.apple.com/in/app/shaad-online/id6496685466",
  },
  {
    src: "/shaadCoverPic.png",
    title: "Shaad Dealer",
    subtitle: "Mobile Recharge App: Dealer",
    tech: "Flutter, Firebase, Node.js, AWS",
    category: "mobile",
    highlights: [
      "Dealer-facing app for the Shaad recharge platform",
      "Biometric login with REST API integration for dealer transactions",
      "Firebase push notifications on a Flutter, Node.js, AWS stack",
    ],
    linkAText: "Android",
    linkAUrl: "https://play.google.com/store/apps/details?id=com.shaad.retailer",
    linkBText: "iOS",
    linkBUrl: "https://apps.apple.com/us/app/shaad-business/id6480330967",
  },
  {
    src: "/synradLabsCoverPic.png",
    title: "Synrad Labs",
    subtitle: "Software Services Agency",
    tech: "Next.js, TypeScript, Tailwind CSS, Framer Motion",
    category: "web",
    highlights: [
      "Software studio site covering 10+ industries and 19+ delivered projects",
      "Case studies for Chai Churi, Workzo, and StartupKaro",
      "Sanity-powered blog on a reusable, component-driven Next.js/Framer Motion design system",
    ],
    linkAUrl: "https://synradlabs.com/",
    linkAText: "Visit Site",
  },
  {
    src: "/chaiChuriCoverPic.png",
    title: "Chai Churi",
    subtitle: "Cafe Website",
    tech: "Next.js, Tailwind CSS, Framer Motion",
    category: "web",
    highlights: [
      "Brand site for a chai chain with 200+ outlets across 60+ cities and 20L+ customers served",
      "No dedicated backend by design: Sanity CMS plus a PostHog-powered admin panel",
      "Franchise and careers info, deployed on Vercel",
    ],
    linkAUrl: "https://www.chaichuri.com/",
    linkAText: "Visit Site",
  },
  {
    src: "/sardaarjiCoverPic.png",
    title: "Sardaarji Amritsari Kulcha",
    subtitle: "Restaurant Website",
    tech: "Next.js, Tailwind CSS",
    category: "web",
    highlights: [
      "Restaurant site driving dine-in, takeaway, and phone orders, at 4.4/5 from 145+ reviews",
      "Menu browsing and franchise information",
      "One-tap \"Call to Order\" from the homepage",
    ],
    linkAUrl: "https://sardaarjiamritsarikulcha.netlify.app/",
    linkAText: "Visit Site",
  },
  {
    src: "/hungroCoverPic.png",
    title: "Hungro",
    subtitle: "Restaurant Menu & Delivery App",
    tech: "Flutter, Flutter Web, Hive, Firebase, Provider",
    category: "mobile",
    highlights: [
      "Cross-platform restaurant ordering app for oriental cuisine",
      "Firestore-backed menu, cart, and checkout with offline-first Hive caching",
      "Dual theme support with digital receipt display, deployed to web and GitHub",
    ],
    linkAText: "GitHub",
    linkAUrl: "https://github.com/mrcodefrost/hungro_food_delivery",
    linkBText: "Visit Site",
    linkBUrl: "https://hungro-50299.web.app/",
  },
  {
    src: "/puriAmanCoverPic.png",
    title: "Chef Aman Puri",
    subtitle: "Personal Chef Website (Canada)",
    tech: "Next.js, Tailwind CSS, Framer Motion",
    category: "web",
    highlights: [
      "Private chef site: a decade of experience, 500+ clients across Canada and the US",
      "Services span menu discovery, catering, private cheffing, and chef training",
      "Direct booking channels for catering and events, built with Next.js and Framer Motion",
    ],
    linkAUrl: "https://puriaman.com/",
    linkAText: "Visit Site",
  },
  {
    src: "/carsCoverPic.png",
    title: "C.A.R.S - Crash Assistance & Rescue System",
    subtitle: "Personal Safety App",
    tech: "Flutter, Arduino, C++",
    category: "mobile",
    award: "Hackathon Winner",
    highlights: [
      "Crash detection app paired via Bluetooth Low Energy to the vehicle's Airbag Control Module",
      "Automatically alerts emergency contacts with live location and medical data on impact",
      "Won at KJSCE Hack 5.0, hosted by K.J. Somaiya College of Engineering, Mumbai-77",
    ],
    linkAUrl: "https://github.com/mrcodefrost/kjsce_220_volts",
    linkAText: "GitHub",
    linkBUrl: "https://www.youtube.com/watch?v=V8RagUwjhj4",
    linkBText: "Watch Demo",
  },
  {
    src: "/aradhnamCoverPic.png",
    title: "Aradhnam",
    subtitle: "NBFC Consumer Loan Management App",
    tech: "Flutter, Firebase, .NET, AWS",
    category: "mobile",
    highlights: [
      "Consumer loan management app for an NBFC",
      "Multi-role support for dealers and field officers",
      "KYC via AuthBridge with Google Cloud location tracking",
    ],
    linkAUrl: "https://www.figma.com/proto/drR3gSqF0zy028gbMbX4wm/Aradhnam-Approved?node-id=4260-24186&starting-point-node-id=4260%3A24221&t=fZXbD4gQCE0a4X2T-1",
    linkAText: "Figma Prototype",
  },
  {
    src: "/findesyCoverPic.png",
    title: "FindEsy",
    subtitle: "Multi Vendor Ecommerce App",
    tech: "Flutter, Firebase, Grok AI, Node.js, AWS",
    category: "mobile",
    highlights: [
      "AI-powered marketplace for posting product/service ads",
      "Grok AI chatbot with smart search and LLM-driven auto-filled ad details",
      "Built on REST APIs with a Firebase backend",
    ],
  },
  {
    src: "/miraiCoverPic.png",
    title: "Mirai",
    subtitle: "Event Management App",
    tech: "Flutter, Firebase, Spring Boot",
    category: "mobile",
    highlights: [
      "Invite-only event app for participant discovery and scheduling",
      "Group creation and real-time notifications",
      "Spring Boot backend over REST APIs",
    ],
  },
];
