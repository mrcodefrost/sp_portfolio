import React from "react";
import ProjectCard from "../sub/ProjectCard";

const Projects = () => {
  return (
    <div
      className="flex flex-col items-center justify-center pb-40"
      id="projects"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-20">
        PROJECTS
      </h1>
      <div className="h-full w-full flex flex-col md:flex-row gap-10 px-10">
        <ProjectCard
          src="/NextWebsite.png"
          title="Lance - Ambulance Booking App"
          description="Developed Flutter apps for user & driver with Firebase & Google Cloud Platform.
User app features: account registration, fetches live location, display all nearbyambulances live location on map, list generation of live ambulances with ETA,pricing etc. for booking.
Driver app features: driver & ambulance account registration, offline-online switching."
        />
        <ProjectCard
          src="/CardImage.png"
          title="Fashion Ecommerce – Client & Admin Panel"
          description="Created admin panel for web & client app for web & mobile. Deployed on Firebase hosting and Firestore as a database.
Admin panel: allows CRUD operations of products. Material Design UI.
Client app: Phone login, browsing, filtering, and sorting products with product details page. Dual theme."
        />
        <ProjectCard
          src="/SpaceWebsite.png"
          title="Hungro – Restaurant Menu & Delivery App"
          description="Developed an oriental cuisine restaurant cross-platform app built using Flutter for Android, iOS & web.
Offers a seamless experience for users to explore the restaurant's menu, add items to their cart, and proceed to checkout.
Features: Authentication, Firestore integration, menu, checkout process, dual theme, receipt display, cart management."
        />
      </div>
      <div className="py-10"></div>
      {/* <div className="h-full w-full flex flex-col md:flex-row gap-10 px-10">
        <ProjectCard
          src="/NextWebsite.png"
          title="Lance - Ambulance Booking App"
          description="Developed Flutter apps for user & driver with Firebase & Google Cloud Platform.
User app features: account registration, fetches live location, display all nearbyambulances live location on map, list generation of live ambulances with ETA,pricing etc. for booking.
Driver app features: driver & ambulance account registration, offline-online switching."
        />
        <ProjectCard
          src="/CardImage.png"
          title="Fashion Ecommerce – Client & Admin Panel"
          description="Created admin panel for web & client app for web & mobile. Deployed on Firebase hosting and Firestore as a database.
Admin panel: allows CRUD operations of products. Material Design UI.
Client app: Phone login, browsing, filtering, and sorting products with product details page. Dual theme."
        />
        <ProjectCard
          src="/SpaceWebsite.png"
          title="Hungro – Restaurant Menu & Delivery App"
          description="Developed an oriental cuisine restaurant cross-platform app built using Flutter for Android, iOS & web.
Offers a seamless experience for users to explore the restaurant's menu, add items to their cart, and proceed to checkout.
Features: Authentication, Firestore integration, menu, checkout process, dual theme, receipt display, cart management."
        />
      </div> */}
    </div>
  );
};

export default Projects;