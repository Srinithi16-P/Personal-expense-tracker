import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { ValueProp } from "../components/landing/ValueProp";
import { Features } from "../components/landing/Features";
import { HowItWorks } from "../components/landing/HowItWorks";
import { CTA } from "../components/landing/CTA";
import { Footer } from "../components/landing/Footer";

const Landing = () => (
  <div className="min-h-screen bg-base-950">
    <Navbar />
    <Hero />
    <ValueProp />
    <Features />
    <HowItWorks />
    <CTA />
    <Footer />
  </div>
);

export default Landing;
