import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import Testimonials from "../components/Testimonials";
import BrandMarquee from "../components/BrandMarquee";


export default function Home() {
  return (
    <div className='overflow-hidden'>
      <Hero />
      <BrandMarquee />
      <LatestCollection />
      <BestSeller />
      <Testimonials />
      <OurPolicy />
      <NewsletterBox />
    </div>
  );
}