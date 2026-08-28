export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  company?: string;
}

// Populated once real client quotes are supplied. Never fabricate entries here.
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Daksh revamped our entire site to match our brand identity and was always available to work through any questions we had. He gave us an admin panel and CMS so we don't have to worry about monthly retainers. I really appreciate his transparent approach to the work.",
    name: "Gourav Kamboj",
    role: "Founder",
    company: "Chai Churi",
  },
  {
    quote:
      "I wanted a digital presence for my food joint, and I really liked the design Daksh delivered in just a week. Highly recommend him.",
    name: "Rajinder Singh",
    role: "Founder",
    company: "Sardaarji Amritsari Kulcha",
  },
  {
    quote:
      "Daksh developed the Workzo platform and brought his own insights as a developer, which led to core changes in the product design and features I hadn't spotted myself as a recruiter. Great guy to work with.",
    name: "Mayank Tulshyan",
    role: "Founder",
    company: "Workzo",
  },
  {
    quote:
      "Daksh worked with us for months on this project. When we changed our brand color, my team needed a design rework across several sections, and he handled it without any friction. Very helpful and professional engineer, and we'd love to keep working with him.",
    name: "Neelansh Singh",
    role: "CEO & Founder",
    company: "StartupKaro",
  },
  {
    quote:
      "Daksh helped develop the entire Flutter app and led a lot of critical engineering decisions. We're really thankful for all his effort, including the all-nighters he pulled with us to ship features on time. We got into Shark Tank India, and we owe a large part of that success to his work. You won't find a harder-working engineer.",
    name: "Steve Vora & Derek Almeida",
    role: "Founder & Co-Founder",
    company: "CASA",
  },
  {
    quote:
      "We needed to build an ERP from scratch for small factories, and someone recommended Daksh to build the V1. I appreciate the code architecture he followed, and my internal engineering team praises the codebase guidelines and polish. Thanks to that, we hit the market really fast.",
    name: "Hemanya Mehta",
    role: "Founder",
    company: "Makoro",
  },
  {
    quote:
      "I really liked the work. We closed the project in the first version itself since it was exactly what I wanted, and Daksh delivered on an urgent timeline. I'd definitely recommend him. Thanks a lot, many people have complimented the site.",
    name: "Aman Puri",
    role: "Chef",
  },
  {
    quote:
      "Daksh delivered the most beautiful site I could have asked for, the polish, fonts, and color scheme were all exactly on point. I love the work and would highly recommend him.",
    name: "Prerika",
    role: "Travel Blogger",
    company: "Where Peri Goes",
  },
];
