import HeroSection from "@/components/sections/HeroSection";
import TrustBadges from "@/components/sections/TrustBadges";
import ShopByCategory from "@/components/sections/ShopByCategory";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import WhyOrganic from "@/components/sections/WhyOrganic";
import BestSellers from "@/components/sections/BestSellers";
import HealthBenefits from "@/components/sections/HealthBenefits";
import BlogsSection from "@/components/sections/BlogsSection";
import Testimonials from "@/components/sections/Testimonials";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <ShopByCategory />
      <FeaturedProducts />
      <WhyOrganic />
      <BestSellers />
      <HealthBenefits />
      <BlogsSection />
      <Testimonials />
      <Newsletter />
    </>
  );
}
