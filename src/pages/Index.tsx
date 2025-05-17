
import PageLayout from "@/components/PageLayout";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UserTypeCards from "@/components/UserTypeCards";
import Testimonial from "@/components/Testimonial";
import StatsSection from "@/components/StatsSection";
import CallToAction from "@/components/CallToAction";

const Index = () => {
  return (
    <PageLayout>
      <Hero />
      <StatsSection />
      <Features />
      <UserTypeCards />
      <Testimonial />
      <CallToAction />
    </PageLayout>
  );
};

export default Index;
