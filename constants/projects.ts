export type ProjectCategory = "web" | "mobile";

export interface Project {
  src: string;
  title: string;
  subtitle: string;
  tech: string;
  highlights: string[];
  category: ProjectCategory;
  archived?: boolean;
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
      "End-to-end platform for registration, licensing, taxation, and franchising",
      "Backed by chartered accountants, company secretaries, and lawyers",
      "Three coordinated panels: customer, employee, and admin",
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
      "Unifies production, inventory, dispatch, finance, and workforce in one ERP",
      "Work-order tracking with inventory and cash-health dashboards",
      "Tally integration plus a companion mobile view for the factory floor",
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
      "Helps employees manage and track their ESOPs",
      "Digital vesting document signing and option selling",
      "PayU payments with Firebase crashlytics and notifications",
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
      "Matches developers to jobs using GitHub and LeetCode activity",
      "ATS-ready resume builder and application tracking dashboard",
      "Separate flows for job seekers and recruiters",
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
      "GraphQL APIs, Firebase auth/crashlytics, Razorpay payments",
      "Shipped to the Play Store",
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
      "SaaS project management app with multi-role authentication",
      "Task assignment, progress tracking, comments, and attachments",
      "Shipped to Play Store and App Store",
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
      "Microsoft OAuth login built from Figma designs",
      "Firebase notifications and REST API integration",
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
      "Barcode scanning, customer signature and photo capture",
      "Firebase and REST API integration",
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
      "Delivery feedback and delivery instructions",
      "Firebase and REST API integration",
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
      "Mobile recharge app for customers in Afghanistan, Turkey, and Nepal",
      "Biometric login with PayPal and Stripe support",
      "Firebase push notifications",
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
      "Biometric login with REST API integration",
      "Firebase push notifications",
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
      "Case studies, service breakdown, and animated stat sections",
      "Built with a reusable, component-driven design system",
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
      "Brand site for a growing multi-city kulhad-chai cafe chain",
      "Animated hero with live outlet stats and menu access",
      "Franchise and careers info with cookie-consent-aware analytics",
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
      "Restaurant site built to drive dine-in, takeaway, and phone orders",
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
      "Firestore-backed menu, cart, and checkout",
      "Dual theme support with digital receipt display",
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
      "Site for a private chef serving clients across Canada and the US",
      "Services overview, testimonials, and FAQs",
      "Direct booking channels for catering and events",
    ],
    linkAUrl: "https://puriaman.com/",
    linkAText: "Visit Site",
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
      "Grok AI chatbot, smart search, and auto-filled ad details",
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
