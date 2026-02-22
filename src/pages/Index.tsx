import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { NoticeSection } from "@/components/home/NoticeSection";
import { PrincipalMessage } from "@/components/home/PrincipalMessage";
import { CourseHighlights } from "@/components/home/CourseHighlights";
import { BranchSection } from "@/components/home/BranchSection";
import { StatsSection } from "@/components/home/StatsSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <NoticeSection />
      <CourseHighlights />
      <BranchSection />
      <PrincipalMessage />
      <StatsSection />
    </Layout>
  );
};

export default Index;
