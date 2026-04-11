"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "@/utils/motion";
import ProjectCard from "../sub/ProjectCard";

const PROJECTS = [
  {
    src: "/casaCoverPic.png",
    title: "CASA - Swipe to shop",
    subtitle: "Quick Commerce Platform",
    tech: "Flutter, GraphQL, Firebase, Node.js, Google Cloud Platform",
    description: `Ecommerce app featuring swipe-based product interaction like a dating app.

Integrated GraphQL for APIs, Firebase for auth, crashlytics, notifications, GetX for state management, and Razorpay for payments.

Features: swipe to like/dislike, explore section, cart, multi-platform deployment on Play Store and App Store.`,
    githubUrl: "https://github.com/mrcodefrost/casa_flutter/tree/development",
    demoUrl: "https://play.google.com/store/apps/details?id=com.casashop.casaflutterapp",
  },
  {
    src: "/shaadCoverPic.png",
    title: "Shaad - Customer & Dealer",
    subtitle: "Mobile Recharge App",
    tech: "Flutter, Firebase, Node.js, AWS EC2",
    description: `Recharge platform for Afghanistan, Turkey, and Nepal with separate apps for dealers and customers.

Features: Firebase push notifications, crashlytics, biometric login, REST API integration, PayPal and Stripe support.

Deployed on both Play Store and App Store.`,
    githubText: "Customer",
    githubUrl: "https://play.google.com/store/apps/details?id=com.shaad.customer",
    demoText: "Dealer",
    demoUrl: "https://play.google.com/store/apps/details?id=com.shaad.retailer",
  },
  {
    src: "/pdsCoverPic.png",
    title: "PDS Delivery & PDS Partner",
    subtitle: "Prescription Delivery & Tracking App",
    tech: "Flutter, Firebase, Node.js, AWS EC2",
    description: `Two dedicated apps for prescription logistics and customer delivery experience in the United Kingdom.

Partner app: route planning, barcode scanning, customer signature and photo capture.

Delivery app: real-time delivery tracking, feedback, and delivery instructions.

Integrated REST APIs and Firebase services.`,
    githubText: "Partner",
    githubUrl: "https://play.google.com/store/apps/details?id=com.pds.partner",
    demoText: "Delivery",
    demoUrl: "https://play.google.com/store/apps/details?id=com.pds.delivery",
  },
  {
    src: "/lanceCoverPic.png",
    title: "Lance",
    subtitle: "Ambulance Booking Apps - Patient & Driver",
    tech: "Flutter, Firebase, Google Cloud Platform",
    description: `Cross-platform app for emergency ambulance booking, built for both patients and drivers.

User app: account registration, live location tracking, real-time nearby ambulance visibility, ETA and pricing info for booking.

Driver app: account registration for drivers and ambulances, toggle availability online/offline.`,
    githubUrl: "https://github.com/mrcodefrost/hackrush_elementalists",
    demoUrl: "https://www.youtube.com/watch?v=BABmU2zgKK0",
  },
  {
    src: "/kriminalCoverPic.png",
    title: "Kriminal Fashion",
    subtitle: "Ecommerce App - Client & Admin Panel",
    tech: "Flutter, Flutter Web, Firebase, GetX",
    description: `Full-stack ecommerce platform with separate admin panel and client app for web and mobile.

Admin panel: manage products with CRUD operations using a Material Design UI.

Client app: phone authentication, product browsing with filters and sorting, product detail view, and dual theme support.`,
    githubUrl: "https://github.com/mrcodefrost/kriminal_fashion_client",
    demoUrl: "https://kriminal-fashion.web.app/",
  },
  {
    src: "/hungroCoverPic.png",
    title: "Hungro",
    subtitle: "Restaurant Menu & Delivery App",
    tech: "Flutter, Flutter Web, Hive, Firebase, Provider",
    description: `Cross-platform restaurant app for exploring menus and placing orders for oriental cuisine.

Features: user authentication, Firestore integration, item selection, cart, checkout, dual theme support, digital receipt display.`,
    githubUrl: "https://github.com/mrcodefrost/hungro_food_delivery",
    demoUrl: "https://hungro-50299.web.app/",
  },
  {
    src: "/workeazyCoverPic.png",
    title: "Workeazy",
    subtitle: "Project Management App",
    tech: "Flutter, Firebase, Node.js, AWS EC2",
    description: `Comprehensive SAAS-based project management app with multi-role authentication.

Features: create/manage projects, assign tasks, track progress, comments, attachments, and user management.
REST APIs and Firebase integration. Available on Play Store and App Store.`,
    demoUrl: "https://play.google.com/store/apps/details?id=com.workeazy.workeazy",
  },
  {
    src: "/interneCoverPic.png",
    title: "Interne",
    subtitle: "HR Management App",
    tech: "Flutter, Firebase, .NET, AWS EC2",
    description: `HR operations app covering attendance, leave requests, work-from-home, and punch-in/out timing.

UI based on Figma designs. Integrated Microsoft OAuth, Firebase notifications, and REST APIs.`,
    demoUrl: "https://play.google.com/store/apps/details?id=com.minditsystems.interne",
  },
  {
    src: "/miraiCoverPic.png",
    title: "Mirai",
    subtitle: "Event Management App",
    tech: "Flutter, Firebase, Spring Boot",
    description: `Invite-only event app enabling participant discovery, group creation, and schedule tracking.

Integrated Firebase for notifications and Spring Boot backend via REST APIs.`,
  },
  {
    src: "/sundaeCoverPic.png",
    title: "Sundae Capital",
    subtitle: "Finance & ESOP Management App",
    tech: "Flutter, Firebase, Postman, Spring Boot, Apache Tomcat",
    description: `App for employees to manage and track their ESOPs, sign vesting documents, and sell options.

Features: API testing via Postman scripts, PayU payment gateway, Firebase crashlytics and notifications.`,
  },
  {
    src: "/aradhnamCoverPic.png",
    title: "Aradhnam",
    subtitle: "NBFC Consumer Loan Management App",
    tech: "Flutter, Firebase, .NET, AWS EC2",
    description: `Loan management app for an NBFC with multi-role support including dealers and field officers.

Features: loan application, approval, repayments, KYC via AuthBridge, map/location tracking via Google Cloud.`,
  },
  {
    src: "/findesyCoverPic.png",
    title: "FindEsy",
    subtitle: "Multi Vendor Ecommerce App",
    tech: "Flutter, Firebase, Grok AI, Node.js, AWS EC2",
    description: `AI-powered marketplace app allowing users to post product/service ads.

Grok AI integrated for chatbot, smart search, product suggestions, and auto-filling ad details.
Built using REST APIs and Firebase.`,
  },
  {
    src: "/cryptoWorldCoverPic.png",
    title: "Crypto World",
    subtitle: "Crypto Tracking Web App",
    tech: "Flutter Web, CoinGecko API, Firebase",
    description: `Web app to monitor cryptocurrencies, NFTs, and exchanges using CoinGecko API.

Built with a glassmorphism-inspired responsive UI.
Deployed on Firebase Hosting.`,
    githubUrl: "https://github.com/mrcodefrost/Crypto_World",
    demoUrl: "https://cryptoworld-752e2.web.app/",
  },
  {
    src: "/skytalkCoverPic.png",
    title: "SkyTalk",
    subtitle: "Video Conference App",
    tech: "Flutter, Firebase, Jitsi Meet",
    description: `Secure video conferencing app supporting web and mobile.

Features: Gmail login, mute/camera toggles, chat, meeting history, and responsive layout via Jitsi Meet SDK.`,
    githubUrl: "https://github.com/mrcodefrost/SkyTalk_video_conference_app",
  },
  {
    src: "/carsCoverPic.png",
    title: "C.A.R.S - Crash Assistance & Rescue System",
    subtitle: "Personal Safety App",
    tech: "Flutter, Arduino, C++",
    description: `Crash detection app connected via Bluetooth to the vehicle's Airbag Control Module.

Automatically notifies emergency contacts with live location and medical data upon impact.`,
    githubUrl: "https://github.com/mrcodefrost/kjsce_220_volts",
    demoUrl: "https://www.youtube.com/watch?v=V8RagUwjhj4",
  },
];

const INITIAL_DESKTOP = 6;
const INITIAL_MOBILE = 3;

const Projects = () => {
  const [expanded, setExpanded] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center py-20 z-[20]"
      id="projects"
    >
      <motion.h1
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={slideInFromTop}
        className="text-[40px] font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-cyan-500 mb-10"
      >
        PROJECTS
      </motion.h1>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={slideInFromLeft(0.3)}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 px-10"
      >
        {PROJECTS.map((project, index) => {
          let className = "flex";
          if (!expanded) {
            if (index >= INITIAL_DESKTOP) {
              className = "hidden";
            } else if (index >= INITIAL_MOBILE) {
              className = "hidden md:flex";
            }
          }
          return (
            <div key={project.title} className={className}>
              <ProjectCard {...project} />
            </div>
          );
        })}
      </motion.div>

      {!expanded && (
        <motion.button
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={slideInFromRight(0.5)}
          onClick={() => setExpanded(true)}
          className="mt-12 py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg border border-[#7042f88b] text-sm font-medium transition-all duration-300"
        >
          View More Projects
        </motion.button>
      )}
    </div>
  );
};

export default Projects;
