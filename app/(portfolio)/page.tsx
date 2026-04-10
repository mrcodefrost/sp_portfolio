import Hero from "../components/main/Hero";
import Skills from "../components/main/Skills";
import Projects from "../components/main/Projects";
import BlogTeaser from "../components/main/BlogTeaser";
import Contact from "../components/main/Contact";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col">
        <Hero />
        <Skills />
        <Projects />
        <BlogTeaser />
        <Contact />
      </div>
    </main>
  );
}
