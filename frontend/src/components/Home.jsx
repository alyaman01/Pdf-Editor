import Navbar from "./navbar";
import Hero from "./Hero";
import Tools from "./Tools";
import WhyChoose from "./WhyChoose";
import HowItWorks from "./HowItWorks";
import CTA from "./CTA";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Tools />
      <WhyChoose />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
};

export default Home;