import { FileText, Search, Camera, Mail } from "lucide-react";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const features = [
  {
    icon: FileText,
    title: "AI Resume Generator",
    description: "Create professional, ATS-optimized resumes in minutes. Choose from multiple styles and download instantly as PDF.",
    href: "/generator",
    gradient: "from-blue-500/10 to-cyan-500/5",
  },
  {
    icon: Search,
    title: "Resume Analyzer",
    description: "Upload your resume and get instant feedback on ATS compatibility, keywords, grammar, and formatting.",
    href: "/analyzer",
    gradient: "from-purple-500/10 to-pink-500/5",
  },
  {
    icon: Camera,
    title: "Photo Generator",
    description: "Transform any photo into a professional headshot perfect for your resume with AI-powered enhancement.",
    href: "/photo",
    gradient: "from-orange-500/10 to-yellow-500/5",
  },
  {
    icon: Mail,
    title: "Cover Letter Generator",
    description: "Generate tailored cover letters for any job role. Stand out with compelling, personalized content.",
    href: "/cover-letter",
    gradient: "from-green-500/10 to-teal-500/5",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background">
      <div className="container px-4 sm:px-6">
        <SectionHeader
          badge="AI-Powered Tools"
          title="Everything You Need to Land Your Dream Job"
          description="Our suite of AI tools helps you create the perfect application package. Fast, free, and privacy-focused."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.href}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
