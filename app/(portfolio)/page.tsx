import Hero from "../components/main/Hero";
import About from "../components/main/About";
import Skills from "../components/main/Skills";
import Projects from "../components/main/Projects";
import Testimonials from "../components/main/Testimonials";
import BlogTeaser from "../components/main/BlogTeaser";
import Contact from "../components/main/Contact";
import ContactFab from "../components/sub/ContactFab";
import { getLatestPosts } from "@/features/blog/services/queries";

export default async function Home() {
  const latestPosts = await getLatestPosts(3).catch(() => []);

  return (
    <main className="h-full w-full">
      <div className="flex flex-col">
        <Hero />
        <About />
        <Projects />
        <Testimonials />
        <Skills />
        <BlogTeaser posts={latestPosts} />
        <Contact />
        <ContactFab />
      </div>
    </main>
  );
}
