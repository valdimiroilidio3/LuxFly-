import { Hero } from "@/components/home/Hero";
import { CompanySection } from "@/components/home/CompanySection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { DetailSection } from "@/components/home/DetailSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getProjects, getServices, getSettings, getStats, getTestimonials } from "@/lib/db";

export default async function HomePage() {
  const [projects, services, stats, testimonials, settings] = await Promise.all([
    getProjects({ publishedOnly: true }),
    getServices({ publishedOnly: true }),
    getStats({ publishedOnly: true }),
    getTestimonials({ publishedOnly: true }),
    getSettings(),
  ]);

  return (
    <>
      <Hero />
      <CompanySection />
      <ProjectsSection projects={projects.filter((p) => p.featured).slice(0, 4)} />
      <ServicesSection services={services} />
      <DetailSection />
      <ProcessSection />
      <StatsSection stats={stats} />
      <TestimonialsSection testimonials={testimonials} />
      <FinalCTA responseTime={settings.responseTime} />
    </>
  );
}
