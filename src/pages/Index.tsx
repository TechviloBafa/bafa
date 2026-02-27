import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { NoticeSection } from "@/components/home/NoticeSection";
import { PrincipalMessage } from "@/components/home/PrincipalMessage";
import { CourseHighlights } from "@/components/home/CourseHighlights";
import { BranchSection } from "@/components/home/BranchSection";
import { StatsSection } from "@/components/home/StatsSection";
import { CourseStructure } from "@/components/home/CourseStructure";
import { AdmissionDetails } from "@/components/home/AdmissionDetails";
import { AcademyRules } from "@/components/home/AcademyRules";
import { VideoGallerySection } from "@/components/home/VideoGallerySection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <NoticeSection />
      <CourseHighlights />
      <CourseStructure />
      <BranchSection />
      <PrincipalMessage />
      <AdmissionDetails />
      <AcademyRules />
      <VideoGallerySection />
      <StatsSection />
    </Layout>
  );
};

export default Index;
