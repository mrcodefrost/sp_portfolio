"use client";

import React from "react";
import ProjectCard from "../sub/ProjectCard";

const Projects = () => {
  return (
    <div
      className="flex flex-col items-center justify-center pb-40 z-[20]"
      id="projects"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-20">
        PROJECTS
      </h1>
      <div className="h-full w-full flex flex-col md:flex-row gap-10 px-10">
        <ProjectCard
          src="/lanceCoverPic.png"
          title="Lance - Ambulance Booking App"
          tech="Flutter, Firebase, Google Cloud Platform"
          description="Developed Flutter apps for user & driver with Firebase & Google Cloud Platform.
    User app features: account registration, fetches live location, display all nearbyambulances live location on map, list generation of live ambulances with ETA,pricing etc. for booking.
    Driver app features: driver & ambulance account registration, offline-online switching."
          githubUrl="https://github.com/mrcodefrost/hackrush_elementalists"
          demoUrl="https://www.youtube.com/watch?v=BABmU2zgKK0"

        />
        <ProjectCard
          src="/kriminalCoverPic.png"
          title="Fashion Ecommerce – Client & Admin Panel"
          tech="Flutter, Firebase, GetX"
          description="Created admin panel for web & client app for web & mobile. Deployed on Firebase hosting and Firestore as a database.
    Admin panel: allows CRUD operations of products. Material Design UI.
    Client app: Phone login, browsing, filtering, and sorting products with product details page. Dual theme."
          githubUrl="https://github.com/mrcodefrost/kriminal_fashion_client"
          demoUrl="https://kriminal-fashion.web.app/"
        />
        <ProjectCard
          src="/hungroCoverPic.png"
          title="Hungro – Restaurant Menu & Delivery App"
          tech="Flutter, Hive, Firebase, Provider"
          description="Developed an oriental cuisine restaurant cross-platform app built using Flutter for Android, iOS & web.
    Offers a seamless experience for users to explore the restaurant's menu, add items to their cart, and proceed to checkout.
    Features: Authentication, Firestore integration, menu, checkout process, dual theme, receipt display, cart management."
          githubUrl="https://github.com/mrcodefrost/hungro_food_delivery"
          demoUrl="https://hungro-50299.web.app/"
        />
      </div>
      <div className="py-10"></div>
      <div className="h-full w-full flex flex-col md:flex-row gap-10 px-10">
        <ProjectCard
          src="/cryptoWorldCoverPic.png"
          title="Crypto World"
          tech="Flutter Web, CoinGecko API, Firebase"
          description="Developed Flutter web app to track various Cryptocurrencies, NFTs, Exchanges.Deployed on Firebase Hosting.
           GetX for state management & info fetched using CoinGecko API.
           Features a glass-morphism inspired UI with both responsive and adaptive build."
          githubUrl="https://github.com/mrcodefrost/Crypto_World"
          demoUrl="https://cryptoworld-752e2.web.app/"

        />
        <ProjectCard
          src="/skytalkCoverPic.png"
          title="SkyTalk - Video Conference App"
          tech="Flutter, Firebase, Jitsi Meet"
          description=" Provides seamless & secure virtual meetings on mobile & web by integrating the Jitsi Meet.
          User authentication with Gmail, mute and camera controls, integrated chat, meetings history, and responsive design"
          githubUrl="https://github.com/mrcodefrost/SkyTalk_video_conference_app"
          demoUrl="https://github.com/mrcodefrost/SkyTalk_video_conference_app"
        />
        <ProjectCard
          src="/carsCoverPic.png"
          title="C.A.R.S - Crash Assistance & Rescue System"
          tech="Flutter, Arduino, C++"
          description="A Flutter app to detect car crashes and inform the close contacts with the location information 
          of the vehicle and medical information of the driver instantaneously with the help of a bluetooth connection to the Airbag Control Module of the vehicle."
          githubUrl="https://github.com/mrcodefrost/kjsce_220_volts"
          demoUrl="https://www.youtube.com/watch?v=V8RagUwjhj4"
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