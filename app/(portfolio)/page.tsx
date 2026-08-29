import Hero from "../components/main/Hero";
import About from "../components/main/About";
import Skills from "../components/main/Skills";
import Projects from "../components/main/Projects";
import Testimonials from "../components/main/Testimonials";
import BlogTeaser from "../components/main/BlogTeaser";
import Contact from "../components/main/Contact";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col">
        <Hero />
        <About />
        <Projects />
        <Testimonials />
        <Skills />
        <BlogTeaser />
        <Contact />
      </div>
    </main>
  );
}
