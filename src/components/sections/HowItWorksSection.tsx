import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    number: "01",
    title: "Enter Your Details",
    description: "Fill in your work experience, education, and skills. Our smart forms make it easy.",
  },
  {
    number: "02",
    title: "AI Works Its Magic",
    description: "Our AI analyzes your input and generates optimized content tailored for ATS systems.",
  },
  {
    number: "03",
    title: "Download & Apply",
    description: "Preview your resume, make any tweaks, and download as a polished PDF instantly.",
  },
];

const benefits = [
  "ATS-optimized formatting",
  "Professional language enhancement",
  "Keyword optimization",
  "Multiple design templates",
  "Instant PDF download",
  "100% free, no hidden fees",
];

export const HowItWorksSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-secondary/30">
      <div className="container px-4 sm:px-6">
        <SectionHeader
          badge="Simple Process"
          title="Create Your Resume in 3 Easy Steps"
          description="No complicated software to learn. Just answer a few questions and let AI do the heavy lifting."
        />

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 md:gap-8 mb-12 sm:mb-16 md:mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-accent/50 to-transparent" />
              )}
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-accent/10 text-accent text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-xl sm:rounded-2xl border border-border p-5 sm:p-6 md:p-8 lg:p-10 shadow-card">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">What You Get</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent" />
                  </div>
                  <span className="text-sm sm:text-base text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
