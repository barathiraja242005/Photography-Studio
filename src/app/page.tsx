import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Films from "@/components/Films";
import Publications from "@/components/Publications";
import Testimonials from "@/components/Testimonials";
import CtaBanner from "@/components/CtaBanner";
import Instagram from "@/components/Instagram";
import Contact, { Footer } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative isolate">
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Films />
        <Publications />
        <Testimonials />
        <CtaBanner />
        <Instagram />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
